// The dashboard is now a static site served by Netlify. `client/public/competitors.json`
// is the source of truth and is refreshed weekly by the Monday cron. The Drizzle table
// definition below is retained only for the legacy Express server; the client reads the
// JSON directly and uses the TypeScript `Competitor` type defined here.

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Legacy Drizzle table (unused by the deployed client).
export const competitors = sqliteTable("competitors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

// v3 shape — this is what /competitors.json returns per row.
export interface Competitor {
  id: string;              // slug, e.g. "duettenyc"
  name: string;
  tier: 1 | 2 | 3 | "self";
  weekOf: string;          // "YYYY-MM-DD"

  // Static — refreshed only on QUARTERLY runs
  url: string;
  segment: string;
  garmentFocus: string;
  targetCustomer: string;
  annualRevenue: string;
  priceTier: string;
  marketingStrategy: string;
  primaryChannels: string[];
  bestPractices: string[];
  replicableInsights: string[];
  hasSustainability: 0 | 1;
  hasPetiteTall: 0 | 1;

  // Weekly
  heroProductUrl: string | null;
  heroProductName: string | null;
  heroProductPrice: string | null;
  priceRange: string | null;
  reviewCount: number | null;
  rating: number | null;
  hasBestseller: boolean;
  heroHeadline: string | null;
  heroCta: string | null;
  promoOffer: string | null;
  trustSignals: string[];
  seoKeywords: string[];
  conversionScore: number;
  weekChange: string;
  notes: string;

  // Traffic
  monthlyVisits: number | null;
  authorityScore: number | null;
  globalRank: number | null;
  usRank: number | null;
  trafficSource: string | null;

  // Semrush (unused until connected)
  organicTraffic: number | null;
  organicKeywords: number | null;
  paidTraffic: number | null;
  semrushUpdated: boolean;
}

export type InsertCompetitor = Competitor;
