# Security+ SY0-701 Acronym Simulator

Standalone offline-capable PWA for practicing the acronym vocabulary listed in the CompTIA Security+ SY0-701 exam objectives.

## Build 8 design
- Separate project that reuses the proven structure and tablet layout of the Security+ exam simulator.
- Dropdown-only questions with five closely related Security+ choices.
- Three question styles mixed through normal tests:
  - approximately 50% Acronym -> Full Name
  - approximately 25% Scenario -> Acronym
  - approximately 25% Acronym -> Function/Purpose
- Each acronym has all three variants available, creating roughly 1,002 study variants from the 334 acronym meanings in the bank.
- Coverage tracking prioritises acronym/mode combinations seen less often so repeated tests gradually work through all three variants.
- Avoids repeating the same acronym twice in a normal test where the selected pool allows it.
- Handles acronyms with multiple meanings by adding enough context to keep questions unambiguous.
- 25, 50, 100, full-list, domain-focused, and weak-area tests.
- Challenging distractors prioritised from the same topic/domain and similar terminology.
- Detailed answer review after submission, paged five questions at a time for tablet stability.
- Review shows the learner's answer, correct answer, why a wrong answer was wrong, and a practical real-world example of where the acronym or technology is used.
- Persistent local statistics for domains, topic areas, individual acronyms, and three-way variant coverage.
- Weak-area practice mode.
- Offline PWA support for Android/tablet use.

## Scoring
This is a study score, not CompTIA's live exam scoring model.

## Domain grouping
The official objectives publish an acronym list, but do not map every acronym to exactly one domain. The app assigns each item a primary study domain and topic area for useful progress tracking.

## Source note
The acronym coverage is based on the CompTIA Security+ SY0-701 objectives acronym list. Explanations, scenarios, functions, real-world examples, question construction, categorization, and study material in this simulator are original.

## GitHub Pages
Deploy from `main` / root. The app can then be installed as a PWA from Chrome or Samsung Internet.
