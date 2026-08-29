/**
 * AI Outlook endpoint — POST /api/ai-outlook
 *
 * When ANTHROPIC_API_KEY is set, uses Claude to generate a concise
 * 5-year outlook interpretation grounded in the supplied forecast data.
 *
 * When the API key is absent, returns a static templated interpretation.
 * The response always identifies whether the analysis came from AI or a template.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface OutlookRequest {
  fieldLabel: string;
  locationLabel: string;
  outlookLabel: "Growing" | "Stable" | "Declining";
  confidence: "High" | "Medium" | "Low";
  vacancyCAGR: number;
  graduateCAGR: number;
  startRatio: number;
  endRatio: number;
  endYear: number;
  dataYears: number;
  firstYear: number;
  lastYear: number;
}

function buildPrompt(d: OutlookRequest): string {
  return `You are a concise labour-market analyst writing a 5-year outlook interpretation for a career intelligence product.

Write 2–3 sentences interpreting this forecast. You must:
- Ground your assessment only in the numbers supplied.
- NOT overstate certainty — this projection is extrapolated from limited data.
- Acknowledge it is directional, not a guaranteed forecast.
- End with a single practical observation for someone evaluating this field now.

Data:
- Field: ${d.fieldLabel}
- Location: ${d.locationLabel}
- 5-year outlook: ${d.outlookLabel} (confidence: ${d.confidence})
- Vacancy CAGR (observed ${d.firstYear}–${d.lastYear}): ${d.vacancyCAGR.toFixed(1)}% p.a.
- Graduate supply CAGR: ${d.graduateCAGR.toFixed(1)}% p.a.
- Projected vacancy ratio: ${d.startRatio.toFixed(2)} → ${d.endRatio.toFixed(2)} by ${d.endYear}
- Historical data points: ${d.dataYears} years

Respond with the interpretation only — no headings, no bullet points, no preamble.`;
}

function staticOutlook(d: OutlookRequest): string {
  const sign = (v: number) => (v >= 0 ? "+" : "");
  const trendSentence =
    d.vacancyCAGR > d.graduateCAGR + 2
      ? ` Vacancy demand (${sign(d.vacancyCAGR)}${d.vacancyCAGR.toFixed(1)}% p.a.) has outpaced graduate supply (${sign(d.graduateCAGR)}${d.graduateCAGR.toFixed(1)}% p.a.) in the observed period, which this projection assumes will continue.`
      : d.graduateCAGR > d.vacancyCAGR + 2
      ? ` Graduate supply (${sign(d.graduateCAGR)}${d.graduateCAGR.toFixed(1)}% p.a.) has grown faster than vacancies (${sign(d.vacancyCAGR)}${d.vacancyCAGR.toFixed(1)}% p.a.) in the observed period, which this projection assumes will continue.`
      : ` Vacancy demand (${sign(d.vacancyCAGR)}${d.vacancyCAGR.toFixed(1)}% p.a.) and graduate supply (${sign(d.graduateCAGR)}${d.graduateCAGR.toFixed(1)}% p.a.) have grown at broadly similar rates.`;

  const outlookSentence =
    d.outlookLabel === "Growing"
      ? ` If current rates continue, the projected vacancy ratio of ${d.endRatio.toFixed(2)} by ${d.endYear} suggests an improving market for ${d.fieldLabel} graduates — though this is a directional estimate only.`
      : d.outlookLabel === "Declining"
      ? ` If current rates continue, the projected vacancy ratio of ${d.endRatio.toFixed(2)} by ${d.endYear} suggests increasing competition for available roles — though this projection is illustrative only.`
      : ` The projected vacancy ratio of ${d.endRatio.toFixed(2)} by ${d.endYear} suggests broadly stable conditions — though actual outcomes will depend on factors not captured in this model.`;

  const practicalNote =
    d.outlookLabel === "Growing"
      ? " For someone evaluating this field now, the directional signal is positive, but decisions should not rest on this projection alone."
      : d.outlookLabel === "Declining"
      ? " For someone evaluating this field now, the directional signal warrants consideration of adjacent specialisations or differentiating factors."
      : " For someone evaluating this field now, conditions appear broadly stable, though the projection carries medium uncertainty given the limited data available.";

  return (
    `Based on ${d.dataYears} years of observed data (${d.firstYear}–${d.lastYear}), the ${d.outlookLabel.toLowerCase()} outlook for ${d.fieldLabel} in ${d.locationLabel} is rated with ${d.confidence.toLowerCase()} confidence.` +
    trendSentence +
    outlookSentence +
    practicalNote
  );
}

export async function POST(req: NextRequest) {
  let body: OutlookRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      analysis: staticOutlook(body),
      source: "template",
      isDemo: true,
    });
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [{ role: "user", content: buildPrompt(body) }],
    });

    const text =
      message.content[0]?.type === "text" ? message.content[0].text : "";

    return NextResponse.json({
      analysis: text.trim(),
      source: "claude",
      isDemo: false,
    });
  } catch {
    return NextResponse.json({
      analysis: staticOutlook(body),
      source: "template",
      isDemo: true,
    });
  }
}
