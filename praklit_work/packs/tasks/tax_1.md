# Task: דיני מסים — lessons [1, 2, 3]
Read /home/claude/packs/SPEC.md carefully and follow it exactly. For format see a finished lesson module, e.g. /home/claude/evpack/l4.py or any lN.py in /home/claude/packs/intro/ that passes check.py.

Course: דיני מסים (course id `tax`, directory /home/claude/packs/tax/). The full 15-lesson syllabus (fixed order) is:
1. שיטת המס בישראל
2. מקור ההכנסה (ס׳ 2 לפקודה)
3. הכנסה פירותית מול הונית
4. ניכויים, זיכויים וקיזוזים
5. מיסוי יחיד מול חברה
6. מס ערך מוסף
7. מיסוי מקרקעין
8. מיסוי בינלאומי
9. נאמנויות ומיסוין
10. תכנון מס לגיטימי
11. עסקה מלאכותית (ס׳ 86)
12. מיסוי שוק ההון
13. פטורים ונקודות זיכוי
14. דיווח ושומה
15. השגה וערעור מס

Write these lessons as full in-depth modules: l1.py — N=1 — "שיטת המס בישראל", l2.py — N=2 — "מקור ההכנסה (ס׳ 2 לפקודה)", l3.py — N=3 — "הכנסה פירותית מול הונית".
Look at the neighbouring lessons' titles so you don't overlap them; cover your topic completely for this course
(Israeli law, LLB course + bar-exam level). Statute texts available in the app: /home/claude/packs/statutes/*.txt.
Do the research per SPEC (several sources per lesson, verify every case citation), write originally in Hebrew,
validate each file with `python3 /home/claude/packs/check.py /home/claude/packs/tax lN` until OK.
Return the short final report described in SPEC.

Figures (tax rates, thresholds, credit-point values, interest caps, fees): use only verified current (2026) figures from official/reliable sources, with the year; otherwise describe without numbers.
