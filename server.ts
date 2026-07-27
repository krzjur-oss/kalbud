import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Brak klucza GEMINI_API_KEY w konfiguracji.");
  }
  return new GoogleGenAI({ apiKey });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// AI Advisor for construction questions
app.post("/api/ai-advisor", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Brak treści zapytania." });
    }

    const ai = getGeminiClient();
    const systemInstruction = `Jesteś doświadczonym inżynierem budowlanym i doradcą technicznym specjalizującym się w budowie tarasów, opasek wokół budynków, pracach brukarskich, fundamentowych i wykonaniu zadaszeń z drewna w warunkach klimatycznych Polski.
Odpowiadaj po polsku, fachowo, zwięźle i praktycznie.
Udzielaj konkretnych porad wykonawczych (np. głębokość przemarzania gruntu w Polsce 0.8-1.2m, rodzaje tłucznia 0-31.5mm / 31.5-63mm, zagęszczanie warstwami max 15cm, spadek dachu min. 5°, jakość drewna C24 / KVH / BSH, zabezpieczenie obrzeży podsypką betonową z oporem/klinem betonowym, zabezpieczenie geowłókniną, dreny przy opasce).
Kontekst obliczeń użytkownika: ${JSON.stringify(context || {})}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Error in AI advisor:", err);
    res.status(500).json({ error: err.message || "Błąd podczas generowania odpowiedzi AI." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
