import test from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,createState,tick,platformAt,HEIGHT,WIDTH} from '../physics.js';
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
  assert(LEVELS.filter(l=>!l.height).every(l=>l.platforms.every(p=>!p.checkpoint)));
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
for(const index of [0,1,3])test(`${LEVELS[index].name}: jump off both edges and finish using normal inputs`,()=>{
  let s=collectKey(createState(index),'left').state;assert.equal(s.player.ground,0);
  for(const target of ROUTES[index])s=planJump(s,target).state;
  assert(!s.done);s=collectKey(s,'right').state;
  assert.equal(s.keys.size,2);assert.equal(s.player.ground,0);
  for(const target of ROUTES[index])s=planJump(s,target).state;
  assert(s.done);assert.equal(s.falls,0);
});

test('entering a side room gives no key and falling there returns to page start',()=>{
  const s=createState(0);s.keys.add('right');
  Object.assign(s.player,{x:-30,y:300,ground:null,jumped:true});tick(s,{});
  assert.equal(s.room,'left');assert.equal(s.keys.size,1);assert(!s.keys.has('left'));
  assert.equal(s.level.platforms.length,6);
  s.player.y=800;tick(s,{});
  assert.equal(s.room,null);assert.equal(s.level,s.pageLevel);assert.equal(s.player.ground,0);
  assert.equal(s.falls,1);assert.deepEqual([...s.keys],['right']);
});

test('Grades: every platform is reachable with normal inputs and the goal needs no keys',()=>{
  let s=createState(2);
  const calendar=LEVELS[3].platforms.find(p=>p.moving);
  assert.equal(s.level.height,6300);
  for(const p of s.level.platforms.slice(1)){
    assert.equal(p.w,calendar.w);
    assert.equal(p.h,calendar.h);
    if(!p.goal){
      assert(p.moving);
      assert.equal(p.axis,calendar.axis);
      assert.equal(p.amplitude,calendar.amplitude);
      assert.equal(p.speed,calendar.speed);
    }
    s=planJump(s,p.id).state;
    assert.equal(s.player.ground,p.id);
    if(p.checkpoint)assert.equal(s.checkpoint,p.id);
  }
  assert(s.done);
  assert.equal(s.keys.size,0);
  assert.equal(s.falls,0);
});

test('Grades: walls, lower landings, and full falls preserve the highest checkpoint',()=>{
  let s=createState(2);
  for(const p of s.level.platforms.slice(1,6))s=planJump(s,p.id).state;
  const height=s.level.height;
  for(const [x,input,bound] of [[-2,{left:true},0],[s.level.length,{right:true},s.level.length-WIDTH]]){
    Object.assign(s.player,{x,y:100,ground:null,jumped:true});
    advance(s,input,8);
    assert.equal(s.player.x,bound);
    assert.equal(s.room,null);
    assert.equal(s.falls,0);
  }

  const low=s.level.platforms[0];
  Object.assign(s.player,{x:low.x+30,y:low.y-HEIGHT-10,vy:0,ground:null});
  advance(s,{},20);
  assert.equal(s.player.ground,0);
  assert.equal(s.checkpoint,5);
  assert.equal(s.falls,0);

  Object.assign(s.player,{x:0,y:height,vy:0,ground:null});
  advance(s,{},40);
  assert.equal(s.player.ground,5);
  assert.equal(s.falls,1);
  assert.equal(createState(2).checkpoint,0);
});
