# Research Report: Token Economics and How to Measure Value — The Enterprise View

**Date:** 2026-06-13 · **Method:** multi-agent deep-research harness (106 agents; 5
search angles; 24 sources fetched; 105 claims extracted; 25 adversarially verified
by 3-vote panels — 23 confirmed, 2 refuted). **Purpose:** evidence base and citable
appendix for the article *"The Token Is Not the Bill."*

Every claim below is tagged with its verification vote and confidence. Source-strength
caveats and the refuted claims are recorded at the end — read them before quoting.

---

## (a) Headline thesis

Enterprises are caught between two opposing curves. **Per-unit inference cost is
collapsing** — roughly 5–10× per year to reach a given capability (Epoch AI) — while
**total AI spend is rising**, because cheap tokens induce far more token-hungry
agentic workflows (a Jevons-paradox dynamic). Meanwhile the **value side remains
weak and hard to prove**: only 39% of organizations attribute *any* EBIT impact to
AI, most of those under 5% (McKinsey); Gartner forecasts 40%+ of agentic AI projects
canceled by end of 2027; and a rigorous RCT found experienced developers were 19%
*slower* with early-2025 AI tools while believing they were 20% faster (METR). The
through-line for leadership: **cost-per-token is the wrong unit of measurement.**
Value is measured per business outcome, and the organizations capturing it redesign
workflows rather than bolt AI onto existing ones.

## (b) Token-economics primer (the numbers)

**Unit cost is falling fast.** Epoch AI: "very roughly a 5–10× cost reduction per
year for reaching a given capability level." Concrete: reaching ~27% on FrontierMath
took ~43M output tokens (o4-mini, Apr 2025) vs ~5M (GPT-5.2, Dec 2025) — ~3× in eight
months; a16z's "LLMflation" estimates ~10×/year. *(3-0, high.)*

**Pricing is asymmetric — output is the cost driver.** Output tokens cost roughly
3–5× input (a lower bound). Anthropic is exactly 5× per tier (Opus 4.8 $5/$25,
Sonnet 4.6 $3/$15, Haiku 4.5 $1/$5 per million in/out); OpenAI GPT-4o ~4×; Google
Gemini ~8×. Output volume, not prompt size, dominates most token budgets. *(3-0 / 2-1,
high.)*

**Caching is the primary cost lever (provider-specific).** On Anthropic, cache reads
cost 0.1× base input (a 90% discount); cache writes carry a premium (1.25× for 5-min
TTL, 2× for 1-hour). Break-even arrives on the first re-read (1.25 + 0.1 = 1.35× <
2×). OpenAI and Google use different caching economics. *(3-0, high.)*

**Inference, not training, is the production cost.** Inference "can account for
80–90% of the total spend in many cases" (FinOps Foundation), corroborated by
NVIDIA's ~80/20 inference/training framing. Optimization effort belongs on
inference. *(3-0, high.)*

**Falling unit cost ≠ falling total spend (Jevons).** Cheaper inference pushes firms
toward more compute-intensive agentic architectures, making aggregate demand
"super-elastic" — total spend rises as cost-per-token falls (arXiv 2601.12339).
Empirically corroborated: Deloitte (Jan 2026) reports cost-per-token down ~10× in two
years while consumption rose ~100×; agentic coding can use ~1,000× the tokens of
equivalent chat. *(2-1, medium — see caveats; the framing is from a single preprint,
the empirical core is multiply corroborated.)*

## (c) The ROI evidence — bullish and skeptical

**Skeptical (well-sourced):**
- **McKinsey State of AI:** only **39%** attribute *any* EBIT impact to AI; most of
  those say **<5%** of EBIT; only ~6% are "AI high performers." *(3-0, high.)*
- **Gartner (2025-06-25, survey of 3,400+ orgs):** **40%+ of agentic AI projects
  canceled by end of 2027** (escalating cost, unclear value, inadequate risk
  controls); "most agentic AI propositions lack significant value or ROI" because
  current models lack the maturity for complex autonomous goals; many are
  hype-driven POCs. *(3-0, high — but it is an analyst forecast.)*
- **METR RCT (2025):** early-2025 AI tools made experienced open-source developers
  **19% slower** on real issues; developers forecast a 24% speedup and still believed
  in a 20% speedup afterward. Sharpest evidence of the productivity/perception gap.
  *(3-0, high — but n=16 experienced devs on mature repos with early-2025 tooling;
  do not generalize to juniors, greenfield, or 2026 tools.)*

