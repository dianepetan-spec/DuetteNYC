import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const competitors = sqliteTable("competitors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  segment: text("segment").notNull(),
  garmentFocus: text("garment_focus").notNull(),
  targetCustomer: text("target_customer").notNull(),
  annualRevenue: text("annual_revenue").notNull(),
  priceRange: text("price_range").notNull(),
  priceTier: text("price_tier").notNull(),
  seoKeywords: text("seo_keywords").notNull(), // JSON array
  marketingStrategy: text("marketing_strategy").notNull(),
  primaryChannels: text("primary_channels").notNull(), // JSON array
  heroHeadline: text("hero_headline").notNull(),
  heroCta: text("hero_cta").notNull(),
  trustSignals: text("trust_signals").notNull(), // JSON array
  promoOffer: text("promo_offer").notNull(),
  conversionScore: integer("conversion_score").notNull(), // 1-10
  bestPractices: text("best_practices").notNull(), // JSON array
  replicableInsights: text("replicable_insights").notNull(), // JSON array
  reviewCount: text("review_count").notNull(),
  rating: text("rating").notNull(),
  hasBestseller: integer("has_bestseller").notNull(), // 0 or 1
  hasSustainability: integer("has_sustainability").notNull(), // 0 or 1
  hasPetiteTall: integer("has_petite_tall").notNull(), // 0 or 1
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({ id: true });
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitors.$inferSelect;
