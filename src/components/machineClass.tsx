import {  WorkOrderType } from "./orderToolBar";
import { moveRightUntilIndex, Roll } from "./Roll";

export type MotionObjectType = {
    name:string,
    minPos?:number,
    maxPos?:number,
    width:number,
    pos:number,
    maxSupposedPos:number,
    excluded?:boolean,
    posComplete?:boolean,
    pos1:number,
    currentPosAddress:number,
    
}
//========================================================================================================

export type MachineType ={
    workorder:WorkOrderType,
    width:number,
    knives:MotionObjectType[],
    crisers:MotionObjectType[],
    
}

//========================================================================================================

export class MotionObjectClass{
    arr:MotionObjectClass[]=[];
    object: MotionObjectType;
    nextClass:MotionObjectClass|undefined;
    prevClass:MotionObjectClass|undefined;
    private _pos1:number=0;
    constructor(object:MotionObjectType) {
        this.object = object;
        this._pos1 = object.pos;
    }
    public get pos1(): number {
        return this._pos1;
    }
    
    public get posComplete(): boolean {
        // if(this.object.excluded) return this.object.excluded;
        // return false;
        if(this.object.posComplete) return this.object.posComplete;
        return false;
    }
    

    public set posComplete(value: boolean) {
        this.object.posComplete = value;
        if(this._machineObj&&this._setMachineHook)this._setMachineHook({...this._machineObj})
    }

    public get excluded(): boolean {
        if(this.object.excluded) return this.object.excluded;
        return false;
    }
    public set excluded(value: boolean) {
        this.object.excluded = value;
        if(this._machineObj&&this._setMachineHook)this._setMachineHook({...this._machineObj})
    }
    
    
    private _setMachineHook: ((m: MachineType) => void)|undefined;

    private _machineObj: MachineType|undefined;
    
    public set machineObj(value: MachineType) {
        this._machineObj = value;
    }
    
    public set setMachineHook(value: ((m: MachineType) => void)) {
        this._setMachineHook = value;
    }

    
    public get maxSupposedPos(): number {
        return this.object.maxSupposedPos;
    }
    public link(arr:MotionObjectClass[]){
        this.arr = arr;
        if(this.index>0 && this.index<arr.length){
            this.prevClass = arr[this.index-1];
        }
        if(this.index<arr.length-1){
            this.nextClass = arr[this.index+1];
        } 
    }

    public get index(): number {
        if(!this.arr){
            alert(`${this.name} has no array`)
            return -1;
        }
        let indx = this.arr.indexOf(this);
        if(indx<0){
            alert(`${this.name} index error`)
        }
        return indx;
    }
    
    public get name(): string {
        return this.object.name;
    }

    public get width(): number {
        return this.object.width;
    }
    public get minPos(): number {
        let minPos1:number = 1000;
        if(this.object.minPos) 
            minPos1 = this.object.minPos;
        let minPos2:number = 1000;
        if(this.prevClass)
            minPos2 = this.prevClass.pos +this.width;
        if((minPos1==1000)&&(minPos2==1000))
            alert(`${this.name} min Pos undefined`)
        if(minPos1 == 1000) return minPos2;
        if(minPos2 == 1000) return minPos1;
        return Math.max(minPos1,minPos2);            
    }
    public get maxPos(): number {
        let maxPos1:number = 0; 
        if(this.object.maxPos) maxPos1 = this.object.maxPos; 
        let maxPos2:number = 0;
        if(this.nextClass)
            maxPos2 = this.nextClass.pos -this.width;
        if((maxPos1==0)&&(maxPos2==0))
            alert(`${this.name} max Pos undefined`)
        if(maxPos1==0) return maxPos2;
        if(maxPos2==0) return maxPos1;
        if(maxPos1<maxPos2) return maxPos1; 
        return Math.min(maxPos1,maxPos2)
        
    }
    

    public get atHome(): boolean {
        return this.pos == this.pos1;
    }
    public get pos(): number {

        return this.object.pos;

    }
    public set pos(value: number){
        // if(value<this.minPos) {
        //     alert(`${this.name} minPos Exeeded ${value}`);
        //     return;
        // }
        // if(value>this.maxPos){
        //     alert(`${this.name} maxPos Exeeded ${value}`);
        //     return;
        // }
        this.object.pos = value 
        if(this._machineObj&&this._setMachineHook)this._setMachineHook({...this._machineObj}) 
    }
    home(){
        this.posComplete = false;
        this.excluded = false;
        // if(this.atHome) return;
        this.object.pos = this.object.pos1;
        if(this._machineObj&&this._setMachineHook)this._setMachineHook({...this._machineObj});
    }
    jogL(){
        this.pos = this.pos-1;
    }
    jogR(){
        this.pos = this.pos+1;
    }

