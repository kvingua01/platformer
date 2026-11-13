import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS,createState,tick,platformAt,HEIGHT,respawn } from '../physics.js';
import { ROUTES,planJump } from './route.js';
function advance(s,input,n){for(let j=0;j<n;j++)tick(s,input);}
test('acceleration, friction, grounded-only jumping and landing',()=>{
  const s=createState();advance(s,{right:true},20);assert(s.player.vx>0);
  advance(s,{},30);assert(s.player.vx<20);tick(s,{jump:true});assert(s.player.vy<0);
  const velocity=s.player.vy;tick(s,{jump:true});assert(s.player.vy>velocity);
  advance(s,{},120);assert.equal(s.player.ground,0);assert.equal(s.player.y,s.level.platforms[0].y-HEIGHT);
});
test('falling respawns at latest checkpoint; restart clears it',()=>{
  const s=createState(),p=s.level.platforms[1];
  Object.assign(s.player,{x:p.x+20,y:p.y-HEIGHT-2,vy:100,ground:null});advance(s,{},8);
  assert(s.activated.has(1));s.player.y=800;tick(s,{});
  assert.equal(s.falls,1);assert.equal(s.checkpoint,1);assert.equal(s.player.ground,1);
  assert.equal(createState().activated.size,0);
});
test('moving interface chips carry the cursor in both axes',()=>{
  const s=createState(3);s.checkpoint=2;respawn(s);
  const offset=s.player.x-platformAt(s.level.platforms[2],s.time).x;
  for(let j=0;j<360;j++){
    tick(s,{});const p=platformAt(s.level.platforms[2],s.time);
    assert.equal(s.player.ground,2);assert(Math.abs(s.player.y+HEIGHT-p.y)<.01);
    assert(Math.abs(s.player.x-p.x-offset)<.01);
  }
});
for(let index=0;index<4;index++)test(`${LEVELS[index].name}: complete a normal-input route through the webpage`,()=>{
  let s=createState(index);
  for(const target of ROUTES[index])s=planJump(s,target).state;
  assert(s.done);assert.equal(s.falls,0);
  assert.equal(s.activated.size,s.level.platforms.filter(p=>p.checkpoint).length);
});
