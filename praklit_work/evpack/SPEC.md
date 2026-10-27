# מפרט כתיבת שיעור — פרקליט · דיני ראיות (ובהמשך קורסים נוספים)

You are writing full, in-depth Hebrew law-school lessons for "פרקליט", an Israeli law-education platform
(LLB students + bar-exam interns). The owner explicitly asked: "סיכומים ברמה איכותית מטורפת ולא קצרים
שמתמצתים ממש את החומר — קורס מלא כמו שצריך". Each lesson must be a COMPLETE, deep lesson a student can
learn the topic from, start to finish, and pass the exam (university course exam + bar exam level).

## Output: one Python module per lesson
Write `/home/claude/evpack/lN.py` (N = lesson number). Exact variables:

```python
# דיני ראיות · שיעור N · <title>
N=<int>
SIMPLE='2–3 plain-language sentences — "explain it to me simply".'
PARTB='''<HTML>'''
CASES=[{'n':'ע״פ 1234/56 פלוני נ׳ מדינת ישראל','tag':'2–4 word label','story':'the background, 1–3 sentences','hold':'the holding, 2–5 sentences, may use <b>'}]
QS=[{'q':'question','o':['A','B','C','D'],'c':<0-3>,'why':['why A right/wrong','why B…','why C…','why D…']}]
SOURCES=[('title','https://…'), ...]   # the pages you actually used (for the owner's source list; not shown in app)
```
Look at `/home/claude/evpack/l1.py` for the existing format and tone (but note: l1 is TOO SHORT — the new standard below is ~3x deeper).

## PARTB — content standard (minimum 1800 words, target 2200–3000)
Allowed HTML only: h3, h4, p, b, i, ul, ol, li, table/tr/th/td, br, and these classes only:
`<p class="pkw-law">` (statute quote), `<div class="pkw-box tip">` (tip), `<div class="pkw-box warn">` (exam trap),
`<div class="pkw-box key">` (key takeaways). No links, no inline styles, no images, no scripts.
Number the h3 sections ("<h3>1. …</h3>"). Suggested structure (adapt to the topic):
1. מבוא — what the topic is, why the rule exists (policy rationale), where it sits in the course.
2. The statute — quote the relevant sections VERBATIM in `pkw-law` and then explain each element.
   Evidence Ordinance texts are in `/home/claude/d9/evid_law.txt` (taken from the app — use these exact texts).
   Other statutes: quote only from official/verified text (e.g. he.wikisource.org, nevo free pages, gov.il, knesset).
3. The case law — every leading ruling of the topic, in logical order, with what it decided and why it matters;
   tensions between approaches; the current (most recent) law. Include recent developments (2015–2026) where verified.
4. Comparison tables (e.g. criminal vs civil, rule vs exception, element-by-element).
5. Worked example — a short fact pattern and how to analyze it.
6. `pkw-box warn` — מלכודות מבחן (common mistakes / traps).
7. `<ol>` שלד לפתרון שאלה — step-by-step skeleton for answering an exam question on this topic.
8. `pkw-box key` — סיכום בנקודות.
Hebrew style: clear, didactic, confident, student-friendly; bold the key terms; short paragraphs; no fluff.
Use Hebrew punctuation ״ and ׳ inside the text (ס׳ 10א, ע״פ, ביהמ״ש, נ׳) — this avoids Python quote problems.

## CASES — 4 to 7 leading rulings per lesson
Only rulings whose case number AND party names you VERIFIED in a search result during this task.
If you know a ruling but cannot verify its number — leave it out of CASES (you may describe the rule in PARTB
without a citation). NEVER invent facts: if you don't know the facts, keep 'story' general
("דיון בשאלת …"), never a made-up narrative. Do not duplicate cases already in other lessons unless central.

## QS — exactly 20 (or more) multiple-choice questions
Mix: ~6 conceptual, ~8 application (short fact pattern: "נאשם… מה הדין?"), ~4 case-law, ~2 statute-text.
Four plausible options (no joke options, avoid "all of the above"). `why` = 4 full explanations (each ≥ 1 real
sentence): for the correct option start with "נכון." and explain; for each wrong option explain precisely why it's wrong.
Spread the correct index across 0,1,2,3 roughly evenly. No duplicate questions.

## Sources, originality, accuracy (IMPORTANT)
- Research with WebSearch/WebFetch: read SEVERAL summaries/lecture notes/articles per topic (Hebrew Wikipedia,
  university/open course materials, law-firm articles, gov.il, court sites, psakdin/takdin articles, academic papers),
  plus recent sources. Use them to learn and as a checklist of what an exam expects.
- WRITE EVERYTHING IN YOUR OWN WORDS. Do not copy sentences or structure from any summary. Statute text and a short
  quote (≤ 1 sentence) from a ruling are fine (public domain in Israel).
- Accuracy over coverage: if not sure of a detail (number, year, amendment), state the rule without the detail.
- Do not touch any file other than your own lN.py.

## Validate
Run `python3 /home/claude/evpack/check.py lN` — it must print OK (structure, tags, word count, 20 Qs, 4 whys, spread).
Also run `python3 -c "import lN"` from /home/claude/evpack to make sure it imports.

## Final report (short)
For each lesson: word count, #questions, #cases, list of case citations used, and any point you were unsure about.
