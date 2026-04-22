import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";

import { db } from "@/db";
import { directConversation, directMessage, user } from "@/db/schema";

export type RecipientSummary = {
  id: string;
  name: string;
  employeeId: string;
};

export type MessageThreadSummary = {
  recipient: RecipientSummary;
  lastMessage: {
    body: string;
    createdAt: string;
    senderId: string;
  } | null;
};

export type MessageDetails = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
};

export type MessageThread = {
  recipient: RecipientSummary;
  messages: MessageDetails[];
};

function normalizeParticipants(firstUserId: string, secondUserId: string) {
  return [firstUserId, secondUserId].sort((left, right) => left.localeCompare(right)) as [
    string,
    string,
  ];
}

function formatRecipientSummary(record: Pick<typeof user.$inferSelect, "id" | "name" | "employeeId">): RecipientSummary {
  return {
    id: record.id,
    name: record.name,
    employeeId: record.employeeId,
  };
}

async function getConversationRecord(currentUserId: string, otherUserId: string) {
  const [participantOneId, participantTwoId] = normalizeParticipants(currentUserId, otherUserId);

  return db.query.directConversation.findFirst({
    where: and(
      eq(directConversation.participantOneId, participantOneId),
      eq(directConversation.participantTwoId, participantTwoId),
    ),
  });
}

async function ensureConversation(currentUserId: string, otherUserId: string) {
  const existingConversation = await getConversationRecord(currentUserId, otherUserId);

  if (existingConversation) {
    return existingConversation;
  }

  const [participantOneId, participantTwoId] = normalizeParticipants(currentUserId, otherUserId);

  await db
    .insert(directConversation)
    .values({
      id: crypto.randomUUID(),
      participantOneId,
      participantTwoId,
    })
    .onConflictDoNothing();

  const conversation = await getConversationRecord(currentUserId, otherUserId);

  if (!conversation) {
    throw new Error("Unable to create a conversation for these users.");
  }

  return conversation;
}

export async function lookupRecipients(currentUserId: string, rawQuery: string) {
  const query = rawQuery.trim();

  if (query.length < 2) {
    return [];
  }

  const users = await db.query.user.findMany({
    columns: {
      id: true,
      name: true,
      employeeId: true,
    },
    where: or(ilike(user.name, `%${query}%`), ilike(user.employeeId, `%${query}%`)),
    orderBy: [asc(user.name)],
    limit: 8,
  });

  return users
    .filter((candidate) => candidate.id !== currentUserId)
    .map((candidate) => formatRecipientSummary(candidate));
}

export async function listThreads(currentUserId: string): Promise<MessageThreadSummary[]> {
  const conversations = await db.query.directConversation.findMany({
    where: or(
      eq(directConversation.participantOneId, currentUserId),
      eq(directConversation.participantTwoId, currentUserId),
    ),
    orderBy: [desc(directConversation.updatedAt)],
  });

  if (conversations.length === 0) {
    return [];
  }

  const otherParticipantIds = conversations.map((conversation) =>
    conversation.participantOneId === currentUserId
      ? conversation.participantTwoId
      : conversation.participantOneId,
  );

  const recipients = await db.query.user.findMany({
    columns: {
      id: true,
      name: true,
      employeeId: true,
    },
    where: inArray(user.id, otherParticipantIds),
  });

  const recipientMap = new Map(
    recipients.map((record) => [record.id, formatRecipientSummary(record)]),
  );

  const latestMessages = await Promise.all(
    conversations.map(async (conversation) => {
      const message = await db.query.directMessage.findFirst({
        columns: {
          body: true,
          createdAt: true,
          senderId: true,
        },
        where: eq(directMessage.conversationId, conversation.id),
        orderBy: [desc(directMessage.createdAt)],
      });

      return [conversation.id, message] as const;
    }),
  );

  const latestMessageMap = new Map(latestMessages);

  return conversations.flatMap((conversation) => {
    const recipientId =
      conversation.participantOneId === currentUserId
        ? conversation.participantTwoId
        : conversation.participantOneId;
    const recipient = recipientMap.get(recipientId);

    if (!recipient) {
      return [];
    }

    const latestMessage = latestMessageMap.get(conversation.id);

    return [
      {
        recipient,
        lastMessage: latestMessage
          ? {
              body: latestMessage.body,
              createdAt: latestMessage.createdAt.toISOString(),
              senderId: latestMessage.senderId,
            }
          : null,
      },
    ];
  });
}

export async function getThread(currentUserId: string, otherUserId: string): Promise<MessageThread | null> {
  if (currentUserId === otherUserId) {
    return null;
  }

  const recipient = await db.query.user.findFirst({
    columns: {
      id: true,
      name: true,
      employeeId: true,
    },
    where: eq(user.id, otherUserId),
  });

  if (!recipient) {
    return null;
  }

  const conversation = await getConversationRecord(currentUserId, otherUserId);
  const messages = conversation
    ? await db.query.directMessage.findMany({
        columns: {
          id: true,
          body: true,
          createdAt: true,
          senderId: true,
        },
        where: eq(directMessage.conversationId, conversation.id),
        orderBy: [asc(directMessage.createdAt)],
      })
    : [];

  return {
    recipient: formatRecipientSummary(recipient),
    messages: messages.map((message) => ({
      id: message.id,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
      senderId: message.senderId,
    })),
  };
}

export async function sendMessageToRecipient(
  currentUserId: string,
  recipientId: string,
  body: string,
) {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    throw new Error("Message body cannot be empty.");
  }

  if (currentUserId === recipientId) {
    throw new Error("You cannot send a message to yourself.");
  }

  const recipient = await db.query.user.findFirst({
    columns: {
      id: true,
    },
    where: eq(user.id, recipientId),
  });

  if (!recipient) {
    throw new Error("That employee could not be found.");
  }

  const conversation = await ensureConversation(currentUserId, recipientId);
  const sentAt = new Date();

  await db.insert(directMessage).values({
    id: crypto.randomUUID(),
    conversationId: conversation.id,
    senderId: currentUserId,
    body: trimmedBody,
    createdAt: sentAt,
  });

  await db
    .update(directConversation)
    .set({
      updatedAt: sentAt,
    })
    .where(eq(directConversation.id, conversation.id));

  const thread = await getThread(currentUserId, recipientId);

  if (!thread) {
    throw new Error("Unable to load the updated conversation.");
  }

  return thread;
}
