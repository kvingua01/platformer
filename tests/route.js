import { tick, platformAt, WIDTH, HEIGHT } from '../physics.js';
export const ROUTES = [[1,2,3,4,5,4,3,6,7],[1,2,3,4,3,5,6,7],[1,2,1,3,4,3,5,6,7],[1,2,3,2,4,5,6,5,7,8,9,10]];
export function planJump(state, target, simulate = tick) {
  for (const wait of [0,30,60,100,150,210,270]) {
    for (const strategy of ['jump','drop-right','drop-left']) {
      for (const margin of [30,12,45,5,0,-5,65]) {
        const s = {...state, player:{...state.player},keys:new Set(state.keys)};
        const actions=[];
        const step=input=>{actions.push(input);simulate(s,input);};
        for(let i=0;i<wait;i++)step({});
        const source=platformAt(s.level.platforms[s.player.ground],s.time);
        const to=platformAt(s.level.platforms[target],s.time);
        const direction=strategy==='drop-right'?1:strategy==='drop-left'?-1:Math.sign(to.x+to.w/2-source.x-source.w/2)||1;
        const takeoff=direction>0?source.x+source.w-margin:source.x+margin;
        let loops=0;
        while(direction>0?s.player.x<takeoff:s.player.x>takeoff){
          step({right:direction>0,left:direction<0});
          if(s.player.ground!==source.id||loops++>200)break;
        }
        if(s.player.ground!==source.id)continue;
        step({right:direction>0,left:direction<0,jump:strategy==='jump'});
        for(let i=0;i<220;i++) {
          const p=platformAt(s.level.platforms[target],s.time);
          const center=p.x+p.w/2-WIDTH/2;
          const leaving=strategy!=='jump'&&s.player.y+HEIGHT<=source.y+2;
          step(leaving?{right:direction>0,left:direction<0}:{right:s.player.x<center-4,left:s.player.x>center+4});
          if(s.player.ground===target) {
            for(let settle=0;settle<100&&!s.done;settle++) {
              const landing=platformAt(s.level.platforms[target],s.time);
              const aim=landing.x+landing.w/2-WIDTH/2;
              const predicted=s.player.x+s.player.vx*.09;
              step({right:predicted<aim-3,left:predicted>aim+3});
              if(s.player.ground!==target)break;
              if(Math.abs(s.player.x-aim)<6&&Math.abs(s.player.vx)<25)return {state:s,actions};
            }
            if(s.player.ground===target)return {state:s,actions};
            break;
          }
          if(s.falls>state.falls)break;
        }
      }
    }
  }
  throw Error(`No normal-input route from ${state.player.ground} to ${target} in ${state.level.name}`);
}

export function collectKey(state, side, simulate = tick) {
  const target=state.level.platforms.find(p=>p.edge===side).id;
  const plan=planJump(state,target,simulate);
  const s=plan.state;
  let first=true;
  for(let i=0;i<220&&!s.keys.has(side);i++) {
    const action={left:side==='left',right:side==='right',jump:first};
    first=false;plan.actions.push(action);simulate(s,action);
    if(s.falls>state.falls)throw Error(`Failed ${side} key excursion`);
  }
  if(!s.keys.has(side))throw Error(`Did not collect ${side} key`);
  return plan;
}
