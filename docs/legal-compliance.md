# LessonLab — Legal & Compliance

**Entity:** Luck Dragon Pty Ltd · ABN 64 697 434 898
**Service:** LessonLab (www.lessonlab.com.au)
**Last updated:** 1 May 2026 (rev 2 — Stripe GST + BAS deadlines added)

---

## Live legal pages

| Page | URL | Status |
|---|---|---|
| Privacy Policy | /privacy | ✅ Live |
| Terms of Service | /terms | ✅ Live |
| Refund Policy | /refund | ✅ Live |

All three pages are linked from the marketing page footer and include the ABN.

---

## What's covered

### Privacy Policy
- Compliant with *Privacy Act 1988* (Cth) and Australian Privacy Principles
- Discloses: email, name, school name collected
- Third parties disclosed: Stripe (payments), Anthropic/OpenAI (AI), Cloudflare (hosting), Resend (email)
- AI inputs: subject/year level sent to AI providers — **name, email, school name are NOT sent**
- Data stored: Cloudflare + Supabase (US infrastructure)
- Retention: data removed within 30 days of deletion request (except 7yr financial records per ATO)
- Account deletion: users click "Request Account Deletion" in Account Settings → mailto prefilled to hello@lessonlab.com.au. Manual process; handle within 30 days.
- Rights: access, correction, deletion on request to hello@lessonlab.com.au
- Complaints: Office of the Australian Information Commissioner (OAIC) — oaic.gov.au
- Cookies: essential only, no advertising/tracking cookies

### Terms of Service
- Subscriptions: monthly/annual, auto-renew, cancel anytime
- **AI disclaimer:** generated content is a planning aid only — teacher takes professional responsibility
- Curriculum alignment: best efforts, not guaranteed — teachers should verify against official VC2.0
- IP: teacher owns generated lesson plans; LessonLab owns platform, unit structures, scaffolds
- Acceptable use: no resale, no scraping, no account sharing
- Liability cap: 12 months of fees paid
- ACL carve-out: nothing limits Australian Consumer Law rights
- Governing law: Victoria, Australia

### Refund Policy
- **7-day full refund guarantee** for new subscribers (no questions asked)
- Monthly: cancel anytime, access to end of period, no pro-rata refunds after 7 days
- Annual: full refund within 7 days; no partial refunds after that
- Billing errors: investigated and refunded within 5 business days
- ACL major failure rights preserved

---

## Outstanding — action required

### 🔴 Insurance (get quotes this week)

| Type | Why needed | Priority |
|---|---|---|
| **Professional Indemnity** | Covers claims that LessonLab content caused harm (wrong lesson plan, curriculum error). Main exposure for an ed-tech SaaS. | **HIGH** |
| **Cyber Liability** | Covers data breach costs, OAIC notification, legal fees if hacked. Holds teacher PII. | **HIGH** |
| Public Liability | Less critical (online-only), but often bundled cheaply with PI. | Medium |

**Suggested provider:** BizCover (bizcover.com.au) — online quotes, ~30 min.
Typical cost for small SaaS: PI $500–1,500/yr · Cyber $500–1,200/yr.

### ✅ GST registration
- Registered from 23 April 2026 ✅
- Stripe Tax: `status: active`, head office AU/VIC, all prices set to `tax_behavior: inclusive` ✅
- `automatic_tax[enabled]: true` added to all checkout sessions (deployed 1 May 2026) ✅
- Stripe will calculate and display GST on checkout and issue tax-compliant invoices automatically
- **BAS — Q1 (Apr–Jun 2026):** due 28 July 2026. Lodge via ATO Business Portal or your accountant.
  - Q2 (Jul–Sep): due 28 Oct 2026
  - Q3 (Oct–Dec): due 28 Feb 2027
  - Set a calendar reminder now. Late lodgement attracts penalties.

### 🟡 Trademark — "LessonLab"
- Name not yet registered
- Search at ipaustralia.gov.au (class 41 — education services)
- Filing fee: ~$250 per class
- Do this before significant marketing spend

### 🟢 Notifiable Data Breaches (NDB) scheme
- Under *Privacy Act 1988*, any eligible data breach must be reported to OAIC + affected individuals
- A breach is "eligible" if it's likely to result in serious harm to an individual
- **Action:** Create an internal incident response plan — who to contact, timeline (72hr to assess, 30 days to notify)
- Document is: who holds data access, what's encrypted, what triggers notification

### 🟢 DET/school procurement (future)
- Currently selling to individual teachers only — no DET approval needed
- If selling directly to schools (school invoices, bulk licences), Victorian DET has a supplier vetting process
- Keep individual-teacher model to avoid this complexity while small

---

## Technical security posture (as of 2026-05-01)

| Item | Status |
|---|---|
| HTTPS everywhere | ✅ Cloudflare SSL |
| Payment data | ✅ Stripe handles PCI — we never see card numbers |
| Passwords | ✅ Supabase auth (bcrypt hashing) |
| API auth | ✅ JWT tokens, PIN-gated admin endpoints |
| Student data | ✅ None collected — teacher-only tool |
| AI data isolation | ✅ Name/email/school NOT sent to AI providers |
| CF zone | ⏳ lessonlab.com.au pending activation (nameservers set, auto-activates) |

---

## Key contacts

| Role | Contact |
|---|---|
| Support / legal queries | hello@lessonlab.com.au |
| Privacy complaints | hello@lessonlab.com.au → escalate to OAIC if unresolved |
| Stripe dashboard | dashboard.stripe.com |
| OAIC | oaic.gov.au / 1300 363 992 |
