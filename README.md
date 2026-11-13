# Schoology Platformer

A playable, self-contained browser platformer inside four recreated Schoology student pages. The full webpage is the level: there is no separate scrolling game arena or staircase of floating cards. No login, real student data, remote assets, API, or runtime packages are required.

## Play

With Node.js 20 or newer:

```sh
npm start
```

Open `http://localhost:3000`. Set `PORT` to use another port. Any static HTTP server can also serve the production files; opening `index.html` directly is not supported because the game uses JavaScript modules.

- **A / D or Left / Right:** move
- **Space / W / Up:** jump while grounded
- **R:** restart the page, clearing checkpoints and falls
- **Esc:** pause / resume

Land on flagged page elements to activate checkpoints. Falling off the page respawns you at the latest checkpoint. Land on **Next Page** to automatically advance; finish Calendar to win. The header's **Courses** menu and left navigation let you practice any page directly.

Page elements are one-way surfaces: the cursor can jump through their undersides and stand on top. To get to a lower row, walk off an edge, then steer back underneath. Courses has a route across the upper card row, down around the outside of the grid, across the lower cards, and onto the right sidebar's **View all upcoming** control before the goal. Links with a subtle lower border, score boxes, submission buttons, and event chips are standable in later pages. There is no invisible solid floor.

## Four different webpages

1. **Courses · Easy:** six illustrated course cards in a normal two-row grid, course sidebar, reminders, upcoming assignments, and three checkpoints.
2. **Assignments · Medium:** material and folder listings, due-date chips, submission buttons, two checkpoints, and moving controls within their rows.
3. **Grades · Hard:** gradebook table, assignment links, points, percentage cells, semester summary, narrower surfaces, and one checkpoint.
4. **Calendar · Very hard:** November 2026 month grid, date numbers, events inside calendar cells, small moving event chips, and one checkpoint.

All pages share the Schoology-style blue header with branding, Courses / Groups / Resources / Grades navigation, original SVG icons, a fictional student profile, and left and right sidebars. The interface fits Chromebook-sized windows with the top navigation and game controls visible. A compact game bar holds controls and checkpoint status.

No enemies, attacks, damaging hazards, or disappearing platforms. Movement retains acceleration, friction, gravity, grounded-only jumps, and a fixed 120 Hz simulation driven by requestAnimationFrame. Moving surfaces carry the cursor horizontally and vertically. Read [visual references](docs/VISUAL_REFERENCES.md) for the public screenshot sources and research limitations.

## Development and validation

```sh
npm ci
npm test
npm run test:browser
```

The game needs no package installation to play. Development dependencies provide Playwright. Start `npm start` before browser tests. Tests use `/usr/bin/chromium` by default; set `CHROMIUM_PATH` for another installed Chrome/Chromium executable.

Physics tests verify acceleration/friction, grounded-only jumping, collision, checkpoint respawn/reset, moving-platform carry, and complete routes through all four webpages using only ordinary movement, jumps, and drops. The route planner is test-only and is never loaded by the game.

Browser tests send real keyboard events through the production requestAnimationFrame loop under a virtual clock. They complete all four pages without falls, check automatic transitions and victory/replay, compare every collision surface with its rendered DOM rectangle, and verify that the player's feet touch the visible element after each landing. They also exercise intentional falls and checkpoint recovery, pause/resume/restart, header navigation, and responsive layouts at 1366×768, 1024×768, and 768×650. JavaScript errors fail the run. Screenshots are generated in ignored `test-results/`.

Production files: `index.html`, `style.css`, `game.js`, `pages.js`, `levels.js`, and `physics.js`. Deploy them together to any static host. `server.js` is the local development server. No existing deployment configuration was present; none was replaced.

This is an unofficial fan-made game, not affiliated with Schoology or PowerSchool.
