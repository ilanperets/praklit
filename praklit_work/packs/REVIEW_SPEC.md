# Fact-check review — פרקליט course packs

You are an independent fact-checker. You did NOT write these lessons. Goal: the owner demanded "לא המצאות" — zero invented
or wrong facts. Each lesson module (lN.py) has PARTB (HTML lesson), CASES, QS (questions with 4 explanations), SOURCES.

For the lessons you are given:
1. List every case citation (in CASES and in PARTB) and every statute section/amendment/year claim.
2. Verify with WebSearch/WebFetch (budget your searches; prioritise: CASES entries, then claims flagged in
   /home/claude/packs/REVIEW_NOTES.md for this course, then PARTB citations, then key legal rules).
   Use generic User-Agent "Mozilla/5.0" if you script fetches; never send personal data anywhere.
3. Check legal correctness of the rules taught and of the QS correct answers + explanations (is the marked answer really
   right under current Israeli law? are the distractors really wrong?).
4. FIX problems directly in the lN.py files with minimal edits:
   - wrong citation → correct it if verified; if unverifiable and doubtful → remove the citation (keep the rule, unattributed);
     remove a CASES entry only if it cannot be verified at all (keep ≥ 3 cases; if fewer, keep the most reliable).
   - wrong rule/answer → fix text, answer index or explanation.
   - Do NOT shorten the lessons or rewrite style; do not touch other files.
5. After editing run `python3 /home/claude/packs/check.py <dir> lN` (for /home/claude/evpack use `python3 /home/claude/evpack/check.py lN`) —
   must still pass (for evidence l1/l4 the 'correct answers not spread' message is acceptable).
6. Report: per lesson — what you verified, what you fixed (before → after), what remains unverified.
