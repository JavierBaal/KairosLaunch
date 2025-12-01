import { pgTable, text, timestamp, json, varchar, unique } from "drizzle-orm/pg-core";

// Product Configuration Table
export const productConfig = pgTable("product_config", {
  id: text("id").primaryKey(),
  productId: varchar("product_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  marketplace: varchar("marketplace", { length: 100 }).notNull(),
  itemId: varchar("item_id", { length: 255 }).notNull(),
  repositoryOwner: varchar("repository_owner", { length: 255 }).notNull(),
  repositoryName: varchar("repository_name", { length: 255 }).notNull(),
  config: json("config").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Installation Tracking Table
export const installation = pgTable(
  "installation",
  {
    id: text("id").primaryKey(),
    productId: varchar("product_id", { length: 255 }).notNull(),
    purchaseCode: varchar("purchase_code", { length: 255 }).notNull(),
    userEmail: varchar("user_email", { length: 255 }).notNull(),
    vercelDeploymentUrl: text("vercel_deployment_url").notNull(),
    vercelProjectId: varchar("vercel_project_id", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(), // 'success' | 'failed' | 'pending'
    errorMessage: text("error_message"),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueProductPurchase: unique().on(table.productId, table.purchaseCode),
  })
);

// Audit Log Table
export const auditLog = pgTable("audit_log", {
  id: text("id").primaryKey(),
  action: varchar("action", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }),
  details: json("details").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Export types
export type ProductConfig = typeof productConfig.$inferSelect;
export type NewProductConfig = typeof productConfig.$inferInsert;
export type Installation = typeof installation.$inferSelect;
export type NewInstallation = typeof installation.$inferInsert;
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;

