import test from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,createState,tick,platformAt,HEIGHT,respawn} from '../physics.js';
import {ROUTES,planJump,collectKey} from './route.js';
function advance(s,input,n){for(let j=0;j<n;j++)tick(s,input);}
test('acceleration, friction, grounded-only jumping and landing',()=>{
  const s=createState();advance(s,{right:true},20);assert(s.player.vx>0);
  advance(s,{},30);assert(s.player.vx<20);tick(s,{jump:true});assert(s.player.vy<0);
  const velocity=s.player.vy;tick(s,{jump:true});assert(s.player.vy>velocity);
  advance(s,{},120);assert.equal(s.player.ground,0);assert.equal(s.player.y,s.level.platforms[0].y-HEIGHT);
});
test('all falls return to the beginning; keys persist until restart',()=>{
  const s=createState();s.keys.add('left');s.player.y=800;tick(s,{});
  assert.equal(s.falls,1);assert.equal(s.player.ground,0);assert(s.keys.has('left'));
  assert.equal(createState().keys.size,0);
  assert(LEVELS.every(l=>l.platforms.every(p=>!p.checkpoint)));
});
test('walking off an edge does not grant a jump key',()=>{
  const s=createState();Object.assign(s.player,{x:-30,y:300,ground:null,jumped:false});tick(s,{});
  assert.equal(s.keys.size,0);assert.equal(s.falls,1);assert.equal(s.player.ground,0);
});
test('moving interface chips carry the cursor',()=>{
  const s=createState(3);s.player.ground=2;
  const p=platformAt(s.level.platforms[2],s.time);s.player.x=p.x+12;s.player.y=p.y-HEIGHT;
  for(let j=0;j<360;j++){tick(s,{});const p=platformAt(s.level.platforms[2],s.time);assert.equal(s.player.ground,2);assert(Math.abs(s.player.y+HEIGHT-p.y)<.01);assert(Math.abs(s.player.x-p.x-12)<.01);}
});
test('Next Page requires both different keys',()=>{
  const s=createState(0),goal=s.level.platforms.find(p=>p.goal);
  function land(){Object.assign(s.player,{x:goal.x+10,y:goal.y-HEIGHT-1,vy:100,ground:null});advance(s,{},4);}
  land();assert(!s.done);s.keys.add('left');land();assert(!s.done);
  s.keys.add('left');land();assert(!s.done);s.keys.add('right');land();assert(s.done);
});
for(let index=0;index<4;index++)test(`${LEVELS[index].name}: jump off both edges and finish using normal inputs`,()=>{
  let s=collectKey(createState(index),'left').state;assert.equal(s.player.ground,0);
  for(const target of ROUTES[index])s=planJump(s,target).state;
  assert(!s.done);s=collectKey(s,'right').state;
  assert.equal(s.keys.size,2);assert.equal(s.player.ground,0);
  for(const target of ROUTES[index])s=planJump(s,target).state;
  assert(s.done);assert.equal(s.falls,0);
});
