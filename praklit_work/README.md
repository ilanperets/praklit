# פרקליט — קבצי עבודה (נכון ל־26.10.2026)

ראו `פרקליט_מסמך_מערכת_מלא.md` להסבר המלא. כאן רק הוראות טכניות.

## מבנה
- `d9/` — מנגנון הבנייה: `build.py`, שכבת pk9 (`src/*.js|css`), חבילות הקורסים (`src/pack_*.js`), גופנים (`faces.json`), pdf-lib, בדיקות Playwright (`h.py`, `tall.py`, `treg.py`, `tph.py`).
- `packs/` — מפעל התוכן: `SPEC.md` (מפרט כותב), `REVIEW_SPEC.md` (מפרט בודק), `check.py`, `mkpack.py`, `tasks/` (משימות כתיבה מוכנות), `QUEUE` (מה נשאר), `REVIEW_NOTES.md`, `REVIEW_DONE.md`, `USER_FLAGS.md`, `statutes/` (טקסטי חוק מהאפליקציה), ותיקייה לכל קורס (`meta.py` + `lN.py`).
- `evpack/` — קורס דיני ראיות (אותו פורמט; יש לו `check.py` משלו).
- `base/` — הבסיס הנקי לבנייה (לפני שכבת pk9).

## שחזור הסביבה (הנתיבים בקוד מוחלטים)
```
mkdir -p /home/claude /mnt/user-data/outputs
cp -r d9 packs evpack /home/claude/
cp "base/פרקליט_מעודכן_2026_גיבוי_לפני_השדרוג.html" /mnt/user-data/outputs/
```

## בנייה
```
cd /home/claude/packs
python3 mkpack.py /home/claude/evpack      # וכך לכל קורס: intro tort property crimproc civproc corp realestate tax ...
cd /home/claude/d9
python3 build.py /home/claude/d9/main_new.html prod   # prod = ללא כפתור דמו
python3 tall.py /home/claude/d9/main_new.html          # בדיקת קורסים
```
**חשוב:** `build.py` בונה תמיד מהבסיס הנקי (`BASE`). לעולם לא לבנות מהקובץ הראשי — זה מזריק את השכבה פעמיים.

## כתיבת שיעורים חדשים
1. משימה מ־`QUEUE` → הקובץ ב־`tasks/` → כותב לפי `SPEC.md` → `python3 check.py <dir> lN` חייב OK.
2. אחרי כל 5 שיעורים — בודק עובדות לפי `REVIEW_SPEC.md`.
3. `mkpack.py` → `build.py` → בדיקות → הטמעה (עם גיבוי של הקובץ הקודם).

## מצב (26.10)
- מלאים: ראיות, מבוא, נזיקין, קניין, סד״פ, סד״א, תאגידים. מקרקעין 14/15 (חסר 9). מסים 7/15 (1,4,5,7,10,11,13).
- לא נבדקו עובדתית: סד״א 11–15, תאגידים, מקרקעין, מסים.
- בתור: בנקאות (מחדש), קניין רוחני, בינלאומי, ירושה, הוצל״פ, מסחרי, אתיקה.
