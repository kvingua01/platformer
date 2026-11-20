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
const targetWidths = [
  [180,180,180,180,180,180,110,110],
  [160,82,92,82,110,72,92,110],
  null,
  [48,48,48,48,48,48,48,48,48,48,90],
];
// Gradebook rows are listed in climbing order, from the semester summary up.
const gradesPlatforms = [
  [404, 2048, 166, 'panel', 'Semester 1 · 92.8%'],
  [558, 1958, 106, 'score', '19 / 20'],
  [709, 1868, 76, 'grade', 'A · 96%'],
  [562, 1776, 82, 'score', '27 / 30', 16],
  [402, 1686, 138, 'assignment', 'Reading response'],
  [524, 1592, 188, 'panel', 'Unit 1 · Close reading'],
  [723, 1500, 68, 'grade', 'A · 95%'],
  [578, 1406, 66, 'score', '14 / 15'],
  [409, 1315, 126, 'assignment', 'Poetry analysis'],
  [556, 1221, 74, 'score', '23 / 25', 18],
  [704, 1131, 86, 'grade', 'A− · 92%'],
  [518, 1038, 190, 'panel', 'Unit 2 · Analysis'],
  [390, 946, 135, 'assignment', 'Perspective study'],
  [554, 852, 78, 'score', '17 / 20'],
  [702, 758, 72, 'grade', 'B+ · 89%', 18],
  [568, 665, 80, 'score', '24 / 25'],
  [402, 572, 144, 'assignment', 'Comparative essay'],
  [527, 478, 186, 'panel', 'Unit 3 · Composition'],
  [714, 386, 80, 'grade', 'A · 98%'],
  [571, 293, 70, 'score', '29 / 30', 16],
  [413, 200, 125, 'assignment', 'Final portfolio'],
  [550, 110, 138, 'goal', 'Next Page →'],
];
const grades = {
  name: 'Grades', difficulty: 'Expert', length: SCENE_WIDTH, height: 2100,
  platforms: gradesPlatforms.map(([x, y, w, kind, label, amplitude = 0], id) => ({
    id, x, y, w, h: kind === 'panel' ? 40 : 30, kind, label,
    goal: kind === 'goal', checkpoint: kind === 'panel' && id !== 0,
    moving: amplitude > 0, axis: 'x', amplitude, speed: 2.1, phase: id,
  })),
};

export const LEVELS = ['Courses', 'Assignments', 'Grades', 'Calendar'].map((name, index) => {
  if (index === 2) return grades;
  return {
    name,
    difficulty: ['Challenging', 'Hard', 'Expert', 'Extreme'][index],
    length: SCENE_WIDTH,
    platforms: surfaces[index].map(([x, y, w, h], id, all) => ({
      id, x: x + (w-targetWidths[index][id])/2, y, w: targetWidths[index][id], h,
      goal: id === all.length - 1,
      // Submission/score chips and calendar event chips move inside their cells.
      moving: index > 0 && (index === 3 ? [1,2,4,5,8,9] : [2,5]).includes(id),
      axis: 'x', amplitude: [0,14,18,22][index], speed: [1.5,1.9,2.3,2.7][index], phase: id,
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
