import { MachineType, MotionObjDiv, MotionObjectType } from "./machineClass";
import { Roll } from "./Roll";

//========================================================================================================
interface MotionMonitorDivProps{
    obj:MotionObjectType;
    factor:number;
    d0Arr:any[];
}
//------------------------------------------------------------------------------------------------------
export function MotionMonitorDiv({obj,factor,d0Arr}:MotionMonitorDivProps){
    let clr:string = obj.name.startsWith('K')?'#0F0':'#FF0';
    
    let posSddress:number =  obj.currentPosAddress;

    let currentPos = (posSddress<d0Arr.length-1)? d0Arr[posSddress]:0; 
    if(obj.excluded) clr = '#F00';
    return(
        <div
        key ={obj.name}
        style={{
            position:'absolute',
            background:clr,
            width:obj.width*factor,
            height:80,
            left:(currentPos+obj.pos1)*factor,
            top:(obj.name.startsWith('K'))?100:10,
            zIndex:2,
            borderStyle:'solid',
            borderWidth:1,
            borderColor:'#000',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
        }}
        >
            <small>{obj.name}</small>
            {/* {!obj.posComplete&&<small>{obj.pos}</small>} */}
            {obj.posComplete&&<small><b>{currentPos+obj.pos1}</b></small>}
            <small className="text-primary"><b>{currentPos}</b></small>
            
        </div>
    )
}
//========================================================================================================

interface MachineMonitorDivProps{
    machine:MachineType;
    factor:number;
    d0Arr:any[];
}
export function MachineMonitorDiv({machine,factor,d0Arr}:MachineMonitorDivProps){
    return(
        <div
          style={{
                position:'absolute',
                background:'#EEE',
                width:machine.width*factor,
                height:200,
                top:800,
                zIndex:50,
            }}
        >
            <Roll machine={machine} factor={factor}/>
            {machine.knives.map(k=><MotionMonitorDiv obj={k} factor={factor} d0Arr={d0Arr}/>)}
            {machine.crisers.map(c=><MotionMonitorDiv obj={c} factor={factor} d0Arr={d0Arr}/>)}
            {/* {machine.crisers.map(c=><MotionObjDiv obj={c} factor={factor}/>)}  */}
            
        </div>
    )

}