import { TouchableOpacity } from "react-native-gesture-handler"
import {View,StyleSheet,Text} from 'react-native'
import React from "react"
import {useEffect} from 'react';

interface PrimaryYearPicker{
    primaryStyle:any,
    onPressSelectButton:any,
    onPressCancelButton:any,
    primaryText:any,
    primaryTextStyle:any,
    primaryTitle:any
    primarySubTitle:any



}
const PrimaryYearButton:React.FC<PrimaryYearPicker>=props=>{
    useEffect(()=>{
        console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    },[])
    return(
    <View style={Styles.containerMainView}>
        <Text Style={Styles.primarytitlestyle}>{props.primaryTitle}</Text>

    </View>
    )
}
export default PrimaryYearButton
const Styles = StyleSheet.create({
    ContainerMainView:{
        flex:1,
        backgroundColor:"blue",
        color
        

    },
    primarytitlestyle:{
        fontSize:30
    }

})