# CLAUDE.md: Dr. Riazi's Veterinary Website

Read this file first. Do not re-explore the whole repo to "get familiar". Use the Site Map below. If something is missing from it, look only at the files the task needs, then add what you learned to the Site Map.

## Owner and goal
- Owner: Dr. Seyed Farhad Riazi, veterinarian, 12+ years of clinical work. Technical manager of a pharmacy and company, and a vaccine center.
- Audience: Iranian livestock farmers and pet owners. Most visit on a phone, often on a slow connection.
- Goal of the site: make a visitor trust the doctor and take ONE action (call, WhatsApp message, book a visit, or order). Every change must serve this goal.
- Live site: https://veterinary-assistant-qldk.bolt.host/ (Bolt project, GitHub user: farhad789)
- Instagram: @dr_seyedfarhadriazi

## Via negativa: remove before you add
Before adding anything, ask: "What can I remove so the visitor reaches the action faster?" Prefer deleting, shortening and simplifying over adding.

**Never do these:**
- No more than one main call-to-action per screen.
- No pop-ups, auto-playing video or audio, or sliders.
- No jargon. If a farmer would not say the word, replace it.
- No long paragraphs. Short lines, clear headings.
- No fake reviews, fake before/after photos, or stock photos passed off as real clinic photos.
- No medical claims you cannot back up. No guaranteed cures. If unsure, flag it and ask the owner.
- No drug dosages or self-treatment instructions for the public. Send them to a visit or a call.
- No outdated prices, phone numbers or opening hours. If unsure, ask.
- No heavy images or fonts. Compress images and use few font weights.
- No new libraries or dependencies for a small change.
- No changes to files unrelated to the task. No refactoring unless asked.
- No dead links, no empty pages, no "coming soon" sections.

## Content rules (Persian)
- Write natural, simple Persian that a farmer or pet owner understands. Short sentences.
- The site is right-to-left (RTL). Check layout, icons and alignment in RTL after every change.
- Use Persian digits only if the site already does. Stay consistent.
- Be accurate on veterinary facts. Flag anything uncertain instead of guessing.
- Advertising of drugs and prescription products can be regulated. Do not add drug promotion or prices. Flag it for the owner to decide.
- Tone: calm, caring, expert. Not pushy, no hype.

## Trust and conversion checklist (apply to every page)
1. Within 5 seconds, a visitor can tell who the doctor is and what he treats (livestock, pets, vaccines).
2. A phone/WhatsApp button is visible without scrolling, and works with one tap on mobile.
3. Real proof is shown: years of experience, real clinic photos, real results (only if the owner provides them).
4. Location and working hours are easy to find.
5. Each service page answers: what is it, who is it for, what do I do next.
6. Page loads fast on a weak mobile connection.

## Tech (verify on first run, then fix this section)
- Built with Bolt. It is likely a Vite + React + TypeScript + Tailwind project, possibly with Supabase. Check `package.json` before assuming.
- Run: `npm install`, then `npm run dev`. Build check: `npm run build`.
- Do not commit secrets or API keys. Never print `.env` values.

## Site map (fill in once, keep updated)
- Pages/routes: (fill in)
- Main components: (fill in)
- Where phone, WhatsApp and address are stored: (fill in)
- Where text content lives: (fill in)
- Where images live: (fill in)

## How to work fast
- Do the change directly. Ask at most ONE question, only if a wrong guess would cost the owner time or money.
- Keep each change small: one purpose per change.
- Before saying "done": run the build, check mobile width (about 375px), check RTL, check there are no broken links.
- Final reply: 1-3 short lines: what changed and which file. No long summaries.

## Working from laptop and phone
- Make changes on a branch, never straight on `main`. Branch name: `change/short-description`.
- Preview the branch, then merge to `main` only after the owner approves.
- Commit messages: one short line in English saying what changed.
- If something breaks, undo with a revert. Do not try risky fixes on the live site.

## Shortcuts the owner can say (add each as a skill in `.claude/skills/`)
- `update-contact`: change phone, WhatsApp, address or hours everywhere at once.
- `new-post`: add an educational post in simple Persian from a topic.
- `add-service`: add a service page using the standard layout.
- `trim-page`: shorten a page and remove clutter (via negativa pass).
- `check-mobile`: review a page at phone width and in RTL, list problems.
- `seo-fa`: improve Persian title, description and headings for a page.

## Handoff between agents
Several agents may work on this site (Claude, ChatGPT, Bolt, Grok). To avoid starting over each time:
- At the START of every task: read `HANDOFF.md`, continue from "Next steps". Do not ask the owner to repeat what is already there.
- At the END of every task, or when you must stop: update `HANDOFF.md` (current state, owner's last instruction, one log line). A half-finished task must say exactly where it stopped.
- Do not undo a decision listed in "Decisions already made" unless the owner says so.
- If `HANDOFF.md` and the code disagree, trust the code, then fix `HANDOFF.md`.
- Other agents read `AGENTS.md`, which points to this file and `HANDOFF.md`.

## Notes
- Keep a short log of decisions in `notes/decisions.md` (date, what, why). Read it before changing something that was decided before.
