# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Undecided. Ramón chooses the stack as the last planning phase, after design and block-out. The Vite + React + Tailwind scaffold already in this repo is an abandoned attempt and is not binding.

## Users

One site, one identity, two kinds of visitor who each get about a minute:

- Engineering recruiters and mentors: internship and scholarship reviewers, research groups and university teams judging Ramón as a robotics and software engineer. They arrive from the CV, LinkedIn or GitHub.
- Freelance web clients: artists, non-profits and small organizations deciding whether to hire him to build their site. They arrive by referral or from the footer credit of a site he built.

FRC students, MechaLeague participants and peers also visit, but they are not who the site is written for.

## Product Purpose

The personal site and portfolio of Ramón de León Cabrera (Saltillo, Coahuila): who he is, what he has built, and how to reach him. Success is a visitor who can say in one sentence what he builds and who then opens a project or contacts him.

## Positioning

He builds the whole system and then gives it away: the robot's control code, the competition the robot plays in (MechaLeague, built from off-the-shelf parts so any student can enter), and the websites that put artists and cultural non-profits online. Robotics and web are the same habit, not two careers.

## Operating Context

- Linked from the CV (Spanish), GitHub, LinkedIn, and client-site credits. Current public URL on the CV is ramondeleonca.vercel.app.
- Read on a laptop by recruiters and on phones by peers and clients; must be responsive.
- Bilingual, Spanish and English, with a visible switch.

## Capabilities and Constraints

- Must carry: profile, projects (web and robotics), experience, education, skills, awards, contact.
- The previous attempt failed because effects (preloader, custom cursor, sideways scroll) were built before any content existed, and then time ran out. Content and structure come first; motion is added to a page that already works.
- Planning order set by Ramón: design, then block-out and behaviors, then stack.
- Code is written with the ponytail skill: smallest change that fully solves the task.
- Undecided: which projects beyond the CV are featured (Roomie/Salitas, MechaLib, VANTTec OpenLab and others exist locally but are unconfirmed); domain name.

## Brand Commitments

Set by Ramón on 2026-11-12 after rejecting two rounds of static, print-derived proposals:

- A lot of motion. Motion and interaction are the design, not a layer added at the end.
- It must feel fresh and innovative, native to the browser. Nothing that reads as a poster, a sign, or any other printed object put on a screen.
- Proposals are judged as moving prototypes, never as still images.

Restarted from his original code on 2026-11-17 (the Tuned, Swarm and Drive prototypes were rejected). Confirmed in interview:

- Must work well on mobile, not only fit: mobile is a first-class target.
- Scroll: horizontal on desktop, vertical on mobile, both smoothed (lerped), ideally with Lenis. Subtle page skew from scroll velocity, almost none on mobile.
- Keep the preloader with a percentage counter from the original.
- Dropped from the original: the custom cursor and the giant-name hero.
- First screen after the preloader: a motion-graphics collage or montage of his material, with his name on it. Chosen from `demos/collage.html`: the pieces fall in and settle after the preloader, float with the pointer, then spread outward as the visitor scrolls on, opening onto the projects.
- Collage material he can supply: competition photos, video clips, CAD renders, screenshots of his websites.
- Palette: black ground, orange as the dominant accent, blue as a rare spark.
- Type: replace Montserrat with a condensed, heavy display face.
- Reference register: experimental Awwwards-style portfolios.
- Preloader: the percentage climbs the screen and an orange wipe reveals the page at 100, while the collage faintly assembles in the background as it loads.
- Projects, after the collage opens: the big ones (MechaLeague, Blue Ignition 3526, Soul of Mexico) each take a full screen with a huge condensed title, one large image or clip and two lines of text; smaller projects follow in a strip of images. On mobile they stack vertically. MechaLeague and Blue Ignition carry his role and dates, so there is no separate experience section.
- After the projects: About, Awards, Contact.
- Language: a small fixed ES / EN switch in a corner that swaps the text in place without reloading.

Later decisions (2026-11-18):

- Type: Archivo expanded for display, system-ui for text, IBM Plex Mono for labels (this supersedes the condensed face above).
- No "spark" dot or pulsing marker anywhere. Ramón removed it from the navbar; blue stays a rare accent color only.
- The preloader must never hold the page back: skip it when the page is already loaded, and finish fast once loading ends.
- Small projects open a full-screen sheet at /proyecto/:slug (React Router, works with Back and Forward).