    validPos(nPos:number):boolean{
        return (nPos<this.maxPos)&&(nPos>this.minPos);
    }
    moveTo(nPos:number){
        if(!this.validPos(nPos)){ throw `${this.name} postion invalid ${nPos} min=${this.minPos} max=${this.maxPos}`;}
        else{
            this.object.pos = nPos; 
            if(this._machineObj&&this._setMachineHook)this._setMachineHook({...this._machineObj})
        }
    }
    checkExcluded(pos:number){
        this.excluded = (pos>this.maxPos);
        
    }
    // forceMove(nPos:number){
    //     if(this.validPos(nPos)){
    //         this.pos = nPos;
    //         return;
    //     }
    //     const nextClass:MotionObjectClass|undefined= this.nextClass;
    //     if(!nextClass){ 
    //         throw `${this.name} final position`
    //     }
    //     try {
    //         nextClass.forceMove(nPos+this.width);
    //         if(nPos<this.maxSupposedPos){
    //             this.object.pos = nPos; 
    //             if(this._machineObj&&this._setMachineHook)this._setMachineHook({...this._machineObj}) 
    //         }
             
    //     } 
    //     catch (e) {throw e;}
    // }
}
//========================================================================================================
export class MachineClass {
    obj:MachineType;
    knivesTop:number = 20;
    width:number = 274;
    knives:MotionObjectClass[]= [];
    crisers:MotionObjectClass[]= [];
    private _setMachineHook: ((m: MachineType) => void)|undefined;
    public set setMachineHook(value: ((m: MachineType) => void)) {
        this._setMachineHook = value;
        this.knives.forEach(k => {
            k.setMachineHook = value;
        });
        this.crisers.forEach(c => {
            c.setMachineHook = value;
        });
    }
    constructor(obj:MachineType) {
        this.obj = obj;
        obj.knives.forEach(k=>{
            this.knives.push(new MotionObjectClass(k));
        })
        this.knives.forEach(k=>{
            k.link(this.knives)
            k.machineObj = this.obj;
        })
        obj.crisers.forEach(c=>{
            this.crisers.push(new MotionObjectClass(c));
        })
        this.crisers.forEach(c=>{
            c.link(this.crisers);
            c.machineObj = this.obj;
        })
    }
    public get rollWidth(): number {
        return this.obj.workorder.rollWidth;
    }
   
    public set rollWidth(value: number) {
        this.obj.workorder.rollWidth = value;
        if(this._setMachineHook)this._setMachineHook({...this.obj})
    }
    home(){
        for(let i=0;i<this.knives.length;i++){
            this.knives[i].home();
        }
        for(let i=0;i<this.knives.length;i++){
            this.crisers[i].home();
        }
        if(this._setMachineHook)this._setMachineHook({...this.obj})
    }
    moveAllRight(){
        moveRightUntilIndex(0,this.knives);
        moveRightUntilIndex(0,this.crisers);
    }
    
}
//========================================================================================================
interface MotionObjDivProps{
    factor:number;
    obj:MotionObjectType;
}
//--------------------------------------------------------------------------------------------------------
export function MotionObjDiv({obj,factor}:MotionObjDivProps){
    let clr:string = obj.name.startsWith('K')?'#0F0':'#FF0';
    if(obj.excluded) clr = '#F00';
    return(
        <div
        key ={obj.name}
        style={{
            position:'absolute',
            background:clr,
            width:obj.width*factor,
            height:80,
            left:obj.pos*factor,
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
            {!obj.posComplete&&<small>{obj.pos}</small>}
            {obj.posComplete&&<small><b>{obj.pos}</b></small>}
            {obj.pos1&&<small className="text-primary"><b>{obj.pos-obj.pos1}</b></small>}
            
        </div>
    )
}
//========================================================================================================
interface MachineDivProps{
    factor:number;
    machine:MachineType;
}
//--------------------------------------------------------------------------------------------------------
export function MachineDiv({machine,factor}:MachineDivProps){
    return(
        <div
          style={{
            position:'absolute',
                background:'#EEE',
                width:machine.width*factor,
                height:200,
                top:400,
            }}
        >
            <Roll machine={machine} factor={factor}/>
            {machine.knives.map(k=><MotionObjDiv obj={k} factor={factor}/>)}
            {machine.crisers.map(c=><MotionObjDiv obj={c} factor={factor}/>)}
        </div>
    )

}
//========================================================================================================
