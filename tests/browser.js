import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { createState,tick,STEP,HEIGHT,platformAt } from '../physics.js';
import { ROUTES,planJump,collectKey } from './route.js';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try {
  const page=await browser.newPage({viewport:{width:1366,height:768}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install({time:new Date('2026-01-01T00:00:00Z')});
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
  await page.goto('http://127.0.0.1:3000');
  await mkdir('test-results',{recursive:true});
  await page.screenshot({path:'test-results/start.png'});
  await page.getByRole('button',{name:'Let’s play →'}).click();
  await page.clock.runFor(32);
  const snapshot=()=>page.evaluate(()=>window.game.snapshot());
  await page.keyboard.down('d');await page.clock.runFor(160);await page.keyboard.up('d');
  assert((await snapshot()).x>272);
  await page.keyboard.press('Space');await page.clock.runFor(100);assert.equal((await snapshot()).ground,null);
  await page.keyboard.press('Escape');const paused=await snapshot();await page.clock.runFor(300);
  assert.deepEqual((await snapshot()).player,paused.player);
  await page.getByRole('button',{name:'Resume →'}).click();await page.keyboard.press('r');await page.clock.runFor(32);
  await page.keyboard.down('ArrowUp');
  let takeoffs=0,previousVy=0;
  for(let frame=0;frame<180&&takeoffs<2;frame++){
    await page.clock.runFor(8);
    const {vy}=(await snapshot()).player;
    if(previousVy>=0&&vy<0)takeoffs++;
    previousVy=vy;
  }
  await page.keyboard.up('ArrowUp');
  assert.equal(takeoffs,2,'holding Up jumps again after landing');
  await page.clock.runFor(1600);
  assert.equal((await snapshot()).ground,0,'releasing Up lets the player stay grounded');
  await page.keyboard.press('r');await page.clock.runFor(32);
  let held=new Set();
  async function input(keys) {
    const next=new Set([keys.left?'a':'',keys.right?'d':''].filter(Boolean));
    for(const key of held)if(!next.has(key))await page.keyboard.up(key);
    for(const key of next)if(!held.has(key))await page.keyboard.down(key);
    held=next;
    if(keys.jump)await page.keyboard.press('Space');
  }
  function simulateFrame(s,keys) {
    s.acc+=.016;let jump=keys.jump;
    while(s.acc>=STEP){tick(s,{...keys,jump});jump=false;s.acc-=STEP;}
  }
  for(let level=0;level<4;level++) {
    await page.screenshot({path:`test-results/page-${level+1}.png`});
    const initial=await snapshot();assert.equal(initial.index,level);
    // Each collision rectangle must be the actual visible HTML element, not a hidden platform.
    const rectangles=await page.evaluate(()=>{
      const scene=document.querySelector('#scene').getBoundingClientRect();const scale=scene.width/1280;
      return [...document.querySelectorAll('[data-surface]')].map(el=>{const r=el.getBoundingClientRect();return {id:Number(el.dataset.surface),x:(r.x-scene.x)/scale,y:(r.y-scene.y)/scale,w:r.width/scale,h:r.height/scale,text:el.textContent.trim()};});
    });
    const model=createState(level);
    for(const rect of rectangles){const p=platformAt(model.level.platforms[rect.id],initial.time);assert(rect.text.length>0);for(const k of ['x','y','w','h'])assert(Math.abs(rect[k]-p[k])<.1,`DOM collision mismatch ${level}:${rect.id}:${k}`);}
    assert.equal(await page.locator('.checkpoint-badge').count(),0);
    async function currentModel(){
      const actual=await snapshot(),s=createState(level);
      Object.assign(s,{time:actual.time,acc:actual.acc,falls:actual.falls,keys:new Set(actual.collectedKeys),player:{...actual.player}});
      return s;
    }
    async function run(plan){
      let frame=0;
      for(const action of plan.actions){
        await input(action);await page.clock.runFor(16);frame++;
        if(frame===plan.roomEntrance){
          const entered=await snapshot();assert.equal(entered.room,plan.roomSide);assert(!entered.collectedKeys.includes(plan.roomSide));
          await page.screenshot({path:`test-results/room-${level+1}-${plan.roomSide}.png`});
        }
      }
    }
    await run(collectKey(await currentModel(),'left',simulateFrame));
    assert.deepEqual((await snapshot()).collectedKeys,['left']);assert.equal((await snapshot()).ground,0);
    if(level===0){
      await input({left:true});
      for(let f=0;f<300&&(await snapshot()).falls===0;f++)await page.clock.runFor(16);
      await input({});assert.equal((await snapshot()).ground,0);assert.deepEqual((await snapshot()).collectedKeys,['left']);
    }
    for(let pass=0;pass<2;pass++){
      for(const target of ROUTES[level]) {
        const before=await snapshot();
        await run(planJump(await currentModel(),target,simulateFrame));
        const landed=await snapshot();
        assert.equal(landed.ground,target,`browser landing ${level}:${target}`);
        assert.equal(landed.falls,before.falls);
        const p=await page.evaluate(id=>{const player=document.querySelector('#player').getBoundingClientRect();const surface=document.querySelector(`#platform-${id}`).getBoundingClientRect();return {foot:player.bottom,top:surface.top,left:player.left,right:player.right,sleft:surface.left,sright:surface.right};},target);
        assert(Math.abs(p.foot-p.top)<.2,'cursor stands on the visible element');
        assert(p.right>p.sleft&&p.left<p.sright);
      }
      if(pass===0){
        assert.equal((await snapshot()).done,false);
        await run(collectKey(await currentModel(),'right',simulateFrame));
        assert.equal((await snapshot()).collectedKeys.length,2);assert.equal((await snapshot()).ground,0);
      }
    }
    await input({});assert((await snapshot()).done);console.log(`Browser: ${model.level.name} completed after both parkour rooms.`);
    await page.clock.runFor(1400);assert.equal((await snapshot()).mode,level===3?'victory':'play');
    if(level<3)assert.deepEqual((await snapshot()).collectedKeys,[]);
  }
  await page.screenshot({path:'test-results/victory.png'});
  await page.getByRole('button',{name:'Play again →'}).click();assert.equal((await snapshot()).index,0);
  const fresh=await snapshot(),recovery=createState(0);
  Object.assign(recovery,{time:fresh.time,acc:fresh.acc,player:{...fresh.player}});
  const keyPlan=collectKey(recovery,'left',simulateFrame);
  for(const action of keyPlan.actions){await input(action);await page.clock.runFor(16);}
  await input({});assert.deepEqual((await snapshot()).collectedKeys,['left']);
  await page.keyboard.press('r');assert.equal((await snapshot()).falls,0);assert.deepEqual((await snapshot()).collectedKeys,[]);
  await page.locator('#courses-nav').click();await page.locator('[data-page="3"]').click();assert.equal((await snapshot()).index,3);
  for(const size of [{width:1366,height:768},{width:1024,height:768},{width:768,height:650}]){
    await page.setViewportSize(size);await page.waitForTimeout(100);await page.clock.runFor(32);
    const fits=await page.evaluate(()=>({width:document.documentElement.scrollWidth<=innerWidth,header:document.querySelector('header').getBoundingClientRect().top===0,bottom:document.querySelector('.game-bar').getBoundingClientRect().bottom<=innerHeight}));
    assert.deepEqual(fits,{width:true,header:true,bottom:true});
    await page.screenshot({path:`test-results/calendar-${size.width}.png`});
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: real keyboard movement/jumps, DOM-to-physics alignment, all eight side rooms, far-end keys, start-only respawns, all four auto-transitions, victory/replay, pause/restart, falls, navigation, responsive layouts, no JS errors.');
} finally { await browser.close(); }
