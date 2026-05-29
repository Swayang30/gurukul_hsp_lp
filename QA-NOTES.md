# QA-NOTES.md — Gurukul Management Studies Hospital Management Landing Page

Generated: 2026-05-29 | Converted from Hotel & Hospitality Management landing page per master prompt

---

## 1. FLAGS — Client Action Required

| # | Section | Flag | Client Must Supply |
|---|---------|------|--------------------|
| 1 | HEAD / canonical | `[[FLAG: canonical URL]]` | Final subdomain/URL for the Hospital Management landing page (e.g. `hosp.gurukulstudy.in` or similar) |
| 2 | HEAD / og:image | `[[FLAG: og:image URL]]` | Gurukul Hospital Management OG image file |
| 3 | HEAD / og:url | `[[FLAG: og:url]]` | Final Hospital Management landing-page URL |
| 4 | Programme Cards / Fees / FAQ — 4-Year Eligibility | `[[FLAG: Client to confirm]]` | Eligibility criteria for the 4-year Honours Degree — not published by Gurukul |
| 5 | Programme Cards / Fees / FAQ — 3-Year Eligibility | `[[FLAG: Client to confirm]]` | Eligibility criteria for the 3-year Degree — not published by Gurukul |
| 6 | Programme Info Strip — Intake | `[[FLAG: Confirm Hospital Management intake capacity]]` | Confirm the seat intake for Hospital Management (placeholder: 70 used in the stats counter) |
| 7 | Programme Info Strip — Eligibility | `[[FLAG: Client to confirm]]` | Eligibility for the 4-year Honours Degree in the quick-info strip |
| 8 | Fees — 2-Year Advance Diploma | `[[FLAG: Semester-wise schedule not provided]]` | Semester-by-semester payment breakdown for the 2-year Advance Diploma — currently shows total only (₹95,000) |
| 9 | Fees — 1-Year Certificate | `[[FLAG: Payment schedule not provided]]` | Payment schedule for the 1-year Certificate Course — currently shows total only (₹50,000) |
| 10 | Stats Counter — Seats Per Batch | `[[FLAG: Confirm intake]]` | Hospital Management intake capacity — 70 used as placeholder from the Hotel & Hospitality page |
| 11 | Placement / Logo Section | `[[FLAG: Additional healthcare logos]]` | Only Apollo Hospitals and Fortis Healthcare are retained. Client to supply logos of any additional verified hospital/healthcare placement partners |
| 12 | Campus Photos (photo1–photo5) | `[[FLAG: Supply healthcare photos]]` | All 5 campus photos are the same images from the Hotel & Hospitality page. Client must supply genuine hospital/healthcare training area photos |
| 13 | Campus Section — Footer Banner | `[[FLAG: Supply Hospital Management banner]]` | `assets/campus/academics-11.jpg` is the current footer banner. Client to supply a Hospital Management version |
| 14 | Hero Background | `[[FLAG: Supply hospital-relevant hero image]]` | Current hero background shows hospitality-context students. Client to supply a hospital/healthcare-relevant image |
| 15 | Brochure File | `[[FLAG: Replace with Hospital Management brochure]]` | `assets/campus/Gurukul_brochure.jpeg` is the Hotel & Hospitality brochure. Suggested replacement filename: `assets/campus/Gurukul_Hospital_brochure.jpeg`. Update `BROCHURE_PATH` and `BROCHURE_FILENAME` constants in `script.js` when provided |
| 16 | Admission Step 5 | `[[FLAG: Orientation/class-start dates]]` | Confirmed 2026–27 orientation and class-start dates for Hospital Management |
| 17 | Footer — Social media | `[[FLAG: Social media URLs]]` | Gurukul Facebook, Instagram, LinkedIn, YouTube profile URLs (currently link to `#`) |
| 18 | JSON-LD / og URL | Placeholder domain used | Final domain to replace `https://gurukulmanagementstudies.in/` once confirmed |
| 19 | GTM Tag | `GTM-M75GKJQ` | Client to confirm this is the correct Gurukul GTM container ID, or replace before go-live |

---

## 2. REMOVED CONTENT

