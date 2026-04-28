import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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

export const targetProduct = pgTable(
  "target_product",
  {
    productId: text("product_id").primaryKey(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    productDescription: text("product_description"),
    rating: numeric("rating", { precision: 3, scale: 2 }),
    reviewsCount: integer("reviews_count"),
    initialPrice: numeric("initial_price", { precision: 10, scale: 2 }),
    finalPrice: numeric("final_price", { precision: 10, scale: 2 }),
    currency: text("currency"),
    sellerName: text("seller_name"),
    breadcrumbs: jsonb("breadcrumbs").$type<string[]>().default([]).notNull(),
    relatedCategories: jsonb("related_categories")
      .$type<string[]>()
      .default([])
      .notNull(),
    images: jsonb("images").$type<string[]>().default([]).notNull(),
    productSpecifications: jsonb("product_specifications").$type<
      Record<string, string | string[] | null>
    >(),
    shippingReturnsPolicy: text("shipping_returns_policy"),
    amountOfStars: jsonb("amount_of_stars").$type<Record<string, number>>(),
    recommendations: jsonb("recommendations").$type<
      Array<Record<string, unknown> | string>
    >()
      .default([])
      .notNull(),
    findAlternative: jsonb("find_alternative").$type<
      Array<Record<string, unknown> | string>
    >()
      .default([])
      .notNull(),
    summaryOfReviews: text("summary_of_reviews"),
    primaryCategory: text("primary_category"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("target_product_primaryCategory_idx").on(table.primaryCategory),
    index("target_product_finalPrice_idx").on(table.finalPrice),
    index("target_product_rating_idx").on(table.rating),
  ],
);

export const recommendationRun = pgTable(
  "recommendation_run",
  {
    id: text("id").primaryKey(),
    sourceProductId: text("source_product_id")
      .notNull()
      .references(() => targetProduct.productId, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    payload: jsonb("payload")
      .$type<
        Array<{
          productId: string;
          score: number;
          reasons: string[];
        }>
      >()
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("recommendation_run_sourceProductId_idx").on(table.sourceProductId)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
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

export const targetProductRelations = relations(targetProduct, ({ many }) => ({
  recommendationRuns: many(recommendationRun),
}));

export const recommendationRunRelations = relations(recommendationRun, ({ one }) => ({
  sourceProduct: one(targetProduct, {
    fields: [recommendationRun.sourceProductId],
    references: [targetProduct.productId],
  }),
}));
