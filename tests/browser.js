import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage({viewport:{width:1366,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install();await page.goto('http://127.0.0.1:3000');await mkdir('test-results',{recursive:true});await page.screenshot({path:'test-results/start.png'});await page.getByRole('button',{name:'Let’s play →'}).click();await page.clock.runFor(50);
const snapshot=()=>page.evaluate(()=>window.game.snapshot());
await page.keyboard.down('d');await page.clock.runFor(200);await page.keyboard.up('d');assert((await snapshot()).x>85);await page.keyboard.press('Space');await page.clock.runFor(100);assert.equal((await snapshot()).ground,null);await page.keyboard.press('Escape');const frozen=await snapshot();await page.clock.runFor(400);assert.equal((await snapshot()).x,frozen.x);assert.equal((await snapshot()).y,frozen.y);await page.getByRole('button',{name:'Resume →'}).click();await page.keyboard.press('r');await page.clock.runFor(20);assert.equal((await snapshot()).falls,0);
// Drive actual keyboard events through all four levels. The app's normal RAF loop runs on a virtual clock.
let held='';async function steer(dir){if(held===dir)return;if(held)await page.keyboard.up(held);held=dir;if(held)await page.keyboard.down(held);}
for(let level=0;level<4;level++){
 const platforms=await page.evaluate(i=>window.game.levels[i].platforms,level);let target=1,launched=false;let steps=0;
 while(target<platforms.length&&steps++<3200){const s=await snapshot();assert.equal(s.index,level);assert.equal(s.falls,0,`fell in level ${level}, target ${target}`);
 if(s.done)break;
 if(s.ground===target){target++;launched=false;continue;}
 const prior=platforms[target-1],next=platforms[target];if(!launched){await steer('d');if(s.x>=prior.x+prior.w-48){await page.keyboard.press('Space');launched=true;}}
 else{const aim=next.x+next.w/2-16;await steer(s.x<aim-8?'d':s.x>aim+8?'a':'');}
 await page.clock.runFor(16);
 }
 assert((await snapshot()).done,`level ${level} did not complete`);await steer('');console.log(`Browser completed ${platforms.length-1} jumps in level ${level+1}`);await page.clock.runFor(1450);assert.equal((await snapshot()).mode,level===3?'victory':'play');
}
await page.screenshot({path:'test-results/victory.png'});await page.getByRole('button',{name:'Play again →'}).click();assert.equal((await snapshot()).index,0);
// Checkpoint activation + fall recovery using real controls.
await page.keyboard.down('d');await page.clock.runFor(2300);await page.keyboard.up('d');assert((await snapshot()).falls>0);await page.keyboard.press('r');assert.equal((await snapshot()).falls,0);
for(const size of [{width:1366,height:768},{width:1024,height:768},{width:768,height:650}]){await page.setViewportSize(size);await page.clock.runFor(40);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`test-results/game-${size.width}.png`});}
assert.deepEqual(errors,[]);console.log('PASS: keyboard movement/jump, pause/resume/restart, all four auto-transitions, victory/replay, fall recovery, responsive layouts, no browser errors.');
}finally{await browser.close();}
