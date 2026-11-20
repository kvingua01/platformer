import {LEVELS,createState,tick,platformAt,STEP,leaveRoom} from './physics.js';
import {SCENE_WIDTH, SCENE_HEIGHT} from './levels.js';
import {renderPage, renderRoom, icon} from './pages.js';
const $=s=>document.querySelector(s), world=$('#world'),player=$('#player'),overlay=$('#overlay');
let state=createState(),mode='start',acc=0,last=0,scale=1,camera=0,transitionTimer=null;const keys=new Set();const jumpKeys=[' ','w','arrowup'];let renderedRoom='page';let jumpQueued=false;
const cursorStyle = $('#cursor-style');
const cursorPreference = 'platformer-classic-cursor';
let classicCursor = false;
let previousGround = 0;
function setClassicCursor(enabled) {
  classicCursor = enabled;
  player.classList.toggle('classic', enabled);
  cursorStyle.setAttribute('aria-pressed', String(enabled));
}
try { setClassicCursor(localStorage.getItem(cursorPreference) === 'true'); } catch {}
cursorStyle.addEventListener('click', event => {
  setClassicCursor(!classicCursor);
  try { localStorage.setItem(cursorPreference, String(classicCursor)); } catch {}
  if (mode === 'play' && event.detail > 0) $('#viewport').focus();
});
const colors=['#5c8daa','#718f78','#b39a71','#8293b6','#af8c99','#749da0','#9c91b5','#778b9c'];
function modal(kind){mode=kind;keys.clear();jumpQueued=false;overlay.classList.remove('hidden');const content={start:['<svg viewBox="0 0 40 40" width="30" height="30" style="vertical-align:middle" aria-hidden="true"><path d="M10 4v28l8-8 6 12 5-3-6-11h12z" fill="white" stroke="#327caa" stroke-width="2"/></svg>','WELCOME TO YOUR SCHOOL DAY','A new way to navigate.','Jump off each page edge to enter a separate parkour room. Reach the key vault at the far end of BOTH rooms. Collecting a key returns you to the page start. Falls also return you to the start, but you keep collected keys. Both keys unlock Next Page. Grades is a vertical climb with checkpoints.','Let’s play →'],pause:['Ⅱ','TAKE YOUR TIME','Class is on a break.','Your cursor is right where you left it. Ready for the next jump?','Resume →'],help:['⌨','THE SHORT COURSE','Make every jump count.',state.level.height?'A / D or ← / → to move. Space, W, or ↑ to jump. Hold to jump again when you land. Climb to Next Page. Land on a checkpoint panel to save your height. R restarts the climb. Esc pauses.':'A / D or ← / → to move. Space, W, or ↑ to jump. Hold to jump again when you land. R restarts the level; Esc pauses. Jump off each side to enter a parkour room. The key is at the far end of each room. Both keys unlock Next Page. Falls return you to the start; keys stay collected. R clears keys. No checkpoints.','Got it →'],complete:['✓','PAGE COMPLETED',`${state.level.name}, complete.`,'Nice work! Your next page is loading…',''],victory:['✦','SCHOOL DAY COMPLETE','You made the grade.','Four pages. A whole lot of jumps. You navigated the entire school day — one little cursor at a time.','Play again →']}[kind];overlay.innerHTML=`<div class="modal" role="dialog" aria-modal="true" aria-label="${content[2]}"><div class="modal-icon">${content[0]}</div><div class="eyebrow">${content[1]}</div><h2>${content[2]}</h2><p>${content[3]}</p>${content[4]?`<button class="primary" id="modal-action">${content[4]}</button>`:''}${kind==='pause'?'<button class="text-button" id="restart">Restart this level</button>':''}<div class="sub">${kind==='start'?'A / D to move &nbsp; · &nbsp; Space to jump &nbsp; · &nbsp; No login needed':kind==='victory'?'Thanks for taking the scenic route.':'R to restart · Esc to pause · Unofficial offline game'}</div></div>`;$('#modal-action')?.addEventListener('click',()=>{if(kind==='victory')load(0);play();});$('#restart')?.addEventListener('click',()=>{load(state.index);play();});$('#modal-action')?.focus();}
function play(){$('#nav-popover').hidden=true;mode='play';overlay.classList.add('hidden');$('#pause span').textContent='Pause';$('#viewport').focus();}
function load(index) {
  clearTimeout(transitionTimer);
  state = createState(index);
  previousGround = state.player.ground;
  camera = state.level.height ? state.level.height - SCENE_HEIGHT : 0;
  $('#particles').replaceChildren();
  world.innerHTML = renderPage(index);renderedRoom='page';
  $('#level-title').textContent = state.level.name;
  $('#difficulty').textContent = state.level.difficulty;
  world.querySelectorAll('[data-level]').forEach(button => button.onclick = () => {
    load(Number(button.dataset.level)); play();
  });
  world.querySelectorAll('[data-notice]').forEach(button => button.onclick = () => showPopover('Members', button.dataset.notice));
  render();
}
function updateCamera(delta) {
  if (!state.level.height) return;
  const target = Math.max(0, Math.min(state.level.height - SCENE_HEIGHT, state.player.y - SCENE_HEIGHT * .57));
  camera += (target - camera) * (1 - Math.exp(-10 * delta));
}
function burst(){for(let i=0;i<22;i++){const p=document.createElement('i');p.className='spark';p.style.cssText=`left:${state.player.x+12}px;top:${state.player.y}px;--dx:${Math.random()*160-80}px;--dy:${Math.random()*160-100}px;background:${colors[i%8]}`;$('#particles').append(p);setTimeout(()=>p.remove(),900);}}
function complete(){burst();modal('complete');transitionTimer=setTimeout(()=>{if(state.index===3)modal('victory');else{load(state.index+1);play();}},1350);}
function render() {
  const view=state.room||'page';
  if(view!==renderedRoom){
    world.innerHTML=state.room?renderRoom(state.index,state.room):renderPage(state.index);
    renderedRoom=view;
    world.querySelector('[data-leave-room]')?.addEventListener('click',()=>{leaveRoom(state);render();});
    world.querySelectorAll('[data-level]').forEach(button=>button.onclick=()=>{load(Number(button.dataset.level));play();});
    world.querySelectorAll('[data-notice]').forEach(button=>button.onclick=()=>showPopover('Members',button.dataset.notice));
  }
  $('#level-title').textContent=state.level.name;
  const tower = $('#grades-tower');
  if (tower) tower.style.transform = `translateY(${-camera}px)`;
  $('#particles').style.transform = tower ? `translateY(${-camera}px)` : '';
  const a = state.player;
  if (classicCursor && previousGround === null && a.ground !== null) {
    player.classList.remove('landed');
    void player.offsetWidth;
    player.classList.add('landed');
  }
  previousGround = a.ground;
  player.classList.toggle('walking', classicCursor && Math.abs(a.vx)>25 && a.ground!==null && mode==='play');
  player.classList.toggle('airborne', classicCursor && a.ground===null);
  state.level.platforms.forEach(p => {
    const el = $(`#platform-${p.id}`), position = platformAt(p, state.time);
    el.style.transform = `translate(${position.x-p.x}px,${position.y-p.y}px)`;

    if (p.goal) {
      const remaining = tower ? 0 : 2 - state.keys.size;
      el.textContent = remaining ? `Next Page · ${remaining} key${remaining===1?'':'s'}` : 'Next Page →';
      el.classList.toggle('locked', remaining > 0);
    }
    el.classList.toggle('landing', a.ground === p.id);
  });
  player.style.left = a.x+'px'; player.style.top = (a.y-camera)+'px';
  $('#key-stat').textContent = tower
    ? (state.checkpoint ? `${state.level.platforms[state.checkpoint].label} checkpoint` : 'Climb to Next Page')
    : `Keys ${state.keys.size}/2 · ${state.keys.has('left')?'✓':'←'} Left · ${state.keys.has('right')?'✓':'→'} Right`;
  document.querySelectorAll('[data-key]').forEach(el=>el.classList.toggle('collected',state.keys.has(el.dataset.key)));
  $('#fall-stat').textContent = `↻ ${state.falls} falls`;
  $('#hint').textContent = tower ? 'Climb the gradebook to Next Page. Land on a checkpoint panel to save your progress. R restarts.' : state.keys.size===2 ? 'Both keys collected! Reach Next Page. R restarts and clears your keys.' : state.room ? 'Reach the far-end key vault. Falling returns you to the page start — no checkpoints.' : 'Jump off each page edge to enter a parkour room. Complete BOTH rooms for the keys.';
}
function resize() {
  scale = Math.min(innerWidth / SCENE_WIDTH, Math.max(300, innerHeight - 124) / SCENE_HEIGHT);
  $('#scene').style.transform = `scale(${scale})`;
  $('#viewport').style.width = Math.round(SCENE_WIDTH * scale)+'px';
  $('#viewport').style.height = Math.round(SCENE_HEIGHT * scale)+'px';
}
window.addEventListener('resize', resize);
function frame(t){const delta=Math.min((t-last)/1000||0,.05);last=t;if(mode==='play'){acc+=delta;while(acc>=STEP){const before=state.keys.size;tick(state,{left:keys.has('a')||keys.has('arrowleft'),right:keys.has('d')||keys.has('arrowright'),jump:jumpQueued||jumpKeys.some(key=>keys.has(key))});jumpQueued=false;acc-=STEP;if(before!==state.keys.size)burst();if(state.done){complete();acc=0;break;}}}else acc=0;updateCamera(delta);render();requestAnimationFrame(frame);}
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k===' '&&e.target===cursorStyle)return;if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(e.repeat)return;if(k==='escape'){if(mode==='play')modal('pause');else if(mode==='pause'||mode==='help')play();return;}if(k==='r'&&['play','pause'].includes(mode)){load(state.index);play();return;}if(mode!=='play')return;keys.add(k);if(jumpKeys.includes(k))jumpQueued=true;});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{if(mode==='play')modal('pause');keys.clear();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')modal('pause');});$('#pause').onclick=()=>{if(mode==='play')modal('pause');else if(mode==='pause')play();};$('#help').onclick=()=>{if(mode!=='complete')modal('help');};document.querySelectorAll('header [data-level]').forEach(b=>b.onclick=()=>{load(Number(b.dataset.level));play();});
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
window.game={snapshot:()=>({mode,camera,checkpoint:state.checkpoint,room:state.room,index:state.index,x:state.player.x,y:state.player.y,ground:state.player.ground,falls:state.falls,done:state.done,time:state.time,acc,player:{...state.player},collectedKeys:[...state.keys]}),levels:LEVELS};