**Bullish (weaker sourcing):** the Microsoft-sponsored IDC report claims large ROI
multiples on GenAI; treat vendor-sponsored multiples with caution (sponsorship
incentive, self-reported). The widely-repeated **MIT/NANDA "95% of GenAI pilots
fail"** statistic did **not** survive into the verified set — flag as unverified (see
open questions).

## (d) How enterprises actually measure value

**FinOps for AI is the emerging standard framework.** It defines AI-specific KPIs —
*Cost Per Inference* = total inference cost / requests; *Cost Per Token* = total cost
/ tokens — treats cost-per-token as a new core usage metric (volatile pricing, GPU
scarcity), and frames ROI around six business-value priorities: cost efficiency,
resilience, user experience, productivity, sustainability, business growth. *(3-0,
high — normative best-practice from one industry body, not an empirical law.)*

**Measure the use case, not the token.** FinOps Foundation: "the only real way to
understand the TCO of leveraging AI for a business outcome is to measure the entire
use case" — across multiple models, infra, integration, human oversight, and
governance; tokens are "only a small piece of the puzzle." The unit that matters is
**cost per useful business outcome.** *(3-0, high.)*

## (e) Why most fail — and what the winners do

**The winners redesign workflows.** McKinsey: 80% set *efficiency* as the AI
objective, but the value-capturers "often set growth or innovation as additional
objectives... most are redesigning workflows." Workflow redesign has the **single
highest correlation with EBIT impact among 25 attributes tested**; high performers
are 2.8× more likely to report fundamental workflow redesign. *(3-0, high —
correlational survey evidence, not causal proof.)*

**Cost-control levers that work:**
- **Model routing / right-sizing:** routing to a non-reasoning model when reasoning
  isn't needed saves 4–20× tokens; organizations report **40–70% inference savings**
  (RouteLLM: 35–85% retaining ~95% of GPT-4 performance). *(3-0, high — workload-
  dependent.)*
- **Prompt caching:** the 90% read discount above, for any re-read context.
- **Inference focus:** since inference is 80–90% of spend, that's where optimization
  compounds.

## (f) Watch-list — open questions and weak-evidence flags

1. **The MIT/NANDA "95% of pilots fail" statistic** did not appear among verified
   claims — a candidate thin-source figure. Trace the primary methodology before
   citing it as fact.
2. **Does the METR slowdown hold for 2026 agentic tooling, juniors, or greenfield
   work?** The result is specific to expert devs on mature codebases with early-2025
   tools, n=16.
3. **Durability of the 5–10×/year cost decline** — Epoch itself cautions it "might
   slow"; GPU scarcity and benchmark contamination complicate the curve.
4. **Audited, third-party use-case-level ROI case studies** (cost per business
   outcome) beyond vendor self-reporting and survey self-attestation remain scarce.

**Refuted in verification (do not use):**
- ~~"Context Window Creep is the largest hidden cost"~~ (1-2).
- ~~"Three-way cost/performance/impact balancing yields 30–50% better outcomes"~~ (0-3).

**Time-sensitivity:** all pricing (Opus 4.8 $5/$25, Sonnet 4.6, Haiku 4.5, Opus Fast
Mode $10/$50) is verified as of June 2026 and will date quickly. Caching economics
are Anthropic-specific.

## Source register (selected)

| Source | Quality | Used for |
|---|---|---|
| epoch.ai — inference cost burden | Primary | 5–10×/yr cost decline |
| platform.claude.com — pricing, prompt-caching | Primary | output premium, caching economics |
| arxiv.org/2601.12339 — agentic Jevons paradox | Primary (preprint, caveated) | super-elastic demand |
| finops.org — FinOps for AI, token pricing, optimizing GenAI | Primary | KPIs, use-case TCO, routing |
| mckinsey.com — State of AI | Primary | 39% EBIT, workflow redesign |
| gartner.com — agentic AI cancellation forecast | Primary | 40% canceled by 2027 |
| metr.org + arxiv.org/2507.09089 — developer RCT | Primary | 19% slowdown, perception gap |
| news.microsoft.com — IDC ROI report | Secondary (vendor-sponsored) | bullish ROI multiples (caveated) |
| finout.io, intuitionlabs.ai — pricing comparisons | Secondary | cross-vendor pricing |

**Methodology note:** verification budget exhausted before all 105 claims were
panel-verified; 25 highest-value claims were 3-vote verified. Vendor and analyst
materials are flagged where sponsorship or forecast status affects weight.
