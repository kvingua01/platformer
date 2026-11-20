import { LEVELS, ROOMS } from './levels.js';

const iconPaths = {
  key: '<circle cx="7" cy="8" r="5"/><path d="m11 12 10 10m-3-3 3-3m-6 0 3-3"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 2v6m8-6v6M7 14h2m3 0h2m3 0h1M7 18h2m3 0h2"/>',
  mail: '<rect x="2" y="5" width="20" height="15"/><path d="m2 5 10 8L22 5M2 20l7-8m13 8-7-8"/>',
  bell: '<path d="M5 16h14l-2-4V8a5 5 0 0 0-10 0v4l-2 4Zm5 4h4"/>',
  grid: '<path d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm12 0h6v6h-6z"/>',
  document: '<path d="M6 2h9l4 4v16H6zM14 2v5h5M9 11h7M9 15h7M9 18h5"/>',
  folder: '<path d="M2 6h8l2 3h10l-3 12H2zM2 6V3h8l2 3h8v3"/>',
  chart: '<path d="M3 21h18M5 20V12h3v8m3 0V5h3v15m3 0V9h3v11"/>',
  home: '<path d="m2 10 10-8 10 8M5 8v13h5v-7h4v7h5V8"/>',
  people: '<circle cx="8" cy="7" r="3"/><circle cx="18" cy="8" r="2"/><path d="M2 21v-5a6 6 0 0 1 12 0v5m2-8a4 4 0 0 1 6 3v5"/>',
};
export function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${iconPaths[name] || iconPaths.document}</svg>`;
}
const courses = ['English Literature', 'Algebra II', 'World History', 'Biology', 'Studio Art', 'Computer Science'];
const teachers = ['Ms. Taylor', 'Mr. Chen', 'Mr. Martinez', 'Dr. Williams', 'Ms. Robinson', 'Mr. Patel'];
const titles = ['Reading response: Chapter 6', 'Linear equations practice', 'Primary source analysis', 'Cell structure lab report', 'Perspective drawing', 'Project reflection', 'Weekly learning journal'];
const colors = ['#487494', '#567963', '#947751', '#4f8185', '#9b6474', '#586a8b'];

// Original local SVG illustrations, not remote images or student content.
function thumbnail(i) {
  const art = [
    '<path d="M52 35q45-14 81 8v72q-40-17-81-4zm81 8q40-22 81-8v76q-42-7-81 4" fill="#fff6dc" stroke="#d4c9af" stroke-width="2"/><path d="M67 51h48m-48 12h48m-48 12h48m-48 12h40m73-35h39m-39 12h39m-39 12h39m-39 12h31" stroke="#bcaf92" stroke-width="2"/>',
    '<g stroke="#c2d6ca" fill="none" stroke-width="2"><path d="M15 125h235M45 140V12M30 115l40-35 40 12 40-56 72-15"/><circle cx="70" cy="80" r="4"/><circle cx="150" cy="36" r="4"/></g><text x="145" y="113" fill="#e9f0df" font-size="28" font-family="Georgia">y = mx + b</text>',
    '<path d="M31 118h207v11H31zm12-60h183v9H43zm7-12 86-29 86 29z" fill="#e2d5b8"/><path d="M58 65v53m36-53v53m40-53v53m40-53v53m36-53v53" stroke="#d3c39e" stroke-width="12"/>',
    '<g fill="none" stroke="#d0e8de" stroke-width="4"><path d="M99 20c0 53 70 58 70 111M169 20c0 53-70 58-70 111"/><path d="m102 33 64 1m-55 14 45 1m-32 15 19 1m-28 28 40 1m-51 14 63 1"/></g><circle cx="40" cy="44" r="15" fill="#ffffff19"/><circle cx="220" cy="105" r="28" fill="#ffffff13"/>',
    '<path d="M30 125 88 23l58 102z" fill="#e1b4a1"/><circle cx="180" cy="65" r="43" fill="#e9cf95"/><rect x="118" y="83" width="98" height="45" fill="#aabbb1" opacity=".9"/><path d="m55 137 173-109" stroke="#faeee4" stroke-width="3"/>',
    '<rect x="46" y="23" width="177" height="102" rx="5" fill="#26394f" stroke="#a8b8cf" stroke-width="3"/><path d="m83 58-18 17 18 17m98-34 18 17-18 17m-36-43-18 50" fill="none" stroke="#a9cfcd" stroke-width="4"/><path d="M30 131h210l-10 8H41z" fill="#b6c5d7"/>',
  ];
  return `<svg viewBox="0 0 270 150" preserveAspectRatio="xMidYMid slice"><rect width="270" height="150" fill="${colors[i]}"/>${art[i]}</svg>`;
}
function surface(index, id, contents, className = '') {
  const p = LEVELS[index].platforms[id];
  return `<div id="platform-${id}" class="surface ${className}${p.moving ? ' moving' : ''}" data-surface="${id}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px">${contents}</div>`;
}
function leftSidebar(index) {
  return `<aside class="left-sidebar">
    <div class="school-crest"><svg viewBox="0 0 80 85"><path d="M7 5h66v42c0 20-33 34-33 34S7 67 7 47z" fill="#315572"/><path d="M13 11h54v34c0 15-27 29-27 29S13 60 13 45z" fill="none" stroke="#aebdca"/><text x="40" y="50" text-anchor="middle" font-size="36" fill="white" font-family="Georgia">N</text></svg></div>
    <h2>${index === 0 ? 'Northwood High School' : index === 3 ? 'Jamie Davis' : 'English Literature: Period 1'}</h2>
    <p class="school-name">${index === 0 ? '2026–2027 school year' : 'Northwood High School'}</p>
    <div class="sidebar-rule"></div>
    ${[['home','Home',0],['folder',index===0?'Courses':'Materials',index===0?0:1],['document','Assignments',1],['chart','Grades',2],['calendar','Calendar',3],['people','Members',null]].map(([i,text,l])=>`<button class="sidebar-link ${l===index&&text!=='Home'&&!(index===1&&text==='Materials')?'selected':''}" ${l===null?'data-notice="Members are fictional in this game."':`data-level="${l}"`}>${icon(i)}${text}</button>`).join('')}
    <div class="sidebar-rule"></div><h3>COURSES</h3>${courses.slice(0,4).map((c,i)=>`<div class="sidebar-course"><span style="background:${colors[i]}"></span>${c}</div>`).join('')}
    <div class="sidebar-rule"></div>

  </aside>`;
}
function rightSidebar(index) {
  return `<aside class="right-sidebar"><section><h3>Reminders</h3><div class="reminder"><span class="reminder-count">2</span><div><a>Unsubmitted assignments</a><small>Check your upcoming work</small></div></div><div class="reminder"><span class="reminder-count">1</span><div><a>New course update</a><small>English Literature</small></div></div></section>
    <section class="upcoming"><h3>Upcoming <button data-level="3">Calendar</button></h3>
    <h4>FRIDAY, NOVEMBER 13</h4><div class="upcoming-item">${icon('document')}<div><a>Reading response: Chapter 6</a><small>English Literature: Period 1</small><small>11:59 pm</small></div></div>
    <div class="upcoming-item">${icon('document')}<div><a>Linear equations practice</a><small>Algebra II: Period 2</small><small>11:59 pm</small></div></div>
    <h4>MONDAY, NOVEMBER 16</h4><div class="upcoming-item">${icon('calendar')}<div><a>Cell structure lab report</a><small>Biology: Period 4</small><small>8:30 am</small></div></div>
    <div class="upcoming-item">${icon('document')}<div><a>Primary source analysis</a><small>World History: Period 3</small><small>3:00 pm</small></div></div>
    ${index===0?'':`<h4>TUESDAY, NOVEMBER 17</h4><div class="upcoming-item">${icon('calendar')}<div><a>Study group</a><small>Library · Room 204</small><small>3:30 pm</small></div></div>`}</section>
    ${index===0?'':'<div class="right-note">All times shown are for this fictional school.</div>'}</aside>`;
}
function pageHeading(index) {
  const names = ['Courses', 'English Literature: Period 1', 'Grades / Attendance', 'Calendar'];
  return `<div class="page-heading"><div class="breadcrumb">${index===0?'Home':index===3?'Home › Calendar':'Courses › English Literature'}</div><h1>${names[index]}</h1><span class="heading-options">${index===0?'My Courses &nbsp; ▾':index===1?'2026–2027 &nbsp; · &nbsp; Ms. Taylor':'2026–2027'}</span></div>`;
}
function coursePage() {
  const order=[0,1,2,5,4,3];
  return `<div class="page-tabs"><span class="active">Course Dashboard</span><span>Recent Activity</span><span class="tab-right">My Courses &nbsp; ⚙</span></div>
    <div class="course-section-label">CURRENT COURSES <small>6 courses</small></div>
    ${order.map((id,i)=>surface(0,id,`<div class="course-thumbnail">${thumbnail(i)}</div><div class="course-caption"><a>${courses[i]}</a><b>Period ${i+1} · 2026–2027</b><small>${teachers[i]} &nbsp; · &nbsp; Northwood High School</small></div>`,'course-card')).join('')}
    <div class="course-footer">Showing 6 of 6 courses <span>Archived courses</span></div>
    ${surface(0,6,'View all upcoming →','view-upcoming')}
    ${surface(0,7,'Next Page →','next-page')}`;
}
function assignmentsPage() {
  return `<div class="page-tabs"><span class="active">Materials</span><span>Updates</span><span>Gradebook</span><span class="tab-right">Options ▾</span></div>
    <div class="materials-tools"><span class="small-button">Add Materials ▾</span><span class="link">▸ Expand All</span><span class="tool-right">All materials &nbsp; ▾</span></div>
    <div class="folder-heading">${icon('folder')}<b>Unit 3: Reading &amp; responding</b><small>November 9 – November 20</small></div>
    ${Array.from({length:5},(_,r)=>`<div class="material-row" style="top:${192+r*80}px"><span class="material-icon">${icon(r===2?'folder':'document')}</span><div class="material-detail">${r===0?'':r===3?'':`<a>${r===4?titles[6]:titles[r]}</a>`}<small>English Literature · ${r===2?'3 items':'10 points · Individually assigned'}</small></div><span class="material-date">${[0,2,4].includes(r)?'':`Due Nov ${13+r}<br><small>11:59 pm</small>`}</span><span class="material-state">${[1,4].includes(r)?'':r<2?'Not submitted':'Available'}</span></div>`).join('')}
    ${surface(1,0,'Reading response: Chapter 6','assignment-title')}
    ${surface(1,1,'Due Nov 13 · 11:59 pm','due-chip')}
    ${surface(1,2,'Submit Assignment','submit-button')}
    ${surface(1,3,'Due Nov 15 · 11:59 pm','due-chip')}
    ${surface(1,4,'Perspective drawing','assignment-title')}
    ${surface(1,5,'View feedback','feedback-chip')}
    ${surface(1,6,'Submit Assignment','submit-button')}
    <div class="materials-footer">All materials are displayed. <span>Last updated Nov 13, 2026</span></div>
    ${surface(1,7,'Next Page →','next-page')}`;
}
function gradesPage() {
  const {height, platforms} = LEVELS[2];
  const assignmentNames = [
    'Reading journal', 'Chapter 6 response', 'Character study', 'Citation practice',
    'Poetry annotation', 'Theme quiz', 'Close reading notes', 'Evidence log',
    'Annotated bibliography', 'Revision worksheet', 'Peer feedback', 'Portfolio reflection',
  ];
  let assignment = 0;
  const style = {
    assignment: 'grade-assignment', score: 'score-chip', grade: 'grade-chip',
    panel: 'grade-summary', goal: 'next-page',
  };
  return `<div id="grades-tower" style="height:${height}px">
    ${pageHeading(2)}
    <div class="gradebook-sheet">
      <div class="gradebook-columns"><span>Assignment</span><span>Points</span><span>Grade</span><span>Comments</span></div>
      ${platforms.filter(p=>!p.goal).map(p=>{
        if (p.kind === 'panel') return `<div class="gradebook-row gradebook-unit" style="top:${p.y}px"></div>`;
        const name = p.kind === 'assignment' ? '' : assignmentNames[assignment++ % assignmentNames.length];
        return `<div class="gradebook-row" style="top:${p.y}px"><span>${name}</span><small>${p.moving ? 'Updated' : 'Graded'}</small></div>`;
      }).join('')}
    </div>
    ${platforms.map(p=>surface(2,p.id,
      `<span${p.checkpoint ? ' class="checkpoint-badge"' : ''} title="${p.label}${p.checkpoint ? ' · Checkpoint' : ''}">${p.goal ? 'Next Page' : p.checkpoint ? '◆ Save' : p.label}</span>`,
      style[p.kind])).join('')}
  </div>`;
}
function calendarPage() {
  const events={0:'Reading response',2:'Math practice',4:'Library visit',8:'Lab report',10:'Study group',12:'Art portfolio',14:'Peer review',16:'Essay outline',18:'Quiz review',20:'Office hours',23:'Group project',25:'Final draft',27:'School assembly'};
  const activeCells={0:0,2:1,11:2,13:3,18:4,16:5,14:6,23:7,25:8,27:9};
  return `<div class="calendar-toolbar"><div><span class="small-button">‹</span><span class="small-button">Today</span><span class="small-button">›</span></div><h2>November 2026</h2><div><span class="small-button selected-view">Month</span><span class="small-button">Week</span><span class="small-button">Day</span></div></div>
    <div class="calendar-weekdays">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<span>${d}</span>`).join('')}</div>
    <div class="calendar-grid">${Array.from({length:35},(_,i)=>{const day=i+1;return `<div class="date-cell ${day===13?'today':''} ${day>30?'other-month':''}"><span class="date">${day>30?day-30:day}</span>${day===13?'<span class="today-label">TODAY</span>':''}${events[i]&&!(i in activeCells)?`<div class="calendar-event decorative-event">${events[i]}</div>`:''}${i===29?'<div class="calendar-event school-event">No school · Holiday</div>':''}</div>`;}).join('')}</div>
    ${LEVELS[3].platforms.filter(p=>!p.goal&&!p.edge).map(p=>surface(3,p.id,`<span>${['Reading','Practice','Lab report','Study group','Quiz review','Essay plan','Peer review','Project','Final draft','Assembly'][p.id]}</span>`,'calendar-event playable-event')).join('')}
    <div class="calendar-key"><span class="key-dot"></span>English Literature <span class="key-dot green"></span>School events <span class="key-dot purple"></span>Personal</div>
    ${surface(3,10,'Next Page →','next-page')}`;
}
export function renderPage(index) {
  if (index === 2) {
    return `<div class="site-columns">${leftSidebar(index)}<main class="page-content">${gradesPage()}</main>${rightSidebar(index)}</div>`;
  }
  const exits = LEVELS[index].platforms.filter(p=>p.edge).map(p=>{
    const left = p.edge === 'left';
    const label = left ? 'Personal resources' : 'Resources';
    const link = `${icon('folder')}<span>${label}</span><span class="edge-arrow" aria-hidden="true">${left ? '←' : '→'}</span>`;
    return surface(index,p.id,link,`edge-launch edge-launch-${p.edge}`) +
      `<div class="edge-key ${p.edge}-key" data-key="${p.edge}">${icon('key')}<span>Key room</span></div>`;
  }).join('');
  return `<div class="site-columns">${leftSidebar(index)}<main class="page-content page-${index}"></main>${rightSidebar(index)}</div>${pageHeading(index)}${[coursePage,assignmentsPage,null,calendarPage][index]()}${exits}`;
}

