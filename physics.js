export const WIDTH=32, HEIGHT=42, STEP=1/120;
const names=[['English Literature','Algebra II','World History','Biology','Studio Art','Computer Science','Spanish II','Study Hall'],['Reading response','Submit assignment','Chapter 04 quiz','Research proposal','Upload your work','Peer review','Final draft','All work submitted'],['English · A','Math · 94%','History · B+','Science · 98%','Art · A','Computing · 96%','Spanish · A−','Semester total'],['12','13','14','15','16','17','18','19']];
export const LEVELS=['Courses','Assignments','Grades','Calendar'].map((name,i)=>{
 const widths=[[235,205,190,210,185,205,195,230],[195,150,140,165,135,150,145,185],[165,115,105,125,100,115,105,170],[150,95,90,110,85,100,90,160]][i];
 const heights=[455,405,445,370,420,350,400,360];let x=55;
 const platforms=widths.map((w,j)=>{const p={id:j,x,y:heights[j],w,h:i===0?108:i===1?76:i===2?49:68,title:names[i][j],checkpoint:j>0&&([ [2,4,6],[3,5],[4],[4] ][i].includes(j)),moving:i>0&&[2,5].includes(j),amplitude:12+i*5,phase:j,kind:['course','assignment','grade','calendar'][i]}; x+=w+[65,95,110,125][i];return p;});
 platforms.push({id:8,x,y:390,w:190,h:80,title:'Next Page',goal:true,kind:'goal'});
 return {name,difficulty:['Easy','Medium','Hard','Very hard'][i],platforms,length:x+280};
});
export function createState(index=0){const level=LEVELS[index];return {index,level,time:0,player:{x:level.platforms[0].x+30,y:level.platforms[0].y-HEIGHT,vx:0,vy:0,ground:0},checkpoint:0,activated:new Set(),falls:0,done:false,landings:0};}
export function platformAt(p,t){return {...p,y:p.y+(p.moving?Math.sin(t*1.5+p.phase)*p.amplitude:0)};}
export function respawn(s){const p=platformAt(s.level.platforms[s.checkpoint],s.time);Object.assign(s.player,{x:p.x+Math.min(30,p.w/3),y:p.y-HEIGHT,vx:0,vy:0,ground:p.id});}
export function tick(s,input,dt=STEP){if(s.done)return;const a=s.player;const oldTime=s.time;s.time+=dt;
 if(a.ground!==null){const p=s.level.platforms[a.ground];a.y+=platformAt(p,s.time).y-platformAt(p,oldTime).y;}
 const dir=Number(!!input.right)-Number(!!input.left);a.vx=dir?Math.max(-280,Math.min(280,a.vx+dir*1900*dt)):a.vx*Math.exp(-12*dt);
 if(input.jump&&a.ground!==null){a.vy=-590;a.ground=null;}const prevY=a.y; a.vy+=1450*dt;a.x+=a.vx*dt;a.x=Math.max(0,Math.min(s.level.length-WIDTH,a.x));a.y+=a.vy*dt;a.ground=null;
 for(const base of s.level.platforms){const p=platformAt(base,s.time),old=platformAt(base,oldTime);if(a.x+WIDTH>p.x&&a.x<p.x+p.w&&prevY+HEIGHT<=old.y+1.5&&a.y+HEIGHT>=p.y&&a.vy>=0){a.y=p.y-HEIGHT;a.vy=0;a.ground=p.id;s.landings++;if(p.checkpoint){s.activated.add(p.id);s.checkpoint=p.id;}if(p.goal)s.done=true;break;}}
 if(a.y>660){s.falls++;respawn(s);}
}
