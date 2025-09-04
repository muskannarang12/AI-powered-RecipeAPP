import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors()); // Expo app se connect karne ke liye
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ AI Chef Backend is running...");
});

// ✅ AI Chef Route
app.post("/ai-chef", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an AI Chef. Suggest tasty recipes based on given ingredients.",
          },
          { role: "user", content: query },
        ],
      }),
    });

    const data = await groqRes.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "⚠️ No suggestion available.",
    });
  } catch (error) {
    console.error("❌ Groq API error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
