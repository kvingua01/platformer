import {LEVELS,createState,tick,platformAt,STEP} from './physics.js';
import {SCENE_WIDTH, SCENE_HEIGHT} from './levels.js';
import {renderPage, icon} from './pages.js';
const $=s=>document.querySelector(s), world=$('#world'),player=$('#player'),overlay=$('#overlay');
let state=createState(),mode='start',acc=0,last=0,scale=1,camera=0,transitionTimer=null;const keys=new Set();let jumpQueued=false;let previousGround=0;
const colors=['#5c8daa','#718f78','#b39a71','#8293b6','#af8c99','#749da0','#9c91b5','#778b9c'];
function modal(kind){mode=kind;keys.clear();jumpQueued=false;overlay.classList.remove('hidden');const content={start:['<svg viewBox="0 0 40 40" width="30" height="30" style="vertical-align:middle" aria-hidden="true"><path d="M10 4v28l8-8 6 12 5-3-6-11h12z" fill="white" stroke="#327caa" stroke-width="2"/></svg>','WELCOME TO YOUR SCHOOL DAY','A new way to navigate.','Precision mode: land on every marked page element to unlock Next Page. Smaller surfaces, wider gaps, faster moving targets. Flags save your place, and visited elements stay saved after falls.','Let’s play →'],pause:['Ⅱ','TAKE YOUR TIME','Class is on a break.','Your cursor is right where you left it. Ready for the next jump?','Resume →'],help:['⌨','THE SHORT COURSE','Make every jump count.','A / D or ← / → to move. Space, W, or ↑ to jump while grounded. R restarts the level; Esc pauses. Land on flagged cards to save your place. Falling brings you back.','Got it →'],complete:['✓','PAGE COMPLETED',`${state.level.name}, complete.`,'Nice work! Your next page is loading…',''],victory:['✦','SCHOOL DAY COMPLETE','You made the grade.','Four pages. A whole lot of jumps. You navigated the entire school day — one little cursor at a time.','Play again →']}[kind];overlay.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-label="${content[2]}"><div class="modal-icon">${content[0]}</div><div class="eyebrow">${content[1]}</div><h2>${content[2]}</h2><p>${content[3]}</p>${content[4]?`<button class="primary" id="modal-action">${content[4]}</button>`:''}${kind==='pause'?'<button class="text-button" id="restart">Restart this level</button>':''}<div class="sub">${kind==='start'?'A / D to move &nbsp; · &nbsp; Space to jump &nbsp; · &nbsp; No login needed':kind==='victory'?'Thanks for taking the scenic route.':'R to restart · Esc to pause · Unofficial offline game'}</div></div>`;$('#modal-action')?.addEventListener('click',()=>{if(kind==='victory')load(0);play();});$('#restart')?.addEventListener('click',()=>{load(state.index);play();});$('#modal-action')?.focus();}
function play(){$('#nav-popover').hidden=true;mode='play';overlay.classList.add('hidden');$('#pause span').textContent='Pause';$('#viewport').focus();}
function load(index) {
  clearTimeout(transitionTimer);
  state = createState(index);
  previousGround = state.player.ground;
  world.innerHTML = renderPage(index);
  $('#level-title').textContent = state.level.name;
  $('#difficulty').textContent = state.level.difficulty;
  world.querySelectorAll('[data-level]').forEach(button => button.onclick = () => {
    load(Number(button.dataset.level)); play();
  });
  world.querySelectorAll('[data-notice]').forEach(button => button.onclick = () => showPopover('Members', button.dataset.notice));
  render();
}
function burst(){for(let i=0;i<22;i++){const p=document.createElement('i');p.className='spark';p.style.cssText=`left:${state.player.x-camera+12}px;top:${state.player.y}px;--dx:${Math.random()*160-80}px;--dy:${Math.random()*160-100}px;background:${colors[i%8]}`;$('#particles').append(p);setTimeout(()=>p.remove(),900);}}
function complete(){burst();modal('complete');transitionTimer=setTimeout(()=>{if(state.index===3)modal('victory');else{load(state.index+1);play();}},1350);}
function render() {
  const a = state.player;
  if (previousGround === null && a.ground !== null) {
    player.classList.remove('landed'); void player.offsetWidth; player.classList.add('landed');
  }
  previousGround = a.ground;
  state.level.platforms.forEach(p => {
    const el = $(`#platform-${p.id}`), position = platformAt(p, state.time);
    el.style.transform = `translate(${position.x-p.x}px,${position.y-p.y}px)`;
    el.classList.toggle('activated', state.activated.has(p.id));
    el.classList.toggle('visited', state.visited.has(p.id));
    if (p.goal) {
      const remaining = state.level.platforms.length - 1 - state.visited.size;
      el.textContent = remaining ? `Next Page · ${remaining} left` : 'Next Page →';
      el.classList.toggle('locked', remaining > 0);
    }
    el.classList.toggle('landing', a.ground === p.id);
  });
  player.style.left = a.x+'px'; player.style.top = a.y+'px';
  player.classList.toggle('walking', Math.abs(a.vx)>25 && a.ground!==null && mode==='play');
  player.classList.toggle('airborne', a.ground===null);
  $('#checkpoint-stat').textContent = `✓ ${state.visited.size}/${state.level.platforms.length-1} · ⚑ ${state.activated.size}/${state.level.platforms.filter(p=>p.checkpoint).length}`;
  $('#fall-stat').textContent = `↻ ${state.falls} falls`;
  $('#hint').textContent = state.falls ? 'Back at your checkpoint. R restarts the page; Esc pauses.' : state.activated.size ? 'Checkpoint saved. Visit every marked element to unlock Next Page.' : 'Land on EVERY marked page element to unlock Next Page. R restarts · Esc pauses.';
}
function resize() {
  scale = Math.min(innerWidth / SCENE_WIDTH, Math.max(300, innerHeight - 124) / SCENE_HEIGHT);
  $('#scene').style.transform = `scale(${scale})`;
  $('#viewport').style.width = Math.round(SCENE_WIDTH * scale)+'px';
  $('#viewport').style.height = Math.round(SCENE_HEIGHT * scale)+'px';
}
window.addEventListener('resize', resize);
function frame(t){const delta=Math.min((t-last)/1000||0,.05);last=t;if(mode==='play'){acc+=delta;while(acc>=STEP){const before=state.activated.size;tick(state,{left:keys.has('a')||keys.has('arrowleft'),right:keys.has('d')||keys.has('arrowright'),jump:jumpQueued});jumpQueued=false;acc-=STEP;if(before!==state.activated.size)burst();if(state.done){complete();acc=0;break;}}}else acc=0;render();requestAnimationFrame(frame);}
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(e.repeat)return;if(k==='escape'){if(mode==='play')modal('pause');else if(mode==='pause'||mode==='help')play();return;}if(k==='r'&&['play','pause'].includes(mode)){load(state.index);play();return;}if(mode!=='play')return;keys.add(k);if([' ','w','arrowup'].includes(k))jumpQueued=true;});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{if(mode==='play')modal('pause');keys.clear();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')modal('pause');});$('#pause').onclick=()=>{if(mode==='play')modal('pause');else if(mode==='pause')play();};$('#help').onclick=()=>{if(mode!=='complete')modal('help');};document.querySelectorAll('header [data-level]').forEach(b=>b.onclick=()=>{load(Number(b.dataset.level));play();});
function showPopover(title, message) {
  if (mode === 'play') modal('pause');
  const menu = $('#nav-popover');
  menu.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
  menu.hidden = false;
}
$('#header-tools').innerHTML = ['search','grid','calendar','mail','bell'].map((name,i)=>`<button aria-label="${name}" ${name==='calendar'?'data-calendar':''}>${icon(name)}${i>2?`<span class="notification-count">${i===3?'2':'1'}</span>`:''}</button>`).join('');
$('#header-tools').querySelectorAll('button').forEach(button => button.onclick = () => {
  if (button.hasAttribute('data-calendar')) { load(3); play(); }
  else showPopover(button.getAttribute('aria-label'), 'This is an offline game with fictional school information. No messages, notifications, or student records are connected.');
});
$('#courses-nav').onclick = () => {
  if (mode === 'play') modal('pause');
  const menu = $('#nav-popover');
  menu.innerHTML = '<h3>My Courses · Game pages</h3>' + LEVELS.map((l,i)=>`<button data-page="${i}">${l.name} <small> · ${l.difficulty}</small></button>`).join('');
  menu.hidden = !menu.hidden;
  menu.querySelectorAll('[data-page]').forEach(button=>button.onclick=()=>{load(Number(button.dataset.page));play();menu.hidden=true;});
};
$('#groups-nav').onclick = () => showPopover('Groups', 'Northwood Student Council · Fictional group');
$('#resources-nav').onclick = () => showPopover('Resources', 'Personal resources · School resources · No external accounts are connected.');
$('#user-menu').onclick = () => showPopover('Jamie Davis', 'Student · Northwood High School · Fictional profile');
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) $('#nav-popover').hidden = true; });
load(0); resize(); modal('start'); requestAnimationFrame(frame);
// Read-only diagnostics keep browser tests on the same simulation as gameplay.
window.game={snapshot:()=>({mode,index:state.index,x:state.player.x,y:state.player.y,ground:state.player.ground,falls:state.falls,checkpoints:state.activated.size,done:state.done,time:state.time,acc,player:{...state.player},checkpoint:state.checkpoint,activated:[...state.activated],visited:[...state.visited]}),levels:LEVELS};