| Item Removed | Original Location | Reason |
|---|---|---|
| Hotel/airline recruiter logos: Taj, ITC Hotels, JW Marriott, Hyatt, Oberoi, Radisson, The Leela Palace, Hilton (hi.svg), Pride Hotels, Crowne Plaza, Carnival, IndiGo, Akasa Air, Ginger Hotels, Vivanta, Hard Rock Cafe (HRC01), WW.svg, The Park Hotels | Section 10 — Partners logo wall | Per master prompt §5.13 and §9 — not relevant to Hospital Management; only Apollo Hospitals and Fortis Healthcare retained |
| Hospitality career roles: Executive Housekeeper, Front Office Director/Manager, Executive Chef, Airhostess, Flight Purser, Cruise Job, Galley Attendant, General Manager, Airport Manager, F&B Manager, Bar Tender | Section 9 — Career Cards | Replaced with Hospital Management career roles per §5.6 |
| Hotel-specific campus lab labels: Training Kitchen, Mock Front Office, Mock Restaurant Lab, Housekeeping Lab, Bakery Lab | Section 11 — Campus Bento | Replaced with healthcare-appropriate labels per §5.14 |
| Hotel & Hospitality fee structure: ₹40,000 admission + 8 × ₹25,000 = ₹2,40,000 (4-year); ₹1,50,000 (3-year diploma); ₹1,10,000 (2-year); ₹65,000 (1-year) | Section 13 — Fees | Replaced with Hospital Management fee structure per §5.2 |
| Programme dropdown options: 3-Year Diploma in Hotel & Hospitality Management, 2-Year Advance Diploma, 1-Year Advance Certificate | Hero Form + Programme Cards | Replaced with Hospital Management programme options per §5.11 |
| Year-block content: Front Office, F&B, Housekeeping, Culinary, Restaurant Operations, Guest Relations, Hospitality Management | Section 8 — Programme Journey | Replaced with Hospital Management learning stages per §5.7 |
| Recruiter-note: "Our graduates are placed across leading hospitality, healthcare, aviation and lifestyle brands nationwide." | Section 10 — below logo wall | Replaced with Hospital Management-specific placement note |

---

## 3. RETAINED AS-IS

| Item | Location | Reason |
|---|---|---|
| All 6 student testimonials (Probahan Halder, Sneha Sengupta, Sumita Sen, AMALITA SAMANTA, Rakesh Kumar Paul, Amit Kundu) | Section 12 — Testimonials | Real Gurukul student reviews — preserved verbatim per §5.15. Note: Sneha Sengupta's quote mentions "Hotel Management Students" — this is the student's original words and must not be edited |
| Affiliation logos: MAKAUT, AICTE, IIC, Ministry of Education (hero badges + footer) | Hero + Footer | Unchanged — same affiliations apply to all Gurukul programmes |
| All contact information: +91-9830227324, +91-9830390636 (WhatsApp), gurukul221@gmail.com | All sections | Unchanged — same contact for all programmes |
| Campus addresses: Kankinara (Main Campus), Bidhannagar (City Office) | Campus section + FAQ + Footer | Unchanged |
| Scholarship / funding cards: Merit Discounts, One-Time Payment, Education Loan Support | Section 13 — Fees | Content is programme-agnostic; amounts and conditions are the same for all Gurukul programmes |
| Award cards (Award1.png, Award3.png, Award4.png) | Section 7 — Awards | Awards apply to all Gurukul programmes; Award4.png title still pending from client |
| All fine-print fee notes (hostel, security deposit, exam fees, late payment, 80% attendance) | Section 13 — Fees | Confirmed as identical across all Gurukul programmes |
| Admission process steps (5-step flow) | Section 14 — Admission | Generic to all Gurukul programmes |
| CSS variables, JS functions, form validation, brochure-gate logic, GTM snippet, success modal markup | Entire page | Per §8 — do not touch |

---

## 4. IMAGES THAT NEED REPLACING

| File | Current State | Action Required |
|---|---|---|
| `assets/images/photo1.png` | Hotel/hospitality training photo | Client to supply Administration Lab photo |
| `assets/images/photo2.png` | Hotel/hospitality training photo | Client to supply Front Desk Training photo |
| `assets/images/photo3.png` | Hotel/hospitality training photo | Client to supply Documentation & Records Lab photo |
| `assets/images/photo4.png` | Hotel/hospitality training photo | Client to supply Soft Skills & Communication Lab photo |
| `assets/images/photo5.png` | Hotel/hospitality training photo | Client to supply Audio-Visual Classroom photo |
| `assets/campus/academics-11.jpg` | Current footer banner | Client to supply Hospital Management footer banner |
| `assets/campus/Gurukul_brochure.jpeg` | Hotel & Hospitality brochure | Client to supply Hospital Management brochure — update `BROCHURE_PATH` in script.js |
| Hero background | Shows hospitality-context students | Client to supply hospital/healthcare-relevant hero image |

