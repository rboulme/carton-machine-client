import { IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { MachineClass, MachineType } from "./machineClass";
import {AddCircleOutline, RemoveCircleOutline} from '@mui/icons-material'


export type  WorkOrderType ={
  rollWidth:number,
  orders:OrderInputType[],
  cuts:number[],
  crises:number[],
  error:boolean,
}

export type OrderInputType = {
    // index:number,
    cnt:number,
    wl1:number,
    wl2:number,
    h:number,    
}
//===============================================================================================================
interface OrderInputProps{
    machine:MachineType;
    setMachine:(m:MachineType)=>void;
    obj:OrderInputType;
}
//--------------------------------------------------------------------------------------------------------------
export function OrderInput({machine,obj,setMachine}:OrderInputProps){


    
    const [_cnt,set_cnt] = useState(obj.cnt);
    const [_wl1,set_wl1] = useState(obj.wl1);
    const [_wl2,set_wl2] = useState(obj.wl2);
    const [_h,set_h] = useState(obj.h);
    const orders:OrderInputType[] = machine.workorder.orders;
  
    const index = orders.indexOf(obj)+1;

    useEffect(()=>{
      set_cnt(obj.cnt);
      set_wl1(obj.wl1);
      set_wl2(obj.wl2);
      set_h(obj.h);
    },[obj])
    return(
        <div
          className="m-2"
            style={{
              display:'flex',
              alignItems:'center',
            }}
          >
              <TextField
                style={{width:50}}
                variant={'standard'}
                className='mx-1'
                label='#'
                disabled
                value={index}
                
              />
              <TextField
                  className='mx-1'
                  label= {`Cnt`}
                  type='number'
                  value={_cnt}
                  onChange = {(e)=>{
                    set_cnt(parseInt(e.target.value))
                    obj.cnt = parseInt(e.target.value)

                    setMachine({...machine})
                  }}
                />
                <TextField
                  className='mx-1'
                  label= {`W/2 `}
                  type='number'
                  value={_wl1}
                  onChange = {(e)=>{
                    set_wl1(parseInt(e.target.value))
                    obj.wl1 = parseInt(e.target.value)
                    setMachine({...machine})
                  }}
                />
                <TextField
                  className='x-1'
                  label= {`H`}
                  type='number'
                  value={_h}
                  onChange = {(e)=>{
                    set_h(parseInt(e.target.value))
                    obj.h = parseInt(e.target.value)
                    setMachine({...machine})
                  }}
                />
                <TextField
                  className='mx-1'
                  label= {`W/2 `}
                  type='number'
                  value={_wl2}
                  onChange = {(e)=>{
                    set_wl2(parseInt(e.target.value))
                    obj.wl2 = parseInt(e.target.value)
                    setMachine({...machine})
                  }}
                />
                <span className="mx-1">{_wl1+_wl2+_h}</span>
                <IconButton
                  className="mx-1"
                  color="primary"
                  onClick={()=>{
                    const newOrder:OrderInputType = {
                      cnt: 1,
                      wl1: 0,
                      wl2: 0,
                      h: 0
                    };
                    machine.workorder.orders = [newOrder,...machine.workorder.orders];
                    setMachine({...machine})
                  }}
                >
                  <AddCircleOutline/>
                </IconButton>
                {(orders.length>1)&&<IconButton
                  className="mx-1"
                  color="error"
                  onClick={()=>{
                    machine.workorder.orders = machine.workorder.orders.filter(o=>o!==obj)
                    setMachine({...machine})
                  }}
                >
                  <RemoveCircleOutline/>
                </IconButton>}
          </div>
    )
}
//===================================================================================================
interface OrderToolBarProps{
  machine:MachineType;
  setMachine:(m:MachineType)=>void;
}
//--------------------------------------------------------------------------------------------------------------
export function OrderToolBar({machine,setMachine}:OrderToolBarProps){
  return(
    <div
      className="m-1"
      style={{
        maxHeight:250,
        overflowY:'scroll',
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'center',
      }}
    >
      
      {
        machine.workorder.orders.map(o=>(
          <OrderInput key={machine.workorder.orders.indexOf(o)} machine={machine} setMachine = {setMachine} obj={o}/>
        ))
      }

    </div>
  )
}