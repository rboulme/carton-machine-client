import { useEffect, useState } from "react";
import { MachineClass, MachineType, MotionObjectClass } from "./machineClass";
import { OrderInputType, WorkOrderType } from "./orderToolBar";
//============================================================================================
type CutOrder ={
    w1:number,
    h:number,
    w2:number,
    
}
//===========================================================================================
export function handleOrder(machine:MachineType,setMachine:(m:MachineType)=>void){
    const workorder:WorkOrderType = machine.workorder;
    const rollWidth:number = workorder.rollWidth;
   
    const orderInputs:OrderInputType[] = workorder.orders;
    let cutOrders:CutOrder[]=[];
    let cuts:number[]=[0];
    let crises:number[]=[];
    
    let totalW:number = 0;
    orderInputs.forEach(oi=>{
        for(let i=0;i<oi.cnt;i++){
            const newCutOrder:CutOrder ={w1:oi.wl1,h:oi.h,w2:oi.wl2}
            cutOrders.push(newCutOrder);
        }
    })
    cutOrders.forEach(co=>{
        const coLength = co.h+co.w1+co.w2; 
        if(co.w1>0) crises.push(totalW+co.w1);
        if(co.w2>0) crises.push(totalW+coLength-co.w2);
        totalW += coLength;
        cuts.push(totalW);
    })
    
    workorder.cuts =cuts;
    workorder.crises =crises;
    
    if(cutOrders.length>5){alert(`Maximum Input orders exceeded ${cutOrders.length} >5 `); workorder.error = true;}
    else if(totalW>rollWidth){alert(`Order Total length exceeds roll width ${totalW} > ${rollWidth}`);workorder.error = true;}
    else workorder.error = false;
    machine.workorder = {...workorder};
    setMachine({...machine})
}
//============================================================================================
function findExcluded(MotionsArr:MotionObjectClass[],pos:number){
    for(let i=0;i<MotionsArr.length;i++){
        if(!MotionsArr[i].excluded && !MotionsArr[i].posComplete){
            MotionsArr[i].checkExcluded(pos);
            if(MotionsArr[i].excluded)MotionsArr[i].pos = MotionsArr[i].minPos;
        } 
    }
}
//============================================================================================
function findFirstNotExclused(motionsArr:MotionObjectClass[]){
    for (let i = 0; i < motionsArr.length; i++) {
        if(!motionsArr[i].excluded) return motionsArr[i];
    }
}
//============================================================================================
export function moveRightUntilIndex(lastIndex:number,motionsArr:MotionObjectClass[]){
    for(let i = motionsArr.length-1;i>=lastIndex;i--){
        motionsArr[i].pos= motionsArr[i].maxPos;
        motionsArr[i].posComplete = false;
        motionsArr[i].excluded = false;
        
    }

}
//============================================================================================
function handleMotionsDistances(motionsArr:MotionObjectClass[],distArr:number[],relPos:number,scenario:number,sc3_1st:boolean){
    let kIndex:number  = 0;
    let sc3_1:boolean = sc3_1st;

    moveRightUntilIndex(kIndex,motionsArr)
    for(let distIndex=0;distIndex<distArr.length;distIndex++ ){
        const dist:number = distArr[distIndex]+relPos;
        findExcluded(motionsArr,dist);
        for(let kIndex:number= 0;kIndex<motionsArr.length;kIndex++){ 
            const mClass:MotionObjectClass =  motionsArr[kIndex];
            if(!mClass.excluded){
                const dist:number = distArr[distIndex]+relPos;
                if(mClass.validPos(dist)){
                    mClass.pos = dist;
                    mClass.posComplete = true;
                    if(distIndex<distArr.length-1)
                        distIndex++;
                    else{
                        console.log('final distance',dist);
                        console.log(mClass);
                        return;    
                    }
                }
                else{
                    if(scenario==1){
                        mClass.excluded = true;
                        mClass.pos = mClass.minPos;
                        mClass.posComplete = false;
                        kIndex=kIndex-1;
                    }
                    else if(scenario==2){
                        let lastMClass:MotionObjectClass|undefined = findFirstNotExclused(motionsArr);
                        if(lastMClass){
                            lastMClass.excluded = true;
                            distIndex = distArr.indexOf(lastMClass.pos-relPos)
                            lastMClass.pos = lastMClass.minPos;
                            lastMClass.posComplete = false;
                            let lastIndex:number = motionsArr.indexOf(lastMClass);
                            moveRightUntilIndex(lastIndex+1,motionsArr);
                            kIndex= lastIndex;
                        }
                    }
                    else if(scenario==3){
                        if(sc3_1){
                            mClass.excluded = true;
                            mClass.pos = mClass.minPos;
                            mClass.posComplete = false;
                            kIndex=kIndex-1;
                        }
                        else{
                            let lastMClass:MotionObjectClass|undefined = findFirstNotExclused(motionsArr);
                            if(lastMClass){
                                lastMClass.excluded = true;
                                distIndex = distArr.indexOf(lastMClass.pos-relPos)
                                lastMClass.pos = lastMClass.minPos;
                                lastMClass.posComplete = false;
                                let lastIndex:number = motionsArr.indexOf(lastMClass);
                                moveRightUntilIndex(lastIndex+1,motionsArr);
                                kIndex= lastIndex;
                            }
                        }
                        sc3_1 = !sc3_1;

                    }
                    
                }
            }
        }
    }

}
//============================================================================================
function allExcluded(motionsArr:MotionObjectClass[]){
    let cnt:number = 0;
    motionsArr.forEach(m=>{if(m.excluded)cnt++})
    return cnt== motionsArr.length;
}
//============================================================================================
function setUnusedExcluded(motionsArr:MotionObjectClass[]){
    motionsArr.forEach(m=>{
        if(!m.posComplete)m.excluded = true; 
    })
}
//============================================================================================
function moveExcludedLeftmost(motionsArr:MotionObjectClass[]){
    motionsArr.forEach(m=>{
        if(m.excluded) m.pos = m.minPos; 
    })
}
//============================================================================================
export function applyOrder(machineClass:MachineClass,setMachine:(m:MachineType)=>void){
    
    const knives:MotionObjectClass[] = machineClass.knives;
    const crisers:MotionObjectClass[] = machineClass.crisers;
    const cuts:number[] = machineClass.obj.workorder.cuts;
    const crises:number[] = machineClass.obj.workorder.crises;
    const rollWidth:number = machineClass.obj.workorder.rollWidth;
    const machWidth:number = machineClass.obj.width;

    const relPos:number = (machWidth/2)-(rollWidth/2);

    handleMotionsDistances(knives,cuts,relPos,1,false);
    if(allExcluded(knives)){
        moveRightUntilIndex(0,knives)
        handleMotionsDistances(knives,cuts,relPos,2,false);
    }

    handleMotionsDistances(crisers,crises,relPos,1,false);
    if(allExcluded(crisers)){
        moveRightUntilIndex(0,crisers)
        handleMotionsDistances(crisers,crises,relPos,2,false);
    }
    if(allExcluded(crisers)){
        moveRightUntilIndex(0,crisers)
        handleMotionsDistances(crisers,crises,relPos,3,false);
    }
    if(allExcluded(crisers)){
        moveRightUntilIndex(0,crisers)
        handleMotionsDistances(crisers,crises,relPos,3,true);
    }
    setUnusedExcluded(knives);
    setUnusedExcluded(crisers);

    moveExcludedLeftmost(knives);
    moveExcludedLeftmost(crisers);


}
//============================================================================================
interface CutOrderDivProps{
    pos:number,
    factor:number,
}
//-------------------------------------------------------------------------------------------
function  CutOrderDiv({pos,factor}:CutOrderDivProps){
    return(
        <div 
            style={{
                borderLeft:'2px solid red',
                position:'absolute',
                top:-10,
                color:'#F00',
                width:1,
                zIndex:3,
                left:pos*factor,
                height:200,
            }}
        />
    )
}
//============================================================================================
interface CutOrderDivProps{
    pos:number,
    factor:number,
}
//-------------------------------------------------------------------------------------------
function  CriseOrderDiv({pos,factor}:CutOrderDivProps){
    return(
        <div 
            style={{
                borderLeft:'2px solid blue',
                position:'absolute',
                top:-10,
                color:'#F00',
                width:1,
                zIndex:3,
                left:pos*factor,
                height:200,
            }}
        />
    )
}
//============================================================================================

interface RollProps{
   machine:MachineType;
   factor:number;
}
//--------------------------------------------------------------------------------------------
export function Roll({machine,factor}:RollProps){
    const {workorder} = machine;
    const {cuts,crises} = workorder;

    return(
        <div
            style={{
                position:'absolute',
                background:'#DDD',
                left: ((machine.width-machine.workorder.rollWidth)/2)*factor,
                width:machine.workorder.rollWidth*factor,
                height:180,
                top:10,
                zIndex:1,
            }}
       >
        {cuts.map(c=>(<CutOrderDiv  pos={c} factor={factor}/>))}
        {crises.map(c=>(<CriseOrderDiv pos={c} factor={factor}/>))}
        
        </div>
    )
}
//============================================================================================

      