## Project list

Confirmed by Ramón on 2026-11-18 against his GitHub (`ramondeleonca` and his organizations).

Big projects, one full screen each:

- MechaLeague: the competition he founded, with its derivatives listed below as small projects. Site: mechaleague.site.
- Blue Ignition 3526: his FRC team, including the robot code from 2023 to 2025 (`Blue-Ignition3526/FRC2023-WORLDS` for Baymax 2023, `FRC-2024-CODE`, `SEASON-25-BLUE-IGNACIO` for BlueIgnacio 2025).
- Soul of Mexico: soulofmexico.ca.
- STEMu: desktop app that separates songs into instrument and vocal stems (`ramondeleonca/stemu`).
- Korus lyrics: the KXLRC binary lyrics format and the KSRT subtitle/karaoke format (`ramondeleonca/kxlrc`, `KorusbyAnthm/ksrt`).

Small projects, in the strip:

- MechaLeague derivatives: MechaLib (library, docs at ramondeleonca.github.io/MechaLib), Match Management System (`MechaLeague-MMS`, successor to `MechaLeague-MatchManager`), MechaTag (AprilTag localization camera on a Raspberry Pi Zero 2 W, has a demo video), MechaLeague Robot (ESP32/Arduino robot platform, `MechaLeague-Bot`).
- Blue Ignition derivatives: BlueScout (scouting PWA, mobile app, server and dashboard), ignition.blue (team website).
- Ana Martín: artist portfolio.
- TFT_eGUI: framework for lightweight, declarative, reactive TFT GUIs.
- Spotidry: Spotify music downloader.
- BitPhoton: WiFi and CAN light sensor for the BitBot Automation ecosystem (`BitBot-Automation/BitPhoton`).
- B-Comfy: app and ESP32 device, PrepAPPs TEC finalist 2024.
- DECK: modular MIDI DJ controller.
- Coahuila Creations: coahuilacreations.xyz.
- Korus Tech: korus-tech.vercel.app.

Excluded: Roomie/Salitas and OpenKVM (not his), VANTTec OpenLab (not wanted).

Several READMEs carry banners and screenshots usable as collage and project material (STEMu, Spotidry, MechaLeague MMS and Match Manager, BlueIgnacio 2025 pit photo, Baymax 2023 photo).

## Evidence on Hand

- CV: `~/Downloads/CV_Ramon_de_Leon_Cabrera.pdf` (Spanish, one page).
- Web projects, live: soulofmexico.ca (Next.js, bilingual, Calgary non-profit that represents Mexico at the Calgary Stampede); ana-martin-artist.vercel.app (React/TypeScript artist portfolio, designed and built end to end).
- MechaLeague, own project, Sep 2024 to present: project lead; control system from off-the-shelf components; MechaLib library. Assets in `../MechaLib/assets` (logos, `field.png`, `website-tournament.png`, Chemistry Quest art).
- FRC Team Blue Ignition 3526: software lead Jul 2022 to Jun 2025, software mentor Aug 2025 to present.
- Awards: Judges' Award, FRC Bayou Regional (2025); Regional Winner, FRC Laguna (2023); semifinalist at FRC Monterrey, Laguna, Mexico All-Star and Bayou (2024 to 2025); finalist, PrepAPPs TEC (2024).
- Education: B.S. Robotics and Digital Systems Engineering, Tecnológico de Monterrey, Campus Saltillo, 2025 to 2029; PrepaTec 2022 to 2025.
- Languages: Spanish (native), English (C1), German (A2).
- Photos: `public/pfp.jpg` is 400×400, too small for large use. Ramón says he has robot and competition photos and video, and CAD and field drawings; none are in the repo yet.
- Do not fabricate: testimonials, client quotes, metrics, employers, or project outcomes not listed here.

## Product Principles

1. Motion carries real content. Every moving thing is a real project, word or photo, so the site never again becomes effects with nothing under them.
2. One person, not two pitches. Robotics and web sit in the same list.
3. Show the thing made: the robot, the field, the live site. Skill lists are supporting evidence.
4. Every claim is from the CV or something Ramón confirms.
5. Finishable. A scope a first-year engineering student can ship and keep current.
