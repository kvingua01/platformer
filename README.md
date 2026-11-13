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
- **R:** restart the page, clearing keys and falls
- **Esc:** pause / resume

Each page has **two keys**, one beyond its left boundary and one beyond its right boundary. Reach the **Personal resources** ledge at the lower left or the **Resources** ledge at the lower right, then jump outward beyond the edge. The golden key indicators point to the exits. Simply walking off an edge does not collect a key.

Collecting a key immediately returns the cursor to the beginning of the current page. Collect **both different keys**, then land on **Next Page** to advance. Keys survive falls, but **R**, switching pages, or starting a new level clears them. There are **no checkpoints**: every fall returns to the page's starting platform. You no longer need to visit every platform. Finish Calendar to win; the header's **Courses** menu and left navigation let you practice any page.

Page elements are one-way surfaces: jump through their undersides and stand on top. To reach a lower row, walk off an edge and steer back underneath. Narrow course cards, underlined assignment links, score boxes, moving submission controls, and calendar event chips form the route to the side exits and goal.


## Four different webpages

1. **Courses · Challenging:** six illustrated course cards in a normal two-row grid, course sidebar, reminders, upcoming assignments.
2. **Assignments · Hard:** material and folder listings, due-date chips, submission buttons, faster moving controls within their rows.
3. **Grades · Expert:** gradebook table, assignment links, points, percentage cells, semester summary, narrower surfaces.
4. **Calendar · Extreme:** November 2026 month grid, date numbers, events inside calendar cells, 48-pixel-wide event chips with six fast-moving targets.

All pages share the Schoology-style blue header with branding, Courses / Groups / Resources / Grades navigation, original SVG icons, a fictional student profile, and left and right sidebars. The interface fits Chromebook-sized windows with the top navigation and game controls visible. A compact game bar holds controls and left/right key status.

No enemies, attacks, damaging hazards, or disappearing platforms. Movement retains acceleration, friction, gravity, grounded-only jumps, and a fixed 120 Hz simulation driven by requestAnimationFrame. Moving surfaces carry the cursor horizontally and vertically. Read [visual references](docs/VISUAL_REFERENCES.md) for the public screenshot sources and research limitations.

## Development and validation

```sh
npm ci
npm test
npm run test:browser
```

The game needs no package installation to play. Development dependencies provide Playwright. Start `npm start` before browser tests. Tests use `/usr/bin/chromium` by default; set `CHROMIUM_PATH` for another installed Chrome/Chromium executable.

Physics tests verify acceleration/friction, grounded-only jumping, collision, start-only respawns, two-key goal locking, key persistence/reset, moving-platform carry, and complete routes through all four webpages using only ordinary movement, jumps, and drops. The route planner is test-only and is never loaded by the game.

Browser tests send real keyboard events through the production requestAnimationFrame loop under a virtual clock. They collect both off-map keys and finish all four pages, check automatic transitions and victory/replay, compare every collision surface with its rendered DOM rectangle, and verify that the player's feet touch the visible element after each landing. They also exercise intentional falls and key retention, pause/resume/restart, header navigation, and responsive layouts at 1366×768, 1024×768, and 768×650. JavaScript errors fail the run. Screenshots are generated in ignored `test-results/`.

Production files: `index.html`, `style.css`, `game.js`, `pages.js`, `levels.js`, and `physics.js`. Deploy them together to any static host. `server.js` is the local development server. No existing deployment configuration was present; none was replaced.

This is an unofficial fan-made game, not affiliated with Schoology or PowerSchool.
