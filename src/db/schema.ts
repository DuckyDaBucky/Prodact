import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  employeeId: text("employee_id").notNull().unique(),
  role: text("role").default("employee"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const directConversation = pgTable(
  "direct_conversation",
  {
    id: text("id").primaryKey(),
    participantOneId: text("participant_one_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    participantTwoId: text("participant_two_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("direct_conversation_participants_idx").on(
      table.participantOneId,
      table.participantTwoId,
    ),
    index("direct_conversation_participant_one_idx").on(table.participantOneId),
    index("direct_conversation_participant_two_idx").on(table.participantTwoId),
  ],
);

export const directMessage = pgTable(
  "direct_message",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => directConversation.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("direct_message_conversation_idx").on(table.conversationId),
    index("direct_message_sender_idx").on(table.senderId),
  ],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  sentMessages: many(directMessage),
  conversationsAsParticipantOne: many(directConversation, {
    relationName: "participantOne",
  }),
  conversationsAsParticipantTwo: many(directConversation, {
    relationName: "participantTwo",
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const directConversationRelations = relations(directConversation, ({ one, many }) => ({
  participantOne: one(user, {
    fields: [directConversation.participantOneId],
    references: [user.id],
    relationName: "participantOne",
  }),
  participantTwo: one(user, {
    fields: [directConversation.participantTwoId],
    references: [user.id],
    relationName: "participantTwo",
  }),
  messages: many(directMessage),
}));

export const directMessageRelations = relations(directMessage, ({ one }) => ({
  conversation: one(directConversation, {
    fields: [directMessage.conversationId],
    references: [directConversation.id],
  }),
  sender: one(user, {
    fields: [directMessage.senderId],
    references: [user.id],
  }),
}));
