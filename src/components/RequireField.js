import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { getScreenWidth } from '../utils/Common'
function RequireField(){
    return(<Text  style={styles.require}>{'*'}</Text>)
}

export default RequireField

const styles = StyleSheet.create({

    require:{
        color:'red',
        fontSize:20,
        marginLeft:getScreenWidth(1)
    },

})