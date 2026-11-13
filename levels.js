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
  [
    [268, 205, 190, 26], [535, 255, 106, 26], [775, 305, 88, 26],
    [535, 355, 120, 26], [295, 405, 130, 26], [535, 455, 90, 26],
    [775, 505, 88, 26], [1005, 635, 170, 32],
  ],
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
  [130,62,54,72,90,54,54,100],
  [48,48,48,48,48,48,48,48,48,48,90],
];
export const LEVELS = ['Courses', 'Assignments', 'Grades', 'Calendar'].map((name, index) => ({
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
}));
