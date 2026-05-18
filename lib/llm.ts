import Anthropic from "@anthropic-ai/sdk";

import { formatPercent, formatScore } from "@/lib/utils";
import type {
  ChatMessage,
  DashboardSnapshot,
  EmployeeMetrics,
  SectionMetrics,
  SummaryResponse
} from "@/types";

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const MODEL = "claude-sonnet-4-20250514";

function buildOverviewText(snapshot: DashboardSnapshot) {
  return {
    employees: snapshot.employees.map((employee) => ({
      name: employee.name,
      section: employee.section,
      completionRate: formatPercent(employee.completionRate),
      onTimeRate: formatPercent(employee.onTimeRate),
      overdue: employee.overdue,
      score: formatScore(employee.productivityScore),
      tier: employee.performanceTier
    })),
    sections: snapshot.sections.map((section) => ({
      section: section.section,
      completionRate: formatPercent(section.completionRate),
      onTimeRate: formatPercent(section.onTimeRate),
      overdue: section.overdue,
      score: formatScore(section.sectionScore)
    })),
    anomalies: snapshot.anomalies.map((anomaly) => ({
      employee: anomaly.employee.name,
      reason: anomaly.reason
    }))
  };
}

function summarizeEmployee(employee: EmployeeMetrics): SummaryResponse {
  const summary = `${employee.name} is operating at a ${employee.performanceTier} level with a productivity score of ${formatScore(
    employee.productivityScore
  )}. Completion rate is ${formatPercent(employee.completionRate)} and on-time delivery is ${formatPercent(employee.onTimeRate)}.`;
  const suggestions = [
    employee.overdue > 0 ? "Clear overdue files first and review pending escalations weekly." : "Keep the current completion rhythm and maintain the turnaround discipline.",
    employee.avgProcessingDays > 0 ? `Bring average processing time below ${Math.ceil(employee.avgProcessingDays)} days for the next review cycle.` : "Build a fuller sample of completed files for stronger trend analysis.",
    "Track status changes at least twice a week to reduce hidden bottlenecks."
  ];
  const riskFlags = [
    employee.zeroCompletionsIn30Days ? "No file completions recorded in the last 30 days." : "",
    employee.overdueRate > 0.3 ? "Overdue volume is above the preferred threshold." : "",
    employee.recentCompletionRate < employee.previousCompletionRate ? "Recent completion momentum is weaker than the prior period." : ""
  ].filter(Boolean);

  return { summary, suggestions, riskFlags };
}

function summarizeSection(section: SectionMetrics): SummaryResponse {
  return {
    summary: `${section.section} section has a score of ${formatScore(section.sectionScore)} with ${formatPercent(
      section.completionRate
    )} completion and ${formatPercent(section.onTimeRate)} on-time delivery.`,
    suggestions: [
      "Review pending files in the weekly section meeting.",
      "Rebalance file loads if one or two officers carry most of the backlog.",
      "Use due-date alerts for high-priority items three days before deadline."
    ],
    riskFlags: [
      section.overdue > 0 ? `${section.overdue} files are currently overdue.` : "",
      section.filesPerEmployee > 12 ? "File load per employee is elevated." : ""
    ].filter(Boolean)
  };
}

function summarizeOverview(snapshot: DashboardSnapshot): SummaryResponse {
  return {
    summary: `The office currently tracks ${snapshot.employees.length} active employees across ${snapshot.sections.length} sections. ${
      snapshot.underperformers.length
    } employees are below the preferred productivity threshold and ${snapshot.anomalies.length} anomaly signals need review.`,
    suggestions: [
      "Start with Administration and other low-score sections for backlog reduction.",
      "Use top performers as comparators when reviewing process delays.",
      "Schedule a monthly review of overdue trends and on-time completion rates."
    ],
    riskFlags: snapshot.anomalies.slice(0, 3).map((anomaly) => `${anomaly.employee.name}: ${anomaly.reason}`)
  };
}

function getTextContent(content: Array<{ type: string; text?: string }>) {
  return content
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("\n\n")
    .trim();
}

async function requestClaude(system: string, messages: Array<{ role: "user" | "assistant"; content: string }>) {
  if (!client) {
    return null;
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages
  });

  return getTextContent(response.content);
}

function buildChatPrompt(snapshot: DashboardSnapshot) {
  return `You are a productivity analyst assistant for the Forest Department eOffice system.
You have access to the following data:
<metrics>
${JSON.stringify(buildOverviewText(snapshot), null, 2)}
</metrics>
Answer questions about employee performance, file processing, and section productivity.
Be concise, data-driven, and suggest actionable improvements.
Use Indian government office terminology where appropriate.`;
}

export async function generateSummary(options: {
  type: "employee" | "section" | "overview";
  snapshot: DashboardSnapshot;
  employee?: EmployeeMetrics;
  section?: SectionMetrics;
}): Promise<SummaryResponse> {
  const { type, snapshot, employee, section } = options;

  if (!client) {
    if (type === "employee" && employee) return summarizeEmployee(employee);
    if (type === "section" && section) return summarizeSection(section);
    return summarizeOverview(snapshot);
  }

  const fallback =
    type === "employee" && employee
      ? summarizeEmployee(employee)
      : type === "section" && section
        ? summarizeSection(section)
        : summarizeOverview(snapshot);

  const payload =
    type === "employee" && employee
      ? employee
      : type === "section" && section
        ? section
        : buildOverviewText(snapshot);

  const system = `You are generating management summaries for the Forest Department eOffice productivity dashboard.
Return JSON with keys: summary, suggestions, riskFlags.
Keep summary under 120 words and suggestions/riskFlags as arrays of short strings.
Use only the supplied data.
<data>
${JSON.stringify(payload, null, 2)}
</data>`;

  try {
    const raw = await requestClaude(system, [{ role: "user", content: `Generate a ${type} productivity summary.` }]);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as SummaryResponse;
    if (!parsed.summary) {
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

export async function streamChatResponse(options: {
  messages: ChatMessage[];
  snapshot: DashboardSnapshot;
}) {
  const system = buildChatPrompt(options.snapshot);
  const conversation = options.messages.map((message) => ({
    role: message.role,
    content: message.content
  })) as Array<{ role: "user" | "assistant"; content: string }>;

  let text = "No response generated.";

  try {
    const result = await requestClaude(system, conversation);
    text =
      result ??
      `Current overview: ${options.snapshot.underperformers.length} underperformers, ${options.snapshot.anomalies.length} anomaly signals, and ${
        options.snapshot.sections[0]?.section ?? "the leading section"
      } is among the stronger performers.`;
  } catch {
    text = `Current overview: ${options.snapshot.underperformers.length} underperformers, ${options.snapshot.anomalies.length} anomaly signals, and ${
      options.snapshot.sections[0]?.section ?? "the leading section"
    } is among the stronger performers.`;
  }

  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      const parts = text.match(/.{1,120}(\s|$)/g) ?? [text];
      for (const part of parts) {
        controller.enqueue(encoder.encode(part));
      }
      controller.close();
    }
  });
}
