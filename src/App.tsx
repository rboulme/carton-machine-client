import React from 'react';

import './App.css';
import { IconButton, TextField } from "@mui/material";
import { MachineClass, MachineDiv, MachineType } from './components/machineClass';
import {  useEffect, useState } from 'react';
import {OpenWith,Home, CameraRoll, ListAlt, Approval, Architecture, AlignHorizontalRight, Download, OtherHouses, ThumbUpOffAlt} from '@mui/icons-material'
import { JogToolBar } from './components/jogToolBar';
import { OrderToolBar } from './components/orderToolBar';
import { applyOrder, handleOrder } from './components/Roll';
import macSettings from './machinesettings.json';
import http from './components/connection';
import { ToastContainer } from 'react-toastify';
import { MachineMonitorDiv } from './components/machineMonitor';
const defMachine:MachineType=macSettings;

function App() {
  const [machine,setMachine] = useState<MachineType>(defMachine)
  const [showJog,setShowJog] = useState(false);
  const [showOrder,setShowOrder] = useState(false);
  const [errorOrder,setErrorOrder] = useState(0);  
  const [displayComm,setDisplayComm] = useState(false);
  const [d0Arr,setd0Arr] = useState<any[]>([]);
    
  const machineClass:MachineClass = new MachineClass(machine);
  machineClass.setMachineHook = setMachine;
  // setInterval(async()=>{
  //   d200Arr = await http.readDs(200,50);
  //   console.log('d200Arr',d200Arr); 
  // },1000)
  async function update(){
    console.log('reading');
    const d:any[] = await http.readDs(0,100);
    setd0Arr(d);  
  }

  useEffect(()=>{
    const interval = setInterval(()=>{
      update();
    },1000)
    return ()=>clearInterval(interval)
    
  },[])

  console.log('d0Arr',d0Arr);
  
  return (
    <React.Fragment>
      <ToastContainer/>
    <div
      style={{
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
      }}
    >
      <div
        className='m-2'
        style={{
          display:'flex',
          alignItems:'center',
          justifyContent:'center'
        }}
      >
       <TextField

          type={'number'}
          label="Roll Width"
          value={machineClass.rollWidth}
          onChange={(e)=>{
            machineClass.rollWidth = parseInt(e.target.value)
          }}
        />  
        <IconButton
          color='primary'
          onClick={()=>{
            machineClass.home();
          }}
        >
          <Home/>
        </IconButton>

        <IconButton
          color='primary'
          onClick={()=>{
            machineClass.moveAllRight();
          }}
        >
          <AlignHorizontalRight/>
        </IconButton>

        <IconButton
          color={(showJog)?'secondary':'primary'}
          onClick={()=>{
            setShowJog(!showJog)
          }}
        >
          <OpenWith/>
        </IconButton>

        <IconButton
          color={(showOrder)?'secondary':'primary'}
          onClick={()=>{
            setShowOrder(!showOrder)
          }}
        >
          <ListAlt/>
        </IconButton>

        <IconButton
          color={machine.workorder.error?'error':'primary'}
          onClick={()=>{
            handleOrder(machine,setMachine);
          }}
        >
          <Architecture/>
        </IconButton>
        <IconButton
          disabled={machine.workorder.error}
          color='primary'
          onClick={()=>{
            applyOrder(machineClass,setMachine);
          }}
        >
          <Approval/>
        </IconButton>
        
        <IconButton
          color={(displayComm)?'primary':'secondary'}
          onClick={async()=>{
            let arr:number[] = [];
            machine.knives.forEach(k=>{
              arr.push(k.pos - k.pos1)
            })
            machine.crisers.forEach(c=>{
              arr.push(c.pos - c.pos1)
            })
            machine.knives.forEach(k=>{
              arr.push(k.excluded?1:2)
            })
            machine.crisers.forEach(c=>{
              arr.push(c.excluded?1:2)
            })
           await http.writeDs(200,arr);
          }}
        >
          <Download/>
        </IconButton>

        <IconButton
          color={'secondary'}
          onClick={async()=>{
            await http.writeDs(232,[100,0]);

          }}
        >
          <OtherHouses/>
        </IconButton>

        <IconButton
          color={'secondary'}
          onClick={async()=>{
            await http.writeDs(232,[0,100]);
          }}
        >
          <ThumbUpOffAlt/>
        </IconButton>


      </div>
      
      {showJog&&<JogToolBar machine={machineClass}/>}
      {showOrder&&<OrderToolBar machine={machine} setMachine={setMachine}/>}

      <MachineMonitorDiv machine={machine} factor={0.4} d0Arr={d0Arr}/>
      
      <MachineDiv machine={machine} factor={0.4}/>;
      
    </div>
    </React.Fragment>
  )
}

export default App;