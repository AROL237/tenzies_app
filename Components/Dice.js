import React from 'react'

export default function Dice({ value, isHeld, holdDice, id, className }) {
    // const style = {
    //     backgroundColor: isHeld ? "#86FFD0" : 'white'
    // }
    return (
        <div
            className={`p-2 rounded-sm shadow-xl relative ${isHeld ? "bg-green-300" : "bg-slate-100"} w-11 h-11 hover:cursor-pointer ${className}`}
            // style={style}
            onClick={holdDice}
        >
            <div className='font-bold  text-black text-center  '>
                {value}
            </div>
        </div>
    )
}
