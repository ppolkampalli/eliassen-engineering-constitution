"""Generate the Engineering Constitution overview deck.

Brand palette and design language mirror the user-training-onboarding website
(src/styles.css): Eliassen navy/royal/coral/cream/gold, royal hero bands with
white serif display type, cream content grounds, royal-top-bordered cards,
royal-soft law chips. Serif display -> Georgia, body -> Segoe UI for portability.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

# ---- Brand palette (from styles.css :root) ----
INK = RGBColor(0x1C, 0x22, 0x40)
INK_SOFT = RGBColor(0x5B, 0x61, 0x7E)
PAPER = RGBColor(0xFF, 0xFF, 0xFF)
CREAM = RGBColor(0xF2, 0xEC, 0xE4)
ROYAL = RGBColor(0x2E, 0x3F, 0x95)
ROYAL_DEEP = RGBColor(0x25, 0x33, 0x7C)
ROYAL_SOFT = RGBColor(0xE9, 0xEC, 0xF7)
CORAL = RGBColor(0xE8, 0x83, 0x7E)
CORAL_DARK = RGBColor(0xD9, 0x6B, 0x6A)
GOLD = RGBColor(0xC9, 0xA6, 0x62)
ACCENT = RGBColor(0x0E, 0x7C, 0x5B)
WARN = RGBColor(0xB4, 0x23, 0x1F)
LINE = RGBColor(0xE4, 0xDE, 0xD4)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
FOOT_TXT = RGBColor(0xB9, 0xBE, 0xD6)

SERIF = "Georgia"      # stands in for Source Serif 4
SANS = "Segoe UI"      # stands in for Poppins

EMU_W = Inches(13.333)
EMU_H = Inches(7.5)

prs = Presentation()
prs.slide_width = EMU_W
prs.slide_height = EMU_H
BLANK = prs.slide_layouts[6]


def _set_bg(slide, color):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def rect(slide, x, y, w, h, fill=None, line=None, line_w=None, shadow_off=True,
         shape=MSO_SHAPE.RECTANGLE):
    sp = slide.shapes.add_shape(shape, x, y, w, h)
    if fill is None:
        sp.fill.background()
    else:
        sp.fill.solid()
        sp.fill.fore_color.rgb = fill
    if line is None:
        sp.line.fill.background()
    else:
        sp.line.color.rgb = line
        sp.line.width = line_w or Pt(1)
    if shadow_off:
        sp.shadow.inherit = False
    return sp


def text(slide, x, y, w, h, runs, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
         space_after=Pt(4), line_spacing=1.0, wrap=True):
    """runs: list of paragraphs; each paragraph is list of (txt, size, color, bold, font, italic)."""
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = wrap
    tf.vertical_anchor = anchor
    tf.margin_left = 0
    tf.margin_right = 0
    tf.margin_top = 0
    tf.margin_bottom = 0
    for i, para in enumerate(runs):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = space_after
        p.space_before = Pt(0)
        p.line_spacing = line_spacing
        for (txt, size, color, bold, font, *rest) in para:
            italic = rest[0] if rest else False
            r = p.add_run()
            r.text = txt
            r.font.size = Pt(size)
            r.font.color.rgb = color
            r.font.bold = bold
            r.font.name = font
            r.font.italic = italic
    return tb


def footer(slide, page):
    bar = rect(slide, 0, Inches(7.04), EMU_W, Inches(0.46), fill=INK)
    text(slide, Inches(0.55), Inches(7.05), Inches(8), Inches(0.44),
         [[("ELIASSEN GROUP  ·  ENGINEERING CONSTITUTION v1.2.0", 9, FOOT_TXT, True, SANS)]],
         anchor=MSO_ANCHOR.MIDDLE)
    text(slide, Inches(11.5), Inches(7.05), Inches(1.3), Inches(0.44),
         [[(str(page), 9, FOOT_TXT, True, SANS)]], align=PP_ALIGN.RIGHT,
         anchor=MSO_ANCHOR.MIDDLE)


def gold_rule(slide, x, y, w):
    rect(slide, x, y, w, Pt(3), fill=GOLD)


def content_header(slide, eyebrow, title, ground=CREAM):
    _set_bg(slide, ground)
    # royal left spine
    rect(slide, 0, 0, Inches(0.16), Inches(7.04), fill=ROYAL)
    text(slide, Inches(0.55), Inches(0.42), Inches(12), Inches(0.3),
         [[(eyebrow.upper(), 12, CORAL_DARK, True, SANS)]])
    text(slide, Inches(0.55), Inches(0.72), Inches(12.2), Inches(0.8),
         [[(title, 30, INK, True, SERIF)]])
    gold_rule(slide, Inches(0.57), Inches(1.52), Inches(1.4))


def chip(slide, x, y, label, w=None, fill=ROYAL_SOFT, txt_color=ROYAL, border=RGBColor(0xCC, 0xD3, 0xEC)):
    w = w or Inches(1.05)
    sp = rect(slide, x, y, w, Inches(0.3), fill=fill, line=border, line_w=Pt(0.75),
              shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    try:
        sp.adjustments[0] = 0.5
    except Exception:
        pass
    tf = sp.text_frame
    tf.margin_top = 0
    tf.margin_bottom = 0
    tf.word_wrap = False
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = label
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.name = SANS
    r.font.color.rgb = txt_color
    return sp


def card(slide, x, y, w, h, top_color=ROYAL):
    c = rect(slide, x, y, w, h, fill=WHITE, line=LINE, line_w=Pt(1),
             shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    try:
        c.adjustments[0] = 0.04
    except Exception:
        pass
    rect(slide, x, y, w, Pt(3.2), fill=top_color)
    return c


# =====================================================================
# SLIDE 1 — Title (royal hero band)
# =====================================================================
s = prs.slides.add_slide(BLANK)
_set_bg(s, ROYAL)
rect(s, 0, 0, EMU_W, Inches(7.5), fill=ROYAL)
# deep band at bottom
rect(s, 0, Inches(5.0), EMU_W, Inches(2.5), fill=ROYAL_DEEP)
# version pill
vp = rect(s, Inches(0.85), Inches(0.85), Inches(1.95), Inches(0.42), fill=CORAL,
          shape=MSO_SHAPE.ROUNDED_RECTANGLE)
try:
    vp.adjustments[0] = 0.5
except Exception:
    pass
tf = vp.text_frame
tf.word_wrap = False
p = tf.paragraphs[0]
p.alignment = PP_ALIGN.CENTER
r = p.add_run(); r.text = "VERSION 1.2.0"; r.font.size = Pt(11); r.font.bold = True
r.font.name = SANS; r.font.color.rgb = WHITE

text(s, Inches(0.85), Inches(2.0), Inches(11.6), Inches(2.2),
     [[("The Engineering Constitution", 54, WHITE, True, SERIF)]], line_spacing=1.0)
gold_rule(s, Inches(0.9), Inches(3.35), Inches(2.2))
text(s, Inches(0.9), Inches(3.6), Inches(11), Inches(0.8),
     [[("Making quality systematic instead of heroic.", 22, RGBColor(0xD7,0xDC,0xF2), False, SERIF, True)]])
text(s, Inches(0.9), Inches(5.35), Inches(11.5), Inches(1.4),
     [[("An overview for engineers", 18, WHITE, True, SANS)],
      [("Eliassen Group  ·  JavaScript / TypeScript delivery teams  ·  Human + AI, identical standards",
        13, RGBColor(0xB9,0xBE,0xD6), False, SANS)]],
     space_after=Pt(8))

# =====================================================================
# SLIDE 2 — What is it?
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "Start here", "What is the Engineering Constitution?")
text(s, Inches(0.57), Inches(1.85), Inches(7.0), Inches(2.2),
     [[("A shared rulebook for how we build software — for ", 16, INK, False, SANS),
       ("20–50 distributed engineers", 16, INK, True, SANS),
       (" working with AI assistance across client engagements.", 16, INK, False, SANS)],
      [("", 6, INK, False, SANS)],
      [("Standards here are not aspirations. They are numbered, versioned ", 16, INK, False, SANS),
       ("Laws", 16, ROYAL, True, SANS),
       (" — citable by ID, enforced by tooling, personas, and review, and changeable only through a recorded amendment process.", 16, INK, False, SANS)]],
     line_spacing=1.25, space_after=Pt(4))

# three pillars
pill_y = Inches(4.35)
pills = [
    ("Citable", "Every rule has an ID like LAW-2.3 — quote it in any decision.", ROYAL),
    ("Enforced", "Tooling, personas, and review gates apply the laws automatically.", CORAL_DARK),
    ("Binds AI too", "Human engineers and AI agents are held to identical standards (LAW-7.4).", ACCENT),
]
cw = Inches(3.95); gap = Inches(0.25); x0 = Inches(0.57)
for i, (h, body, col) in enumerate(pills):
    x = x0 + i * (cw + gap)
    card(s, x, pill_y, cw, Inches(2.0), top_color=col)
    text(s, x + Inches(0.28), pill_y + Inches(0.28), cw - Inches(0.56), Inches(0.5),
         [[(h, 18, INK, True, SERIF)]])
    text(s, x + Inches(0.28), pill_y + Inches(0.92), cw - Inches(0.56), Inches(1.0),
         [[(body, 13, INK_SOFT, False, SANS)]], line_spacing=1.2)
footer(s, 2)

# =====================================================================
# SLIDE 3 — Why it exists (six pain points)
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "The why", "Six failures we kept paying for", ground=PAPER)
pains = [
    ("Review bottlenecks", "Slow, inconsistent, frequently superficial reviews."),
    ("Inconsistent standards", "Every project its own dialect."),
    ("Low test coverage", "Incidents living in untested paths."),
    ("Security vulnerabilities", "Injection, leaked secrets, vulnerable deps reaching prod."),
    ("Poor documentation", "Intent living in heads and chat threads."),
    ("Unaddressed tech debt", "“Later” never arriving."),
]
cw = Inches(3.95); ch = Inches(1.42); gx = Inches(0.25); gy = Inches(0.22)
x0 = Inches(0.57); y0 = Inches(1.95)
for i, (h, body) in enumerate(pains):
    col = i % 3; row = i // 3
    x = x0 + col * (cw + gx); y = y0 + row * (ch + gy)
    card(s, x, y, cw, ch, top_color=CORAL)
    text(s, x + Inches(0.26), y + Inches(0.2), cw - Inches(0.5), Inches(0.5),
         [[(f"{i+1}.  ", 15, CORAL_DARK, True, SANS), (h, 15, INK, True, SANS)]])
    text(s, x + Inches(0.26), y + Inches(0.66), cw - Inches(0.5), Inches(0.7),
         [[(body, 12, INK_SOFT, False, SANS)]], line_spacing=1.15)
text(s, Inches(0.57), Inches(6.35), Inches(12), Inches(0.5),
     [[("Every law's rationale traces back to one or more of these.", 13, ROYAL, True, SERIF, True)]])
footer(s, 3)

# =====================================================================
# SLIDE 4 — How laws are structured + citation
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "How it works", "Laws → Articles → Citations")
text(s, Inches(0.57), Inches(1.8), Inches(5.7), Inches(3.5),
     [[("Each law is one file with a quotable ", 15, INK, False, SANS),
       ("Statement", 15, INK, True, SANS),
       (", a ", 15, INK, False, SANS),
       ("Rationale", 15, INK, True, SANS),
       (" (the WHY), examples, and amendment history.", 15, INK, False, SANS)],
      [("", 8, INK, False, SANS)],
      [("45 laws are grouped into ", 15, INK, False, SANS),
       ("Ten Articles", 15, ROYAL, True, SANS),
       (". Decisions are articulated as citations so anyone can trace the reasoning.", 15, INK, False, SANS)],
      [("", 8, INK, False, SANS)],
      [("Look up any law:", 13, INK_SOFT, True, SANS)],
      [("./scripts/law-lookup.sh LAW-2.3", 13, ROYAL_DEEP, True, "Consolas")]],
     line_spacing=1.25, space_after=Pt(4))
# citation block (code card)
cx = Inches(6.6); cy = Inches(1.8); cwd = Inches(6.15); cht = Inches(4.0)
rect(s, cx, cy, cwd, cht, fill=INK, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
rect(s, cx, cy, cwd, Pt(3.2), fill=GOLD)
cite = [
    [("DECISION: ", 12, CORAL, True, "Consolas"), ("Rejecting use of `any` in", 12, WHITE, False, "Consolas")],
    [("payment-service.ts line 47.", 12, WHITE, False, "Consolas")],
    [("CITATION: ", 12, GOLD, True, "Consolas"), ("[LAW-2.3 v1.0] “The `any`", 12, WHITE, False, "Consolas")],
    [("type is prohibited. Use `unknown` with", 12, WHITE, False, "Consolas")],
    [("type narrowing.”", 12, WHITE, False, "Consolas")],
    [("RATIONALE: ", 12, GOLD, True, "Consolas"), ("`any` silently disables", 12, WHITE, False, "Consolas")],
    [("type checking, letting errors reach prod.", 12, WHITE, False, "Consolas")],
    [("PERSONA: ", 12, CORAL, True, "Consolas"), ("Software Engineer (Quality)", 12, WHITE, False, "Consolas")],
]
text(s, cx + Inches(0.35), cy + Inches(0.35), cwd - Inches(0.7), cht - Inches(0.7),
     cite, line_spacing=1.3, space_after=Pt(3))
footer(s, 4)

# =====================================================================
# SLIDE 5 — The Ten Articles at a glance
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "The map", "The Ten Articles at a glance", ground=PAPER)
articles = [
    ("1", "Foundational Principles", "Readable code, built-in quality, consistency, intentional architecture, security is everyone's"),
    ("2", "Code Standards", "Naming, Prettier, no `any`, explicit return types, import order, single-purpose functions"),
    ("3", "Testing & Quality", "Canon TDD, coverage floors 80/100/70, AAA structure, isolation, no hollow tests, mutation testing"),
    ("4", "Architecture", "Modular monolith, SOLID, no cycles, sanctioned patterns, ADRs, resilience patterns"),
    ("5", "Security", "Input validation, parameterized queries, no secrets, established auth, dep hygiene, encryption"),
    ("6", "Review & Documentation", "Two approvals, inviolable gates, JSDoc, WHY-comments, docs travel with code"),
    ("7", "AI Governance", "Human accountability, data protection, audit trail, identical standards, escalate, code-health"),
    ("8", "Requirements & Domain", "Acceptance criteria first, cited business rules, regulatory mapping, scope discipline"),
    ("9", "Operations & Cost", "IaC, reversible deploys, cost review, licenses, SLOs, error budgets, failure testing"),
    ("10", "Agentic Development", "Spec-driven agent work, verifiable completion, sandboxing, steering files, fresh-context review, workflows"),
]
rh = Inches(0.475); y0 = Inches(1.78); x0 = Inches(0.57)
numw = Inches(0.55); titlew = Inches(3.0); descw = Inches(8.6)
for i, (num, title, desc) in enumerate(articles):
    y = y0 + i * (rh + Inches(0.025))
    band = ROYAL_SOFT if i % 2 == 0 else WHITE
    rect(s, x0, y, Inches(12.2), rh, fill=band)
    rect(s, x0, y, numw, rh, fill=ROYAL)
    text(s, x0, y, numw, rh, [[(num, 16, WHITE, True, SERIF)]],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    text(s, x0 + numw + Inches(0.18), y, titlew, rh,
         [[(title, 13.5, INK, True, SANS)]], anchor=MSO_ANCHOR.MIDDLE)
    text(s, x0 + numw + Inches(0.18) + titlew, y, descw - Inches(0.2), rh,
         [[(desc, 11, INK_SOFT, False, SANS)]], anchor=MSO_ANCHOR.MIDDLE)
footer(s, 5)

# =====================================================================
# SLIDE 6 — Day-to-day hard rules (the non-negotiables)
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "Day to day", "The hard rules you'll hit every day")
rules = [
    ("Naming", "camelCase vars/functions, PascalCase types (no `I` prefix), UPPER_SNAKE constants, is/has/can booleans, kebab-case files.", "LAW-2.1"),
    ("No `any`", "Use `unknown` plus type narrowing. `any` silently disables type checking.", "LAW-2.3"),
    ("TDD-first", "Test list, one failing test at a time. Never delete, skip, or weaken a failing test to go green.", "LAW-3.1"),
    ("Coverage floors", "80% overall, 100% utilities, 70% controllers. Never lower a threshold to pass a build.", "LAW-3.2"),
    ("Security basics", "Allowlist-validate all external input, parameterized queries only, no secrets in code or logs.", "Article 5"),
    ("Tag AI commits", "Mark AI-assisted commits [Claude-assisted] and fill the PR's AI Assistance section.", "LAW-7.3"),
]
cw = Inches(3.95); ch = Inches(1.62); gx = Inches(0.25); gy = Inches(0.2)
x0 = Inches(0.57); y0 = Inches(1.85)
for i, (h, body, law) in enumerate(rules):
    col = i % 3; row = i // 3
    x = x0 + col * (cw + gx); y = y0 + row * (ch + gy)
    card(s, x, y, cw, ch, top_color=ACCENT)
    text(s, x + Inches(0.26), y + Inches(0.2), cw - Inches(0.5), Inches(0.4),
         [[(h, 15, INK, True, SERIF)]])
    text(s, x + Inches(0.26), y + Inches(0.62), cw - Inches(0.5), Inches(0.78),
         [[(body, 11, INK_SOFT, False, SANS)]], line_spacing=1.13)
    chip(s, x + Inches(0.26), y + ch - Inches(0.42), law, w=Inches(1.25))
footer(s, 6)

# =====================================================================
# SLIDE 7 — Quality gates (inviolable)
# =====================================================================
s = prs.slides.add_slide(BLANK)
_set_bg(s, ROYAL_DEEP)
rect(s, 0, 0, Inches(0.16), Inches(7.5), fill=CORAL)
text(s, Inches(0.85), Inches(0.95), Inches(11), Inches(0.4),
     [[("THE LINE THAT DOESN'T MOVE", 13, GOLD, True, SANS)]])
text(s, Inches(0.85), Inches(1.35), Inches(11.6), Inches(1.0),
     [[("Before declaring any work done", 34, WHITE, True, SERIF)]])
# command card
rect(s, Inches(0.85), Inches(2.85), Inches(11.6), Inches(1.25), fill=INK,
     shape=MSO_SHAPE.ROUNDED_RECTANGLE)
text(s, Inches(0.85), Inches(2.85), Inches(11.6), Inches(1.25),
     [[("npm run lint  &&  npm run type-check  &&  npm test", 22, RGBColor(0x8F,0xE3,0xC4), True, "Consolas")]],
     align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
text(s, Inches(0.85), Inches(4.45), Inches(11.6), Inches(2.0),
     [[("All three must pass. Quality gates have no override path (LAW-6.2).", 18, WHITE, True, SANS)],
      [("", 8, WHITE, False, SANS)],
      [("Two approvals to merge — including a domain expert (LAW-6.1). Your output is reviewed by a context that didn't produce it (LAW-10.5).", 15, RGBColor(0xD7,0xDC,0xF2), False, SANS)]],
     line_spacing=1.3, space_after=Pt(6))
footer(s, 7)

# =====================================================================
# SLIDE 8 — The Persona System
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "How AI works here", "Eight personas, each owning laws", ground=PAPER)
text(s, Inches(0.57), Inches(1.62), Inches(12), Inches(0.5),
     [[("AI agents assume a role with a mandate, owned laws, and bounded authority. Every persona decision cites laws.", 13, INK_SOFT, False, SANS)]])
personas = [
    ("Software Engineer", "Implementation (default)", "2.1–2.6, 10.1, 10.4"),
    ("Architect", "Design, patterns, ADRs", "4.1–4.6, 1.4"),
    ("Quality", "Testing & review standards", "3.1–3.6, 6.1, 6.2"),
    ("Security", "Article 5 + AI data + agents", "5.1–5.6, 10.3"),
    ("DevOps", "CI/CD, infra, reliability", "9.1, 9.2, 9.5–9.7"),
    ("Product Owner", "Requirements, scope, process", "8.1, 8.4, 10.6"),
    ("Industry SME", "Domain rules, regulation", "8.2, 8.3"),
    ("FinOps", "Cost, licensing", "9.3, 9.4"),
]
cw = Inches(2.95); ch = Inches(1.7); gx = Inches(0.18); gy = Inches(0.2)
x0 = Inches(0.57); y0 = Inches(2.2)
pcolors = [ROYAL, ROYAL, ACCENT, WARN, ROYAL_DEEP, CORAL_DARK, GOLD, GOLD]
for i, (name, dom, laws) in enumerate(personas):
    col = i % 4; row = i // 4
    x = x0 + col * (cw + gx); y = y0 + row * (ch + gy)
    card(s, x, y, cw, ch, top_color=pcolors[i])
    text(s, x + Inches(0.22), y + Inches(0.2), cw - Inches(0.4), Inches(0.5),
         [[(name, 14, INK, True, SERIF)]])
    text(s, x + Inches(0.22), y + Inches(0.66), cw - Inches(0.4), Inches(0.5),
         [[(dom, 11, INK_SOFT, False, SANS)]], line_spacing=1.1)
    text(s, x + Inches(0.22), y + ch - Inches(0.5), cw - Inches(0.4), Inches(0.4),
         [[("Owns ", 10, INK_SOFT, False, SANS), (laws, 10, ROYAL, True, "Consolas")]])
footer(s, 8)

# =====================================================================
# SLIDE 9 — Authority ladder
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "When personas conflict", "The authority ladder")
ladder = [
    ("Security VETO", "CRITICAL findings — overridable only by a named human security lead", WARN),
    ("Architect VETO", "Layer violations, circular dependencies", ROYAL_DEEP),
    ("Quality BLOCK", "Coverage floors, gate integrity", ROYAL),
    ("DevOps / Product Owner BLOCK", "No-rollback deploys / missing acceptance criteria", CORAL_DARK),
    ("Advisory: Industry SME, FinOps", "Advise only — FinOps subordinate to Security", GOLD),
]
y0 = Inches(1.95); x0 = Inches(0.8)
for i, (h, body, col) in enumerate(ladder):
    y = y0 + i * Inches(0.92)
    w = Inches(11.0) - i * Inches(0.55)
    bar = rect(s, x0 + i * Inches(0.28), y, w, Inches(0.74), fill=col,
               shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    text(s, x0 + i * Inches(0.28) + Inches(0.3), y, w - Inches(0.6), Inches(0.74),
         [[(h, 16, WHITE, True, SANS), ("    " + body, 12, RGBColor(0xF0,0xF0,0xF5), False, SANS)]],
         anchor=MSO_ANCHOR.MIDDLE)
text(s, Inches(0.8), Inches(6.5), Inches(12), Inches(0.4),
     [[("Cross-cutting work and unresolved conflicts go to the persona-council, which escalates to humans (LAW-7.5).", 12, INK_SOFT, False, SANS, True)]])
footer(s, 9)

# =====================================================================
# SLIDE 10 — Workflows
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "How work flows", "Defined workflows (LAW-10.6)", ground=PAPER)
text(s, Inches(0.57), Inches(1.62), Inches(12), Inches(0.5),
     [[("Nontrivial work follows a declared, staged persona chain. Hard stages are never skippable; other deviations are allowed when asked — and recorded.", 13, INK_SOFT, False, SANS)]])
flows = [
    ("WF-FEATURE", "Build new functionality", ROYAL),
    ("WF-RESEARCH", "Investigate before committing", ACCENT),
    ("WF-BUG", "Diagnose and fix defects", CORAL_DARK),
    ("WF-SECBUG", "Security-sensitive fixes", WARN),
    ("WF-REFACTOR", "Improve without behavior change", ROYAL_DEEP),
    ("WF-AMENDMENT", "Change the constitution itself", GOLD),
]
cw = Inches(3.95); ch = Inches(1.5); gx = Inches(0.25); gy = Inches(0.25)
x0 = Inches(0.57); y0 = Inches(2.35)
for i, (name, body, col) in enumerate(flows):
    c = i % 3; row = i // 3
    x = x0 + c * (cw + gx); y = y0 + row * (ch + gy)
    card(s, x, y, cw, ch, top_color=col)
    text(s, x + Inches(0.26), y + Inches(0.26), cw - Inches(0.5), Inches(0.5),
         [[(name, 17, INK, True, "Consolas")]])
    text(s, x + Inches(0.26), y + Inches(0.8), cw - Inches(0.5), Inches(0.5),
         [[(body, 12, INK_SOFT, False, SANS)]])
footer(s, 10)

# =====================================================================
# SLIDE 11 — AI Governance
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "Article 7", "AI governance: trust, but verify")
gov = [
    ("Human accountability", "A named human owns every AI-assisted change (LAW-7.1)."),
    ("Audit trail", "Tag commits [Claude-assisted]; fill the PR AI section (LAW-7.3)."),
    ("Identical standards", "AI code meets the same laws as human code (LAW-7.4)."),
    ("Escalate on uncertainty", "Ambiguous requirements & security questions go to humans (LAW-7.5)."),
    ("Data & IP protection", "Protect client IP and data in every AI interaction (LAW-7.2)."),
    ("Code-health metrics", "Track AI-era health signals, not just velocity (LAW-7.6)."),
]
cw = Inches(5.95); ch = Inches(1.3); gx = Inches(0.3); gy = Inches(0.2)
x0 = Inches(0.57); y0 = Inches(1.9)
for i, (h, body) in enumerate(gov):
    c = i % 2; row = i // 2
    x = x0 + c * (cw + gx); y = y0 + row * (ch + gy)
    card(s, x, y, cw, ch, top_color=ROYAL)
    text(s, x + Inches(0.28), y + Inches(0.2), cw - Inches(0.5), Inches(0.4),
         [[(h, 15, INK, True, SERIF)]])
    text(s, x + Inches(0.28), y + Inches(0.62), cw - Inches(0.5), Inches(0.6),
         [[(body, 12, INK_SOFT, False, SANS)]], line_spacing=1.15)
footer(s, 11)

# =====================================================================
# SLIDE 12 — How it evolves (amendments)
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "Living document", "How the constitution changes", ground=PAPER)
text(s, Inches(0.57), Inches(1.7), Inches(12), Inches(0.5),
     [[("Laws change only through the five-stage amendment process — every change recorded with rationale, approver, and date.", 14, INK, False, SANS)]])
stages = ["Proposal", "Review", "Decision", "Enactment", "Propagation"]
sw = Inches(2.05); sh = Inches(1.0); y = Inches(2.9); x0 = Inches(0.7)
for i, st in enumerate(stages):
    x = x0 + i * (sw + Inches(0.35))
    box = rect(s, x, y, sw, sh, fill=ROYAL if i < 4 else ACCENT,
               shape=MSO_SHAPE.ROUNDED_RECTANGLE)
    text(s, x, y, sw, sh, [[(f"{i+1}", 13, GOLD, True, SANS)], [(st, 15, WHITE, True, SANS)]],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE, space_after=Pt(2))
    if i < 4:
        text(s, x + sw, y, Inches(0.35), sh, [[("→", 22, ROYAL, True, SANS)]],
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
notes = [
    "Rejected amendments are kept — with their rejection rationale.",
    "Repealed laws are never deleted; they stay citable for historical decisions.",
    "The law-integrity CI workflow fails any PR that changes a law without an amendment record.",
]
text(s, Inches(0.7), Inches(4.45), Inches(11.8), Inches(2.0),
     [[("•  " + n, 14, INK_SOFT, False, SANS)] for n in notes],
     line_spacing=1.2, space_after=Pt(8))
footer(s, 12)

# =====================================================================
# SLIDE 13 — Get started
# =====================================================================
s = prs.slides.add_slide(BLANK)
content_header(s, "Your first hour", "Getting started")
steps = [
    ("Read why it exists", "The six pain points and the citable-law model — the 10-minute setup in the training app."),
    ("Skim the Ten Articles", "You don't need to memorize 45 laws. Know the map; cite by ID when it matters."),
    ("Look laws up on demand", "./scripts/law-lookup.sh LAW-2.3  —  or browse docs/constitution/REGISTRY.md."),
    ("Let personas + workflows guide you", "Assume the matching persona; follow the declared workflow for nontrivial work."),
]
y0 = Inches(1.9); x0 = Inches(0.57)
for i, (h, body) in enumerate(steps):
    y = y0 + i * Inches(1.12)
    num = rect(s, x0, y, Inches(0.7), Inches(0.7), fill=CORAL,
               shape=MSO_SHAPE.OVAL)
    text(s, x0, y, Inches(0.7), Inches(0.7), [[(str(i+1), 22, WHITE, True, SERIF)]],
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    text(s, x0 + Inches(1.0), y - Inches(0.02), Inches(11), Inches(0.45),
         [[(h, 18, INK, True, SERIF)]])
    is_code = i == 2
    text(s, x0 + Inches(1.0), y + Inches(0.44), Inches(11), Inches(0.6),
         [[(body, 13, ROYAL_DEEP if is_code else INK_SOFT, is_code, "Consolas" if is_code else SANS)]],
         line_spacing=1.15)
footer(s, 13)

# =====================================================================
# SLIDE 14 — Closing
# =====================================================================
s = prs.slides.add_slide(BLANK)
_set_bg(s, ROYAL)
rect(s, 0, Inches(5.0), EMU_W, Inches(2.5), fill=ROYAL_DEEP)
gold_rule(s, Inches(0.9), Inches(2.5), Inches(2.2))
text(s, Inches(0.85), Inches(2.7), Inches(11.6), Inches(2.0),
     [[("Make quality systematic,", 44, WHITE, True, SERIF)],
      [("not heroic.", 44, CORAL, True, SERIF)]], line_spacing=1.05, space_after=Pt(4))
text(s, Inches(0.9), Inches(5.4), Inches(11.5), Inches(1.2),
     [[("Numbered. Versioned. Citable. Enforced. Binding on humans and AI alike.", 16, RGBColor(0xD7,0xDC,0xF2), False, SANS)],
      [("Eliassen Group Engineering Constitution  ·  v1.2.0", 13, FOOT_TXT, True, SANS)]],
     space_after=Pt(8))

prs.save("Engineering-Constitution-Overview.pptx")
print("Saved Engineering-Constitution-Overview.pptx  (%d slides)" % len(prs.slides._sldIdLst))
