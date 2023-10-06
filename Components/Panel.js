import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react'
import Dice from './Dice';
import Confetti from 'react-confetti'
import Button from './Button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

import { data } from 'autoprefixer';


export default function Panel() {
    var duration = require('dayjs/plugin/duration')
    dayjs.extend(duration)
    const gameData = "tenziesData"
    const [setting, setSetting] = useState({
        "sound": true, pause: false
    })
    const [pauseTime, setPauseTime] = useState({
        startTime: 0, endTime: 0
    })
    const [gameRecord, setGameRecord] = useState({})
    const [allNewDice, setAllNewDice] = useState(generateNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [error, setError] = useState(null)
    const [allDiceHeld, setAllDiceHeld] = useState(false)
    const [gameDetails, setGameDetails] = useState(
        {
            // r_startTime: null,
            rollNo: 0,
            timeElaps: 0,
        }
    )

    const [celebration, setCelebration] = useState(false)
    const [cancelGame, setCancelGame] = useState(false)
    const [begin, setBegin] = useState(false)
    const [startTime, setStartTime] = useState({})

    const [timeElaps, setTimeElaps] = useState({})
    // let { width, height } = window.screen

    //next-intl translation 
    const translate = useTranslations("index")

    function generateNewDice() {
        let diceList = []
        for (let i = 0; i < 10; i++) {
            const dice = Math.ceil(Math.random() * 6)
            diceList.push({ value: dice, id: uuidv4(), isHeld: false })
        }
        return diceList;
    }

    function startNewGame() {
        setBegin(prev => !prev)
        setStartTime(dayjs())
        setAllDiceHeld(false)
        setTenzies(false)
        setCelebration(false)
        setAllNewDice(generateNewDice())
        setGameDetails({
            // r_startTime: dayjs(),
            rollNo: 0,
            timeElaps: 0,
        })
    }

    function holdDice(e, id) {
        setAllNewDice(allNewDice => allNewDice.map(item => item.id === id ?
            { ...item, isHeld: !item.isHeld } : item
        ))
        if ((allNewDice.every(pred => pred.isHeld === true))) {
            setTenzies(true)
            setAllDiceHeld(true)
        }

    }
    function rollDice() {
        if (allNewDice.every(pred => pred.isHeld === true && (allNewDice.every(pred => pred.value === allNewDice[0].value)))) {
            setTenzies(true)
        }
        else {
            let list = allNewDice.filter(pred => pred.isHeld === true);
            if (list.every(pred => pred.value === list[0].value)) {
                setGameDetails(gameDetails => (
                    {
                        ...gameDetails,
                        rollNo: gameDetails.rollNo + 1,
                    }
                ))
                let newDice = generateNewDice()
                setAllNewDice(allNewDice => allNewDice.map((item, index) => {
                    return item.isHeld === true ? item : newDice[index]

                }))
                setting.sound ? playSound("Dice_Sound.mp3") : ''
            }
            else {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 3000);

            }
        }
    }
    const playSound = (src) => {
        const audio = new Audio(src)
        audio.play()
    }
    const endGame = (e) => {
        setBegin(false)
        let data = JSON.parse(localStorage.getItem(gameData))

        if (data !== null) {
            if (gameDetails.timeElaps < data.bestTime) {
                //verify if best record score is won 
                //then show confetti
                setCelebration(true)
                playSound("Fireworks.mp3")
                localStorage.setItem(gameData,
                    JSON.stringify({
                        bestTime: gameDetails.timeElaps,
                        rollNo: gameDetails.rollNo
                    })
                )
            }
            else
                alert(translate("game_failed"))

        }
        else {
            setCelebration(true)
            playSound("Fireworks.mp3")
            localStorage.setItem(gameData,
                JSON.stringify({
                    bestTime: gameDetails.timeElaps,
                    rollNo: gameDetails.rollNo
                })
            )
        }
    }
    const discardRecord = (e) => {
        e.preventDefault()
        localStorage.removeItem(gameData)
        setGameRecord({})
    }
    const reset = () => {
        setGameDetails((gameDetails) => ({
            ...gameDetails,
            rollNo: 0, timeElaps: 0
        }))
    }
    const cancel = (e) => {
        e.preventDefault()
        setCancelGame(true)
        setBegin(false)
        reset()

    }

    // pause Function to add pause functionality to game
    //todo: on progress.
    const pauseGame = (e) => {
        e.preventDefault()
        if (begin) {
            if (setting.pause === false) {
                setSetting((setting) => ({ ...setting, pause: !setting.pause }))
            }
            else {
                let p_time = dayjs(dayjs.duration())
                dayjs(dayjs.duration())

                setGameDetails((prev) => ({
                    ...pred,
                    r_startTime: dayjs()
                }))
                setSetting((setting) => ({ ...setting, pause: !setting.pause }))
            }
        }
    }
    const isSound = (e) => {
        e.preventDefault()
        setSetting(prev => ({ ...prev, sound: !prev.sound }))
    }

    useEffect(() => {
        setGameRecord(JSON.parse(localStorage.getItem(gameData)) || {})
        const timer = () => {
            setTimeout(() => {
                // let startTime = gameDetails.r_startTime
                let time = dayjs.duration(dayjs().diff(startTime)).asMilliseconds()
                // if (setting.pause === false) 
                setGameDetails(gameDetails => {

                    return {
                        ...gameDetails,
                        timeElaps: time
                    }
                })


            }, 1000);
        }
        if (begin)
            timer()
        return () => {
            return (allDiceHeld === true || cancelGame === true) && timer
        }
    }, [begin, gameDetails.timeElaps, allDiceHeld, setting.pause])

    useEffect(() => {
        const record = JSON.parse(localStorage.getItem(gameData))
        setGameRecord(record !== null ? record : {})

    }, [])

    useEffect(() => {
        if (allNewDice.every(pred => pred.isHeld === true) && allNewDice.every(pred => pred.value === allNewDice[0].value)) {
            setTenzies(true)
        }
    }, [allNewDice])
    return (

        <div className=' w-auto mx-auto h-full p-3'>

            {
                celebration && <Confetti />

            }
            {
                error && <div id='erro-section'
                    className={` max-w-sm absolute duration-1000 delay-
                            bottom-0 right-0 p-3 flex flex-row tran gap-2 border  border-t-4 border-red-600 bg-slate-100 shadow-md text-red-500 rounded-md m-3 `}
                >
                    <div className=' rounded-full'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="w-6 h-6   shadow-inner shadow-red-300  rounded-full ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div className=' text-slate-900 text-sm '>
                        {translate("error_message")}
                    </div>
                </div>
            }
            <div className=' flex flex-col gap-x-2 gap-y-10 justify-center align-middle content-center container max-w-5xl mx-auto  py-10 px-5 rounded-md bg-slate-200'>

                <div className='w-full  row-span-full mx-auto'>
                    <h6 className='text-slate-800 font-extrabold mx-auto text-center text-3xl uppercase'>
                        {translate("name")}
                    </h6>

                </div>
                <div className=' m-auto md:max-w-xl'>
                    <div className='p-5 flex flex-row gap-3 flex-nowrap  mx-auto text-slate-800 bg-slate-100 shadow-sm border-t-purple-300 border-t-4 shadow-purple-100 rounded-md '>
                        <div className=''>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                className="w-6 h-6 text-purple-700 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>

                        </div>
                        <div className='tracking-wider  text-sm max-w-3xl font-medium '>
                            {translate("objective")}
                        </div>
                    </div>
                </div>
                <div className=' mx-auto  flex flex-col gap-4  md:flex md:flex-row md:gap-4  '>
                    <div className='select-none mx-auto w-fit p-7 h-fit shadow-md rounded-xl border-purple-200 border capitalize flex flex-col  gap-3 text-sm  text-slate-600'>
                        <div className=' flex flex-row p-2 content-center text-sm gap-6  '>
                            <div onClick={isSound}>
                                <div className='text-teal-600   whitespace-nowrap'>
                                    {
                                        setting.sound ?
                                            (
                                                <div title={translate("sound")}>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                                                        className="w-6 h-6 text-purple-600 hover:cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5  hover:text-purple-400" >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                                    </svg>

                                                </div>
                                            )
                                            : (
                                                <div title={translate("muted")}>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                                                        className="w-6 h-6 text-red-600 hover:cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5  hover:text-red-400 ">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                                                    </svg>
                                                </div>
                                            )}
                                </div>
                            </div>
                            {/* add pause functionality to game */}
                            {/* <div onClick={pauseGame}
                                className={` ${begin ? "active:translate-y-0.5 hover:-translate-y-0.5 " : ""}`}
                            >
                                {
                                    setting.pause ?
                                        <div title={translate('resume')} >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                                                className={`w-6 h-6 text-lg ${begin ? "text-green-600 hover:cursor-pointer hover:text-green-400" : "text-gray-400"}  `}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                            </svg>
                                        </div>
                                        :
                                        <div title={translate('pause')} >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                strokeWidth={2} stroke="currentColor"
                                                className={`w-6 h-6  ${begin ? "text-purple-600" : "text-gray-400"} hover:cursor-pointer`}  >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                            </svg>
                                        </div>

                                }
                            </div> */}
                        </div>
                        <div className=' flex flex-row p-2 content-center text-sm gap-4  '>
                            <div>
                                <label className=''>{translate('rolls')}:
                                    <span className='text-teal-600  whitespace-nowrap'> {gameDetails.rollNo || '0'}</span>
                                </label>
                            </div>
                            <div>
                                <label className=''>{translate("time")}:
                                    <span className={`text-teal-600  pl-1 ${(gameDetails.timeElaps) > gameRecord.bestTime ? "transform  animation-bling text-red-400" : ""}`}>
                                        {
                                            dayjs.duration(gameDetails.timeElaps, 'milliseconds').format('mm:ss')
                                        }
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className='p-2 gap-4 flex flex-row'>
                            <div className='whitespace-nowrap'>{translate("best_time")}:
                                <span className='text-teal-600  whitespace-nowrap'> {gameRecord.bestTime ?
                                    dayjs.duration(gameRecord.bestTime, 'milliseconds').format("mm:ss") : ' '}</span>
                            </div>
                            <div className=''>{translate("rolls")}:
                                <span className='text-teal-600  whitespace-nowrap'> {gameRecord.rollNo}</span>
                            </div>
                        </div>
                    </div>
                    {
                        < div className='relative select-none m-auto'>
                            {
                                setting.pause && <div className='absolute  z-40 w-72 h-48 rounded-md  backdrop-blur-sm m-auto '>
                                    <div
                                        title={translate('resume')}
                                        onClick={pauseGame}
                                        className='m=auto hover:cursor-pointer w-fit m-auto content-center align-middle justify-center  translate-y-3/4'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            strokeWidth={3.5} stroke="currentColor"
                                            className="w-10 h-10 m-auto  text-red-500 ">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                        </svg>
                                    </div>
                                </div>
                            }
                            <div className='  m-auto w-full align-middle justify-center gap-5'>
                                <div className=' mx-auto p-2 w-full text-center content-center justify-center items-center align-middle'>
                                    {
                                        begin ?
                                            <div className=' flex flex-col gap-5  '>
                                                <div className='grid grid-cols-5 gap-3 max-w-fit content-center justify-center align-middle m-auto '>
                                                    {
                                                        allNewDice.length > 0 && allNewDice.map((item) => {
                                                            return (<Dice
                                                                value={item.value}
                                                                isHeld={item.isHeld}
                                                                key={item.id}
                                                                className={" hover:-translate-y-0.5 active:translate-y-0.5"}
                                                                id={item.id}
                                                                holdDice={(e) => (holdDice(e, item.id))}
                                                            />
                                                            )

                                                        })

                                                    }
                                                </div>
                                                <div className='card-actions mx-auto w-full'>
                                                    {
                                                        !tenzies ?
                                                            <div className='mx-auto flex flex-row gap-3'>
                                                                <Button
                                                                    text={translate('toss')}
                                                                    action={rollDice}
                                                                    className={"text-xs bg-purple-500 hover:bg-purple-400 active:bg-purple-700"}
                                                                />
                                                                <Button
                                                                    text={translate("cancel")}
                                                                    action={cancel}
                                                                    className={"bg-red-500 hover:bg-red-400 active:bg-red-600 text-xs"}
                                                                />
                                                            </div>
                                                            : <Button
                                                                text={translate('end_game')}
                                                                action={endGame}
                                                                className={"text-xs bg-purple-500 hover:bg-purple-400 active:bg-purple-700"}
                                                            />
                                                    }
                                                </div>
                                            </div>

                                            :
                                            <div
                                                className=' flex flex-row w-full mx-auto gap-3 align-middle justify-center content-center'>

                                                <Button
                                                    action={startNewGame}
                                                    text={translate('begin')}
                                                    className='bg-purple-500 text-xs hover:bg-purple-400 active:bg-purple-700'
                                                />
                                                <Button
                                                    action={discardRecord}
                                                    text={translate('reset')}
                                                    className={"text-xs bg-red-500 active:bg-red-700 hover:bg-red-400  "}

                                                />
                                            </div>
                                    }


                                </div>
                            </div >

                        </div>}
                </div>
            </div>
        </div >

    )

}





