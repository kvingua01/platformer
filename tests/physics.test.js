import test from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,createState,tick,platformAt,STEP,HEIGHT,respawn} from '../physics.js';
function advance(s,input,n){for(let j=0;j<n;j++)tick(s,input);}
test('acceleration, friction, grounded-only jumping and landing',()=>{const s=createState();advance(s,{right:true},20);assert(s.player.vx>0);advance(s,{},30);assert(s.player.vx<20);tick(s,{jump:true});assert(s.player.vy<0);const v=s.player.vy;tick(s,{jump:true});assert(s.player.vy>v);advance(s,{},120);assert.equal(s.player.ground,0);assert.equal(s.player.y,455-HEIGHT);});
test('falling respawns and checkpoint stays active until restart',()=>{const s=createState();const p=s.level.platforms[2];Object.assign(s.player,{x:p.x+20,y:p.y-HEIGHT-2,vy:100,ground:null});advance(s,{},8);assert(s.activated.has(2));s.player.y=700;tick(s,{});assert.equal(s.falls,1);assert.equal(s.checkpoint,2);assert.equal(s.player.ground,2);assert.equal(createState().activated.size,0);});
test('moving platforms carry a standing player without drift',()=>{const s=createState(3);s.checkpoint=2;respawn(s);for(let j=0;j<360;j++){tick(s,{});assert.equal(s.player.ground,2);assert(Math.abs(s.player.y+HEIGHT-platformAt(s.level.platforms[2],s.time).y)<.01);}});
// Find a route using only normal directional movement and one grounded jump.
// Every candidate is simulated by the production physics; no teleport between jumps.
for(let index=0;index<4;index++)test(`${LEVELS[index].name}: normal-input route reaches every platform and the goal`,()=>{let s=createState(index);for(let target=1;target<s.level.platforms.length;target++){
 let winner=null;for(const wait of [0,30,60,100,150,210]){if(winner)break;for(let takeoff=15;takeoff<=s.level.platforms[target-1].w-5;takeoff+=8){
 const c={...s,player:{...s.player},activated:new Set(s.activated)};advance(c,{},wait);const prior=c.level.platforms[target-1];let safety=0;
 // Walk to takeoff from the current landing position, then jump right.
 const destination=prior.x+takeoff;while(c.player.x<destination&&c.player.ground===target-1&&safety++<180)tick(c,{right:true});if(c.player.ground!==target-1)continue;
 tick(c,{right:true,jump:true});for(let j=0;j<140;j++){const p=c.level.platforms[target];const center=p.x+p.w/2-16;tick(c,{right:c.player.x<center-5,left:c.player.x>center+5});if(c.player.ground===target){winner=c;break;}if(c.falls>s.falls||c.player.ground!==null)break;}if(winner)break;
 }}assert(winner,`no normal jump found to ${target}`);s=winner;
 }assert(s.done);assert.equal(s.falls,0);assert.equal(s.activated.size,s.level.platforms.filter(p=>p.checkpoint).length);});
