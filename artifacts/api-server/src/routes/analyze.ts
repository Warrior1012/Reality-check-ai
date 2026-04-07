import { Router, type IRouter } from "express";
import { ai } from "@workspace/integrations-gemini-ai";
import { AnalyzeContentBody } from "@workspace/api-zod";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are an expert fact-checker and media literacy analyst. Analyze the given content and return a structured JSON assessment.

Your analysis must be objective, evidence-based, and educational.

Return ONLY valid JSON with this exact structure:
{
  "truthScore": <integer 0-100, where 100=completely verified true, 0=completely false>,
  "truthLabel": <"trustworthy" if score>=70, "suspicious" if score 40-69, "likely-false" if score<40>,
  "bias": <string describing bias type, e.g. "political bias toward X", "fear-mongering", "brand promotion", "none">,
  "biasExplanation": <string explaining the bias found, or "No significant bias detected" if none>,
  "manipulationLevel": <"none" | "low" | "medium" | "high">,
  "manipulationDetails": [
    {
      "type": <manipulation technique name, e.g. "Fear induction", "False urgency", "Emotional exaggeration">,
      "examples": [<exact words or phrases from the text that demonstrate this>,  ...],
      "severity": <"low" | "medium" | "high">
    }
  ],
  "claims": [
    {
      "claim": <the specific factual claim extracted>,
      "verdict": <"true" | "false" | "unverified" | "misleading">,
      "reason": <brief explanation of the verdict>
    }
  ],
  "simpleSummary": <plain English explanation of what's wrong or right with this content, written simply>,
  "highlightedWords": [<words or short phrases from the text that indicate manipulation, bias, or falsehood>]
}

Be precise. Extract real claims. Identify actual manipulation techniques. Do not hallucinate sources.
If the content is genuinely accurate and balanced, say so.`;

router.post("/analyze", async (req, res): Promise<void> => {
  const parsed = AnalyzeContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { content } = parsed.data;

  if (!content || content.trim().length === 0) {
    res.status(400).json({ error: "Content cannot be empty" });
    return;
  }

  if (content.length > 10000) {
    res.status(400).json({ error: "Content is too long. Maximum 10,000 characters." });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nAnalyze this content:\n\n${content}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      req.log.error("Empty response from Gemini");
      res.status(500).json({ error: "Failed to analyze content. Please try again." });
      return;
    }

    let parsed_result: unknown;
    try {
      parsed_result = JSON.parse(rawText);
    } catch {
      req.log.error({ rawText }, "Failed to parse Gemini JSON response");
      res.status(500).json({ error: "Failed to parse analysis. Please try again." });
      return;
    }

    res.json(parsed_result);
  } catch (err) {
    req.log.error({ err }, "Error calling Gemini API");
    res.status(500).json({ error: "Failed to analyze content. Please try again." });
  }
});

export default router;
