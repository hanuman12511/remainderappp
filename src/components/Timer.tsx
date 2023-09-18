// create a timer component with a start and stop flag and a on success callback and takes a time in seconds as a prop and calculates the time left in seconds and minutes and displays it in a text component


// src/components/Timer.tsx
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { Fonts } from '../themes'
import { moderateScale } from '../utils/ScalingUtils'

interface Props {
    time: number,
    onSuccess: () => void,
    start: boolean,
    stop: boolean
}

export const Timer = ({ time, onSuccess, start, stop }: Props) => {
    const [timeLeft, setTimeLeft] = useState(0)

    const intervalRef = React.useRef<any>(0)

    useEffect(() => {
        if (start) {
            setTimeLeft(time)
        }
    }, [start, time]);

    useEffect(() => {
        if (start) {
            console.log("intervalRef", start)
            intervalRef.current = setInterval(() => {
                setTimeLeft((state) => {
                    if (state > 0) {
                        return state - 1
                    } else {
                        clearInterval(intervalRef.current)
                        onSuccess()
                        return 0
                    }
                })
            }, 1010)
        }
        return () => clearInterval(intervalRef.current)
    }, [start])

    return (
        <Text style={{
            alignSelf: 'center',
            color: timeLeft === 0 ? 'red' : 'black',
            fontFamily: Fonts.FONT_FAMILY_BOLD,
            fontSize: moderateScale(16)
        }}>
            0{Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? "0" + timeLeft : timeLeft}</Text>
    )
}