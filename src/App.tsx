import './App.css';
import { IconButton, TextField } from "@mui/material";
import { MachineClass, MachineDiv, MachineType } from './components/machineClass';
import { useEffect, useState } from 'react';
import {OpenWith,Home, CameraRoll, ListAlt, Approval, Architecture, AlignHorizontalRight, Download, OtherHouses, ThumbUpOffAlt} from '@mui/icons-material'
import { JogToolBar } from './components/jogToolBar';
import { OrderToolBar } from './components/orderToolBar';
import { applyOrder, handleOrder } from './components/Roll';
import macSettings from './machinesettings.json';
import http from './components/connection';
const defMachine:MachineType=macSettings; 
// {
//   width: 2740,
//   workorder:{
//     rollWidth:1350,
//     cuts:[],
//     crises:[],
//     error:false,
//     orders:[{cnt:3,wl1:100,h:200,wl2:100}],
//   },
//   knives: [
//     {name:'K1',pos1:230,width:160,pos:230,minPos:230,maxSupposedPos:1210},
//     {name:'K2',pos1:390,width:160,pos:390,maxSupposedPos:1370},
//     {name:'K3',pos1:550,width:160,pos:550,maxPos:1530,maxSupposedPos:1530},
//     {name:'K4',pos1:1410,width:160,pos:1410,minPos:1410,maxSupposedPos:2190},
//     {name:'K5',pos1:1570,width:160,pos:1570,maxSupposedPos:2350},
//     {name:'K6',pos1:1730,width:160,pos:1730,maxPos:2510,maxSupposedPos:2510},
//   ],
//   crisers: [
//     {name:'C1',pos1:130,width:130,pos:130,minPos:130,maxSupposedPos:650},
//     {name:'C2',pos1:260,width:130,pos:260,maxSupposedPos:780},
//     {name:'C3',pos1:390,width:130,pos:390,maxSupposedPos:910},
//     {name:'C4',pos1:520,width:130,pos:520,maxSupposedPos:1040},
//     {name:'C5',pos1:650,width:130,pos:650,maxPos:1200,maxSupposedPos:1200},
//     {name:'C6',pos1:1050,width:130,pos:1050,minPos:1050,maxSupposedPos:2090},
//     {name:'C7',pos1:1180,width:130,pos:1180,maxSupposedPos:2220},
//     {name:'C8',pos1:1310,width:130,pos:1310,maxSupposedPos:2350},
//     {name:'C9',pos1:1440,width:130,pos:1440,maxSupposedPos:2480},
//     {name:'C10',pos1:1570,width:130,pos:1570,maxPos:2610,maxSupposedPos:2610},
//   ]
// }

function App() {
  const [machine,setMachine] = useState<MachineType>(defMachine)
  const [showJog,setShowJog] = useState(false);
  const [showOrder,setShowOrder] = useState(false);
  const [errorOrder,setErrorOrder] = useState(0);  
  const [displayComm,setDisplayComm] = useState(false);  
  const machineClass:MachineClass = new MachineClass(machine);
  machineClass.setMachineHook = setMachine;
  return (
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
      <MachineDiv machine={machine} factor={0.5}/>
      
    </div>
  )
}

export default App;