// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// const Testing = () => {
//   const [minutes, setMinutes] = useState(1);
//   const [seconds, setSeconds] = useState(0);

//   useEffect(() => {
//     const myInterval = setInterval(() => {
//       if (seconds > 0) {
//         setSeconds(seconds - 1)
//       }
//       if (seconds === 0) {
//         if (minutes === 0) {
//           clearInterval(myInterval)
//         } else {
//           setMinutes(minutes - 1)
//           setSeconds(59)
//         }
//       }
//     }, 1000)

//     return () => {
//       clearInterval(myInterval)
//     };
//   }, [seconds])

//   const clearInterval = () => {
//     const myInterval = setInterval(() => {
//       if (seconds > 0) {
//         setSeconds(seconds - 1)
//       }
//       if (seconds === 0) {
//         if (minutes === 0) {
//           clearInterval(myInterval)
//         } else {
//           setMinutes(minutes - 1)
//           setSeconds(59)
//         }
//       }
//     }, 1000)
//     clearInterval(myInterval)
//   }



//   return (
//     <View>
//       <Text>Testing</Text>

//       {minutes === 0 && seconds === 0
//         ? <Text>Busted!</Text>
//         : <Text>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>
//       }

//     </View>
//   )
// }

// export default Testing

// const styles = StyleSheet.create({})

// create a new component called Timer with a state of minutes and seconds and ends after 1 minute


// create a new component called Timer with a state of seconds and ends after 1 minute use useRef to store the interval





// import React, { useEffect, useRef, useState } from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';

// const Timer = () => {

//   const [seconds, setSeconds] = useState(59);

//   const intervalRef = useRef<any>(null);

//   const start = () => {
//     if (intervalRef.current !== null) return;

//     intervalRef.current = setInterval(() => {
//       setSeconds((seconds) => seconds - 1);
//     }, 1000);
//   };

//   const stop = () => {
//     if (intervalRef.current === null) return;
//     clearInterval(intervalRef.current);
//     intervalRef.current = null;
//   };

//   useEffect(() => {
//     if (seconds === 0) {
//       stop();
//     }
//   }, [seconds]);


//   return (
//     <View>
//       <Text>Timer</Text>
//       <Text>Seconds: {seconds}</Text>
//       <TouchableOpacity onPress={start}><Text>Start</Text></TouchableOpacity>
//       <TouchableOpacity onPress={stop}><Text>Stop</Text></TouchableOpacity>
//     </View>
//   )
// }

// export default Timer



import React, { useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Testing = () => {
  const [seconds, setSeconds] = useState(60)
  const interval = useRef<any>(null)

  const onPressCreateTimer = () => {
    if (interval) {
      clearInterval(interval.current)
    }
    interval.current = setInterval(() => {
      setSeconds((state) => {
        if (state === 1) {
          clearInterval(interval.current)
          //callback
        }
        return state - 1
      })
    }, 1000);
  }

  const getTime = (seconds: any) => {
    let minutes: any = Math.floor(seconds / 60);
    let extraSeconds: any = seconds % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
    return `${minutes}:${extraSeconds}`;
  }

  const strTimer = getTime(seconds)

  return (
    <View>
      <Text>Testing {strTimer}</Text>
      <TouchableOpacity onPress={onPressCreateTimer}><Text>Start</Text></TouchableOpacity>
    </View>
  )
}

export default Testing

const styles = StyleSheet.create({})
