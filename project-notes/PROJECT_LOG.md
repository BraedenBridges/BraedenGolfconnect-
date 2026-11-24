# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Team name:** Golf Connect Team
**Startup name:** Golf Connect
**Live site link:** 

---

## Work sessions
### Session — 2026-11-23 — driver: Braeden

- **Goal for this session:** Restart the placeholder project and build a complete Golf Connect prototype.
- **Key prompts we gave Copilot** (paste the important ones):
  1. "Create Golf Connect: an online platform that connects golfers based on location, skill level, availability, and interests."
  2. "Include finding players, organizing rounds, discovering tournaments, and tracking golfing experiences."
  3. "Refer to the rubric and update the business case log."
- **What worked:** The prototype now has a branded home page, fictional golfer profiles with filters, tournament discovery, a local golf round journal, and browser-saved profile and round interactions.
- **Revenue update:** Added a Premium option at $5/month, with advanced interest matching, tournament alerts, partner insights, clearly labeled golf-shop advertising, and promoted tournament listings.
- **What broke, and how we fixed it:** The original starter used generic startup text and sample listings. It was replaced with Golf Connect-specific data and interactions.
- **Committed?** no — changes ready for a checkpoint

### Session — 2026-11-24 — driver: Braeden

- **Goal for this session:** Add a way for golfers to find teaching pros at other courses and book lessons.
- **Key prompts we gave Copilot** (paste the important ones):
  1. "I want to be able to add a feature where players can search for pros at other golf courses to be able to book lessons with them. update the business case and project log when finished"
- **What worked:** Added a Find pros page with fictional instructor profiles and search across pro name, golf course, area, and lesson specialty. Players can choose a lesson type and date/time, then save a demo booking locally and see it in their booking list.
- **Business case update:** Added lesson discovery as a customer need, potential course/pro value and revenue options, two-sided network considerations, and risks around credentials, availability, cancellations, and trust.
- **Prototype limitation:** Pro listings, availability, and bookings are fictional. Bookings stay in browser storage and do not contact a pro, check a calendar, or confirm an appointment.
- **What broke, and how we fixed it:** No issues encountered.
- **Committed?** no — changes ready for a checkpoint

---

## Things that broke (running list)

| Date | What went wrong | What we tried | What finally fixed it |
|---|---|---|---|
| 2026-11-24 | Local `main` and `origin/main` had diverged. | Integrated the local and remote commits. | Synchronized the branches. |

## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |
|---|---|---|
| Verified pro profiles and course partnerships | Confirm teaching credentials and permission to list each professional; helps golfers trust listings. | Medium — provider onboarding, verification process, and ongoing support. |
| Shared lesson availability and booking confirmations | Prevent double-booking and make sure a requested lesson is actually accepted by the pro. | Medium to high — provider calendars, booking backend, notifications, and support. |
| Lesson payments, cancellations, and refunds | Handle real transactions fairly and set clear responsibilities for missed or cancelled lessons. | High — payment processing, policies, dispute handling, and legal/accounting review. |

## Reflection (fill in at the end)

1. What surprised you most about building software with AI?
2. Which parts were easy, and which were hard? Why do you think that is?
3. If a competitor had the same AI tool, how long would it take them to copy your site?
