// These rectangles are the actual card, link, score, and event elements rendered
// by pages.js. The surrounding webpage is intentionally not a solid floor.
export const SCENE_WIDTH = 1280;
export const SCENE_HEIGHT = 720;
const surfaces = [
  [
    [242, 190, 232, 190], [496, 190, 232, 190], [750, 190, 232, 190],
    [750, 410, 232, 190], [496, 410, 232, 190], [242, 410, 232, 190],
    [1030, 570, 190, 32], [820, 635, 162, 32],
  ],
  [
    [268, 205, 236, 36], [600, 205, 128, 32], [812, 285, 145, 34],
    [600, 365, 128, 32], [310, 445, 170, 36], [600, 525, 112, 32],
    [812, 525, 145, 34], [1005, 635, 170, 32],
  ],
  null, // Grades has its own vertical layout.
  [
    [250, 215, 72, 27], [464, 215, 72, 27], [678, 315, 72, 27],
    [892, 315, 72, 27], [678, 415, 72, 27], [464, 415, 72, 27],
    [250, 415, 72, 27], [464, 515, 72, 27], [678, 515, 72, 27],
    [892, 515, 72, 27], [1005, 635, 170, 32],
  ],
];
// Keep normal website grids, but create meaningful gaps and precision targets.
const calendarPlatform = { w: 48, h: 27, axis: 'x', amplitude: 22, speed: 2.7 };
const targetWidths = [
  [180,180,180,180,180,180,110,110],
  [160,82,92,82,110,72,92,110],
  null,
  [...Array(10).fill(calendarPlatform.w),90],
];
// Gradebook rows are listed in climbing order, from the semester summary up.
const gradesPlatforms = [
  [2048, 'panel', 'Semester 1 · 92.8%'],
  [1958, 'score', '19 / 20'],
  [1868, 'grade', 'A · 96%'],
  [1776, 'score', '27 / 30'],
  [1686, 'assignment', 'Reading response'],
  [1592, 'panel', 'Unit 1 · Close reading'],
  [1500, 'grade', 'A · 95%'],
  [1406, 'score', '14 / 15'],
  [1315, 'assignment', 'Poetry analysis'],
  [1221, 'score', '23 / 25'],
  [1131, 'grade', 'A− · 92%'],
  [1038, 'panel', 'Unit 2 · Analysis'],
  [946, 'assignment', 'Perspective study'],
  [852, 'score', '17 / 20'],
  [758, 'grade', 'B+ · 89%'],
  [665, 'score', '24 / 25'],
  [572, 'assignment', 'Comparative essay'],
  [478, 'panel', 'Unit 3 · Composition'],
  [386, 'grade', 'A · 98%'],
  [293, 'score', '29 / 30'],
  [200, 'assignment', 'Final portfolio'],
  [110, 'goal', 'Next Page →'],
];
// Distinct routes for the three terms, including near-vertical jumps and reversals.
const gradesPlatformCenters = [
  [487, 572, 655, 645, 553, 618, 719, 676, 576, 477, 494, 596, 696, 738, 661, 552, 584, 505, 463, 563, 657, 642],
  [570, 465, 515, 622, 714, 692, 761, 679, 572, 584, 493, 454, 551, 641, 632, 539, 611, 713, 764, 701, 601, 502],
  [518, 623, 573, 470, 461, 548, 650, 748, 706, 719, 619, 528, 557, 479, 560, 672, 662, 748, 664, 560, 509, 595],
];
const gradesSectionHeight = 2100;
const gradesSections = 3;
const gradesSectionStride = gradesPlatforms[0][0] - gradesPlatforms.at(-1)[0] + 92;
const grades = {
  name: 'Grades', difficulty: 'Expert', length: SCENE_WIDTH,
  height: gradesSectionHeight * gradesSections,
  platforms: Array.from({length: gradesSections}, (_, section) =>
    gradesPlatforms.map(([y, kind, label], row) => ({
      x: gradesPlatformCenters[section][row] - calendarPlatform.w / 2,
      y: y + (gradesSections - 1) * gradesSectionHeight - section * gradesSectionStride,
      kind: kind === 'goal' && section < gradesSections - 1 ? 'panel' : kind,
      label: kind === 'goal' && section < gradesSections - 1 ? `Term ${section + 1} complete` : label,
    })),
  ).flat().map(({x, y, kind, label}, id) => ({
    ...calendarPlatform, id, x, y, kind, label,
    goal: kind === 'goal', checkpoint: kind === 'panel' && id !== 0,
    moving: id !== 0 && kind !== 'goal', phase: id,
  })),
};

export const LEVELS = ['Courses', 'Assignments', 'Grades', 'Calendar'].map((name, index) => {
  if (index === 2) return grades;
  return {
    name,
    difficulty: ['Challenging', 'Hard', 'Expert', 'Extreme'][index],
    length: SCENE_WIDTH,
    platforms: surfaces[index].map(([x, y, w, h], id, all) => ({
      id, x: x + (w-targetWidths[index][id])/2, y, w: targetWidths[index][id],
      h: index === 3 && id !== all.length - 1 ? calendarPlatform.h : h,
      goal: id === all.length - 1,
      // Submission/score chips and calendar event chips move inside their cells.
      moving: index > 0 && (index === 3 ? [1,2,4,5,8,9] : [2,5]).includes(id),
      axis: 'x', amplitude: index === 3 ? calendarPlatform.amplitude : [0,14][index], speed: index === 3 ? calendarPlatform.speed : [1.5,1.9][index], phase: id,
    })).concat([
      {id: surfaces[index].length, x: 35, y: 650, w: 145, h: 30, edge: 'left'},
      {id: surfaces[index].length + 1, x: 1120, y: 680, w: 125, h: 30, edge: 'right'},
    ]),
  };
});

// Each horizontal page has two independent rooms; the left room runs right-to-left.
export const ROOMS = LEVELS.map((page,index)=>page.height ? null : Object.fromEntries(['left','right'].map(side=>{
  const widths=[150,...Array(4).fill([110,90,75,60][index]),100];
  const heights=[540,470,530,440,500,430];
  return [side,{
    name:`${page.name} · ${side==='left'?'Left':'Right'} resource room`,
    length:SCENE_WIDTH,
    platforms:widths.map((w,id)=>({
      id,x:side==='left'?SCENE_WIDTH-(65+id*210)-w:65+id*210,
      y:heights[id],w,h:44,roomKey:id===5,
      moving:index>0&&[2,4].includes(id),axis:'x',
      amplitude:[0,8,12,16][index],speed:1.6+index*.25,phase:id,
    })),
  }];
})));
