
import React, { memo, useState } from 'react';
import {View,Text,StyleSheet,Image} from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import { getScreenWidth } from '../utils/Common';
import {Fonts} from '../assets/fonts'
import { colors } from '../assets/colors';
import RequireField from './RequireField';
import Images from '../assets/images';
function PrimaryDropdown(props){
   
    const [isFocus, setIsFocus] = useState(false);
console.log(props)
    return(
        <View style={styles.container}>
        <View style={[styles.layoutstyle]}>
            <View style={styles.textfield}>
            <Text style={[props.textstyle,styles.commanstyle]}>
                {props.title}
            </Text>
            {RequireField()}
            </View>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={props.Data}
         /*  search */
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? props.selecttype : '...'}
         /*  searchPlaceholder="Search..." */
          value={props.type}
        onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
          
           props.selectType(item.value);
           setIsFocus(false);
          }}
        renderRightIcon={() => (
          <Image source={isFocus?Images.arrowup:Images.arrowdown} style={styles.arrawiconeimage}/>
          
          )} 
        />
        </View>
        </View>
    )
}
export default memo(PrimaryDropdown)
const styles = StyleSheet.create({
    container:{
       flex: 1,
      },
   
      require:{
        color:'red',
        fontSize:20,
        marginLeft:getScreenWidth(1)
    },
    
    commanstyle:{
        fontSize:16,
        color:colors.black

    },
      textfield:{
        flexDirection:'row',
    alignItems:'center'
    },
      dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 14,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
      lastrenewalimg:{
        borderColor:'red',
        borderRadius:100,
        borderWidth:1,
        width:20,
        height:20
    },
    arrawiconeimage:{
      width:20,
      height:20,
      

    }
})