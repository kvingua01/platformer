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
const checkpointIds = [[1, 3, 5], [3, 5], [4], [6]];
export const LEVELS = ['Courses', 'Assignments', 'Grades', 'Calendar'].map((name, index) => ({
  name,
  difficulty: ['Easy', 'Medium', 'Hard', 'Very hard'][index],
  length: SCENE_WIDTH,
  platforms: surfaces[index].map(([x, y, w, h], id, all) => ({
    id, x, y, w, h,
    checkpoint: checkpointIds[index].includes(id),
    goal: id === all.length - 1,
    // Submission/score chips and calendar event chips move inside their cells.
    moving: index > 0 && [2, 5].includes(id),
    axis: 'x', amplitude: index === 3 ? 12 : 8, phase: id,
  })),
}));