---

## 5. OPEN CLIENT CONFIRMATIONS BEFORE GO-LIVE

| # | Item | Detail |
|---|------|--------|
| 1 | **Subdomain/URL** | Confirm final URL for Hospital Management landing page (e.g. `hosp.gurukulstudy.in`) — update canonical, og:url, og:image, JSON-LD |
| 2 | **Eligibility — 4-year Honours** | Confirm admission eligibility for the 4-year Hospital Management Honours Degree |
| 3 | **Eligibility — 3-year Degree** | Confirm admission eligibility for the 3-year Hospital Management Degree |
| 4 | **Intake capacity** | Confirm Hospital Management seats per batch (placeholder: 70 in stats counter) |
| 5 | **Hospital Management brochure** | Supply brochure PDF/JPEG — update `BROCHURE_PATH` and `BROCHURE_FILENAME` in script.js |
| 6 | **Healthcare placement partners** | Supply logos of any additional verified hospital/healthcare companies for the placement logo wall (beyond Apollo Hospitals and Fortis) |
| 7 | **Campus photos (×5)** | Supply genuine Gurukul hospital/healthcare training area photos for all 5 bento cells |
| 8 | **Footer banner image** | Supply a Hospital Management banner to replace `academics-11.jpg` |
| 9 | **Hero background image** | Supply a hospital/healthcare-relevant hero background |
| 10 | **OG image** | Supply a Hospital Management social sharing image (og:image) |
| 11 | **Semester-wise fee breakdown** | Supply payment schedules for 2-year Advance Diploma (₹95,000 total) and 1-year Certificate (₹50,000 total) if semester-level breakdowns are available |
| 12 | **Social media URLs** | Supply Facebook, Instagram, LinkedIn, YouTube profile URLs for footer |
| 13 | **Orientation / class-start dates** | Confirm 2026–27 orientation and class-start dates for Hospital Management |
| 14 | **Award4.png title** | Supply the award name for `Award4.png` (existing flag from Hotel & Hospitality page — unchanged) |

---

## 6. JUDGEMENT CALLS & NOTES

| Item | Decision | Rationale |
|---|---|---|
| Testimonials containing "Hotel Management" wording (Sneha Sengupta's quote) | Preserved verbatim | §5.15 explicitly states "Do not change any quote, name, or batch year." This is the student's own words. Noted in §9 zero-match check as an approved exception. |
| Stats counter seat target (70) | Kept as placeholder | A zero or empty counter would break the JS animation. 70 is the existing value and may or may not be correct for Hospital Management — flagged for client to confirm. |
| Indicative learning journey label | Added as visible `<em>` paragraph above year cards | §5.7 explicitly requested a visible label. Added without new classes — uses existing body styles. |
| 3-year fee table (new addition) | Added below 4-year table within same `fees-table-wrap` div | §5.12 explicitly requested a second table. Used the same `fees-table` class and structure as the 4-year table. |
| Exit intent modal (commented out) | Updated text within comment block | Modal is commented out and not rendered. Updated anyway for completeness in case it is activated later. |
| Photo4 src attribute | Changed from `photo4.jpg` (original had a `.jpg` in the src, `.png` in the source element) to `photo4.png` | Corrected a likely typo from the original Hotel & Hospitality page — both source and img now reference photo4.png. |
| Award1 title | Removed "Hotel & Hospitality Management," prefix, keeping "Hospital Management, BCA and BBA." | Per §4 global find & replace and §9 zero-match requirement — the award covers multiple programmes, revised to Hospital Management context. |

---

## 7. ZERO-MATCH VERIFICATION (per §9)

All forbidden strings confirmed absent from visible and structural HTML:

| String | Status |
|--------|--------|
| `Hotel & Hospitality Management` (visible content) | ✓ Removed |
| `Hospitality Management` | ✓ Removed |
| `hospitality` (programme-describing text) | ✓ Removed (student quotes preserved per §5.15) |
| `Hotel Management` (as programme name) | ✓ Removed (remains only in Sneha Sengupta's verbatim student quote — preserved per §5.15) |
| `landing_course" value="Hotel` | ✓ Removed |
| All hotel/airline logo `<img>` tags (Taj, ITC, JW Marriott, Hyatt, Radisson, Leela, Hilton, IndiGo, Akasa, Ginger, Vivanta, Carnival, WW.svg, HRC01, THE-PARK, crown_plaza, Pride Hotels) | ✓ All removed |
