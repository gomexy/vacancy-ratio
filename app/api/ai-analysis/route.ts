/**
 * AI Market Analysis endpoint — POST /api/ai-analysis
 *
 * When ANTHROPIC_API_KEY is set in the environment, uses Claude to generate
 * a concise market summary grounded in the structured data supplied by the client.
 *
 * The model is given a strict prompt that forbids inventing statistics,
 * companies, salaries, or trends not present in the supplied data.
 *
 * When the API key is absent, a static templated summary is returned instead.
 * The response always identifies whether the analysis came from AI or a template.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface AnalysisRequest {
  fieldLabel: string;
  countryName: string;
  cityName?: string;
  year: number;
  vacancyRatio: number;
  vacanciesPer100: number;
  graduates: number;
  vacancies: number;
  signal: string;
  signalLabel: string;
  vacancyCAGR?: number;
  graduateCAGR?: number;
  outlookLabel?: string;
  outlookConfidence?: string;
  topSkills?: string[];
}

function buildPrompt(d: AnalysisRequest): string {
  const location = d.cityName
    ? `${d.cityName}, ${d.countryName}`
    : d.countryName;

  const trendSection = d.vacancyCAGR !== undefined
    ? `\n- Vacancy CAGR (observed period): ${d.vacancyCAGR.toFixed(1)}% p.a.`
      + `\n- Graduate supply CAGR: ${d.graduateCAGR?.toFixed(1) ?? "n/a"}% p.a.`
    : "";

  const outlookSection = d.outlookLabel
    ? `\n- 5-year outlook: ${d.outlookLabel} (confidence: ${d.outlookConfidence ?? "Low"})`
    : "";

  const skillsSection = d.topSkills?.length
    ? `\n- Top skills in demand: ${d.topSkills.slice(0, 5).join(", ")}`
    : "";

  return `You are a concise labour-market analyst writing for a career intelligence product.

Write a 2–3 sentence summary of the following market data. Your summary must:
- Be factual and grounded only in the numbers supplied below.
- NOT invent statistics, companies, salary figures, or trends not present in the data.
- NOT speculate about the future beyond what the provided outlook label says.
- If something is uncertain or limited, say so briefly.
- End with a single practical observation for someone considering this field.

Market data:
- Field: ${d.fieldLabel}
- Location: ${location}
- Year: ${d.year}
- Graduates: ${d.graduates.toLocaleString()}
- Vacancies: ${d.vacancies.toLocaleString()}
- Vacancy ratio: ${d.vacancyRatio.toFixed(3)} (${d.vacanciesPer100.toFixed(1)} per 100 graduates)
- Market signal: ${d.signalLabel}${trendSection}${outlookSection}${skillsSection}

Respond with only the summary — no headings, no bullet points, no preamble.`;
}

function staticAnalysis(d: AnalysisRequest): string {
  const location = d.cityName ?? d.countryName;
  const trend =
    d.vacancyCAGR !== undefined
      ? d.vacancyCAGR > 3
        ? ` Vacancy demand has grown at ${d.vacancyCAGR.toFixed(1)}% p.a. over the observed period.`
        : ` Vacancy demand has remained broadly flat in the observed period.`
      : "";

  const outlook =
    d.outlookLabel === "Growing"
      ? " The 5-year outlook is positive, though projections are directional only."
      : d.outlookLabel === "Declining"
      ? " The 5-year outlook suggests increasing competition if current trends continue."
      : " The 5-year outlook is broadly stable.";

  const signal =
    d.signal === "significant-surplus" || d.signal === "surplus"
      ? " Graduates substantially outnumber available openings — specialisation and differentiation are important."
      : d.signal === "strong-demand" || d.signal === "critical-shortage"
      ? " Employers are actively competing for talent in this field."
      : " Supply and demand are broadly balanced.";

  return (
    `In ${d.year}, there were ${d.vacanciesPer100.toFixed(0)} vacancies for every ` +
    `100 ${d.fieldLabel} graduates in ${location}.` +
    signal +
    trend +
    outlook
  );
}

export async function POST(req: NextRequest) {
  let body: AnalysisRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      analysis: staticAnalysis(body),
      source:   "template",
      isDemo:   true,
    });
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client    = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 250,
      messages: [
        { role: "user", content: buildPrompt(body) },
      ],
    });

    const text =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    return NextResponse.json({
      analysis: text.trim(),
      source:   "claude",
      isDemo:   false,
    });
  } catch {
    return NextResponse.json({
      analysis: staticAnalysis(body),
      source:   "template",
      isDemo:   true,
    });
  }
}
