import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(httpServer: Server, app: Express): Promise<void> {
  // Seed on startup
  storage.seedIfEmpty();

  app.get("/api/competitors", (_req, res) => {
    const data = storage.getAllCompetitors();
    res.json(data);
  });

  app.get("/api/competitors/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const item = storage.getCompetitor(id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });
}
