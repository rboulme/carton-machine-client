import { IconButton, TextField } from "@mui/material";
import { MachineClass, MotionObjectClass } from "./machineClass"
import {ArrowBackIos,ArrowForwardIos, SaveAlt} from '@mui/icons-material'
import { useState } from "react";
//========================================================================================================
interface JogPanelProps{
    motionClass:MotionObjectClass;
}
//--------------------------------------------------------------------------------------------------------
function JogPanel({motionClass}:JogPanelProps){
    return(
        <div
            key={motionClass.name}
            className="border border-primary m-1"
            style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center'
            }}
        >
            <span >{motionClass.name}</span>
            <div
            style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
            }}
            >
                <IconButton
                    color="primary"

                    onClick={()=>{motionClass.jogL()}}
                >
                    <ArrowBackIos/>
                </IconButton>
                <span>{motionClass.pos}</span>

                <IconButton
                    color="primary"
                    onClick={()=>{motionClass.jogR()}}
                >
                    <ArrowForwardIos/>
                </IconButton>
            </div>
            <div
                style={{
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    justifyContent:'center'
                }}
            >
                <TextField
                    className="m-1"
                    type={'number'}
                    value={motionClass.pos}
                    onChange={(e)=>{
                        motionClass.pos = parseInt(e.target.value);
                    }}
                >
                </TextField>
                
            </div>
        </div>
    )
}
//========================================================================================================
interface JogToolBarProps{
    machine:MachineClass;    
}
//--------------------------------------------------------------------------------------------------------
export function JogToolBar({machine}:JogToolBarProps){

    return(
        <div>
            <div
                style={{
                    display:'flex'
                }}
            >
                {machine.knives.map(k=>(<JogPanel motionClass={k}/>))}
            </div>

            <div
                style={{
                    display:'flex'
                }}
            >
                {machine.crisers.map(c=>(<JogPanel motionClass={c}/>))}
            </div>
        </div>
    )
}
//========================================================================================================