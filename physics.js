import { LEVELS, ROOMS, SCENE_HEIGHT } from './levels.js';
export { LEVELS };
export const WIDTH = 24, HEIGHT = 32, STEP = 1 / 120;

export function platformAt(p, time) {
  const offset = p.moving ? Math.sin(time * (p.speed || 1.5) + p.phase) * p.amplitude : 0;
  return { ...p, x: p.x + (p.axis === 'x' ? offset : 0), y: p.y + (p.axis === 'x' ? 0 : offset) };
}
export function createState(index = 0) {
  const level = LEVELS[index], first = platformAt(level.platforms[0], 0);
  return {
    index, level, pageLevel: level, room: null, time: 0,
    player: { x: first.x + 30, y: first.y - HEIGHT, vx: 0, vy: 0, ground: 0 },
    keys: new Set(), falls: 0, done: false, checkpoint: 0,
  };
}
export function enterRoom(s,side) {
  s.room=side;s.level=ROOMS[s.index][side];spawn(s);
}
export function leaveRoom(s) {
  s.room=null;s.level=s.pageLevel;spawn(s);
}
function spawn(s, id = 0) {
  const p=platformAt(s.level.platforms[id],s.time);
  Object.assign(s.player,{x:p.x+p.w/2-WIDTH/2,y:p.y-HEIGHT,vx:0,vy:0,ground:id,jumped:false});
}
export function respawn(s) {
  if (s.level.height) spawn(s, s.checkpoint);
  else leaveRoom(s);
}
export function tick(s, input, dt = STEP) {
  if (s.done) return;
  const a = s.player, oldTime = s.time;
  s.time += dt;
  if (a.ground !== null) {
    const base = s.level.platforms[a.ground];
    const now = platformAt(base, s.time), old = platformAt(base, oldTime);
    a.x += now.x - old.x;
    a.y += now.y - old.y;
  }
  const direction = Number(!!input.right) - Number(!!input.left);
  a.vx = direction ? Math.max(-280, Math.min(280, a.vx + direction * 1900 * dt)) : a.vx * Math.exp(-12 * dt);
  if (input.jump && a.ground !== null) { a.vy = -590; a.ground = null; a.jumped = true; }
  const previousY = a.y;
  a.vy += 1450 * dt;
  a.x += a.vx * dt;
  if (s.level.height) {
    const boundedX = Math.max(0, Math.min(s.level.length - WIDTH, a.x));
    if (boundedX !== a.x) a.vx = 0;
    a.x = boundedX;
  }
  a.y += a.vy * dt;
  a.ground = null;
  for (const base of s.level.platforms) {
    const p = platformAt(base, s.time), old = platformAt(base, oldTime);
    if (a.x + WIDTH > p.x && a.x < p.x + p.w && previousY + HEIGHT <= old.y + 1.5 && a.y + HEIGHT >= p.y && a.vy >= 0) {
      a.y = p.y - HEIGHT; a.vy = 0; a.ground = p.id; a.jumped = false;
      if (p.roomKey && s.room) {
        s.keys.add(s.room);leaveRoom(s);return;
      }
      if (p.checkpoint && p.id > s.checkpoint) s.checkpoint = p.id;
      if (p.goal && (s.level.height || s.keys.size === 2)) s.done = true;
      break;
    }
  }
  const side = a.x + WIDTH < 0 ? 'left' : a.x > s.level.length ? 'right' : null;
  if (side) {
    if (!s.room && a.jumped) enterRoom(s,side);
    else {s.falls++;respawn(s);}
  }
  if (a.y > (s.level.height ?? SCENE_HEIGHT) + 36) { s.falls++; respawn(s); }
}