export function renderRoom(index, side) {
  const room = ROOMS[index][side];
  const left = side === 'left';
  const library = left ? 'Personal resources' : 'School resources';
  const names = ['Start folder', 'Shared files', 'Study notes', 'Practice', 'Archive', 'Key vault'];
  const featuredFolders = ['Class handouts', 'Reading lists', 'Assignment guides', 'Study resources'];
  const archivedFolders = ['Class notes', 'Reference', 'Examples', 'Worksheets', 'Past units', 'Review'];
  return `<main class="resource-room">
    <div class="room-heading">
      <div class="breadcrumb">Resources › ${LEVELS[index].name}</div>
      <h1>${library}</h1>
      <button class="small-button" data-leave-room>Back to page</button>
    </div>
    <section class="room-library" aria-labelledby="room-folders">
      <div class="room-library-tabs"><h2 id="room-folders">Folders</h2></div>
      <aside class="room-library-sidebar">
        <span class="sidebar-link selected">${icon('folder')}${library}</span>
        <span class="sidebar-link">${icon('people')}Shared with me</span>
        <span class="sidebar-link">${icon('document')}Recent files</span>
      </aside>
      <div class="room-file-path">${icon('folder')} <strong>${library}</strong><span>${room.platforms.length + featuredFolders.length + archivedFolders.length} folders</span></div>
      <div class="room-library-guide">
        <strong>${left ? '← Start on the right' : 'Start on the left →'}</strong>
        <span>Jump on the outlined folders to collect the key. A fall returns you to the page start.</span>
      </div>
      <div class="room-library-label">Folder name</div>
      <div class="room-featured-folders">
        ${featuredFolders.map(name=>`<div class="room-folder-preview">${icon('folder')}<span>${name}</span></div>`).join('')}
      </div>
      ${room.platforms.map(p=>`<div class="room-library-row" style="top:${p.y}px" aria-hidden="true"></div>`).join('')}
    </section>
    ${room.platforms.map(p=>`<div class="room-folder-preview room-archive-folder" style="left:${p.x}px;top:${p.y+p.h+12}px;width:${p.w}px">
      ${icon('folder')}<span>${archivedFolders[p.id]}</span>
    </div>`).join('')}
    ${room.platforms.map(p=>`<div id="platform-${p.id}" data-surface="${p.id}" class="surface room-platform ${p.moving?'moving':''} ${p.roomKey?'key-vault':''}" style="left:${p.x}px;top:${p.y}px;width:${p.w}px;height:${p.h}px">
      ${icon(p.roomKey ? 'key' : 'folder')}<span>${names[p.id]}</span>
    </div>`).join('')}
  </main>`;
}
