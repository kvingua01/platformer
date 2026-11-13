# Schoology Platformer

A complete, self-contained browser platformer set inside an original Schoology-inspired student interface. No login, real student data, external assets, API, or runtime packages are required.

## Play

With Node.js 20 or newer:

```sh
npm start
```

Open `http://localhost:3000`. Set `PORT` to use a different port. Alternatively, serve this directory with any static HTTP server. JavaScript modules need HTTP rather than opening `index.html` directly.

- **A / D or Left / Right:** move
- **Space / W / Up:** jump (while grounded)
- **R:** restart the current level, clearing checkpoints and falls
- **Esc:** pause / resume

Land on flagged interface cards to activate checkpoints. Falling respawns you at your latest checkpoint. Reach **Next Page** to automatically advance; finish Calendar to win. The navigation tabs let you practice any level directly.

## Four levels

1. **Courses · Easy:** wide course cards, short gaps, three checkpoints.
2. **Assignments · Medium:** submission panels, moving platforms, two checkpoints.
3. **Grades · Hard:** narrower grade rows, moving platforms, one checkpoint.
4. **Calendar · Very hard:** small dates and events, larger gaps, moving platforms, one checkpoint.

No enemies, attacks, damaging hazards, or disappearing platforms. Movement uses acceleration, friction, gravity, and a fixed 120 Hz simulation driven by requestAnimationFrame. One-way landing collisions use the previous and current platform positions, including moving-platform carry. Every level has a tested route using the same movement physics as the game.

## Development and validation

```sh
npm ci
npm test
npm run test:browser
```

The game needs no dependency installation to play. Development dependencies provide Playwright. Browser tests use `/usr/bin/chromium` by default; set `CHROMIUM_PATH` to another installed Chrome/Chromium executable. Start `npm start` before running browser tests.

Physics tests verify grounded-only jumping, acceleration/friction, landing, checkpoint respawn/reset, moving-platform carry, and a complete zero-fall route through every platform in all four levels. Browser tests drive actual keyboard events through all four levels, verify auto-transitions, victory/replay, pause/resume/restart, fall recovery, check layouts at 1366, 1024, and 768 pixels, and reject browser JavaScript errors. Screenshots are generated in ignored `test-results/`.

The production files are `index.html`, `style.css`, `game.js`, and `physics.js`. `server.js` is a small local static server. Deploy the four production files together to any static host; no existing deployment configuration was present in the empty repository.

This is an unofficial fan-made game, not affiliated with Schoology or PowerSchool. All interface artwork and sample course information are created locally.
