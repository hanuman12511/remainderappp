import React, { useRef, useState } from 'react'

import { Image, StyleSheet,View ,Text, TouchableOpacity} from 'react-native';
import {colors} from '../assets/colors'
import PrimaryDropdown from '../components/PrimaryDropdown';
import { getScreenHeight, getScreenWidth } from '../utils/Common';
import string from '../localization/string';
import PrimaryButton from '../components/PrimaryButton';
import PrimaryInput from '../components/PrimaryInput';
import { isStrEmpty, isValidName, isValidUserName } from '../utils/UtilityFunc';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RequireField from '../components/RequireField';
import DatePicker from 'react-native-date-picker'

import Images from '../assets/images'
const data = [
    { label: 'Vehicle', value: '1' },
    { label: 'License', value: '2' },
  ];
  const data2 = [
    { label: 'Cars', value: '1' },
    { label: 'Buses', value: '2' },
  ];
export default function AddReminder(){
    const[remindertype,setReminderType] = useState(data[0].value)
    const[ vehicletype,setVehicleType] = useState(null)
    const[vehicleregitrationnumber,setVehicleRegitrationNumber] = useState(null)
    const[vehiclename,setVehicleName] = useState(null)
    const[licensetype1,setLicenseType] = useState(null)
    const[licensenumber,setLicenseNumber] = useState(null)
    const [isexpiredate,setIsExpireDate] =useState(false)
    const [isrenewaldate,setIsRenewalDate]=useState(false)
    const [isrenewal,setIsRenewal]=useState(false)
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)


    //ref
    const registrationref=useRef('')
    const vehiclenameref=useRef('')
    
    let reminder={
        title:string.remindertype,
        selectType:setReminderType,
        type:remindertype,
        layoutstyle:styles.layoutViewStyle,
        Data:data,
        textstyle:styles.textstyle,
        isRequire:true,
        selecttype:'Select Type',
      
     
    }
    let vehicle={
        title:string.vehicletype,
        selectType:setVehicleType,
        type:vehicletype,
        layoutstyle:styles.layoutViewStyle,
        Data:data2,
        textstyle:styles.textstyle,
        isRequire:true,
        selecttype:'Select Vehicle Type'
     
    }
    let licensetype={
        title:string.licensetype,
        selectType:setLicenseType,
        type:vehicletype,
        layoutstyle:styles.layoutViewStyle,
        Data:data2,
        textstyle:styles.textstyle,
        isRequire:true,
        selecttype:'Select License Type'
     
    }
    let renewalfrequency={
        title:string.renewalfrequency,
        selectType:setLicenseType,
        type:vehicletype,
        layoutstyle:styles.layoutViewStyle,
        Data:data2,
        textstyle:styles.textstyle,
        isRequire:true,
        selecttype:'Select License Type'
     
    }
    let btndate={
        primaryBtnStyle: styles.onpressbtnstyle,

        onPrimaryButtonPress: onPressReminderSubmit,
        primaryBtnTitleStyle:styles.btntitlestyle,
        primaryBtnTitle: string.btntitle

    }
    let inputregistretion={
        passwordInput: false,
        inputName: string.vehicleregistrationnumber,
        inputIcon: "",
        placeholder: "Enter Vehicle Registration Number",
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{vehicleregitrationnumber},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:true,
        requiref:true,

    }
    let inputvehiclename={
        passwordInput: false,
        inputName: string.vehiclename,
        inputIcon: "",
        placeholder: "Enter Vehicle Name",
        maxLength:15 ,
        refObj:vehiclenameref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{vehiclename},
        onChangeText: VehicleName,
        keyboardType: "",
        editable:true,
        requiref:true,

    }
    let inputlicensenumber={
        passwordInput: false,
        inputName: string.licensenumber,
        inputIcon: "",
        placeholder: "Enter license Number",
        maxLength:6 ,
        refObj:vehiclenameref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{licensenumber},
        onChangeText: LicenseNumber,
        keyboardType: "",
        editable:true,
        requiref:true,

    }

function  LicenseNumber(text){
    setLicenseNumber(text)

}
    function VehicleRegitrationNumber(text){
        setVehicleRegitrationNumber(text)
    }
    function VehicleName(text){
        setVehicleName(text)
    }
    function inputValidation(){
        if(remindertype===null){
         
          console.log("Pls Select Remider Type");
        
        return false
        }
        else if(vehicletype===null){
          
           console.log("pls Select Vahicle type");
        
            return false

        } 

        
        else if(remindertype==1 &&vehicleregitrationnumber===null ||isStrEmpty(vehicleregitrationnumber)){
           
         
            console.log("enter vehicle regitration number");
           
             return false
 
         }
         else if( remindertype==1&&vehicleregitrationnumber&&vehicleregitrationnumber.length<7 ){
           
            console.log("pls enter vehicle regitration number min 7 && max 15");
           
             return false
 
         }
         else if(remindertype===1&&(!isValidName(vehiclename)||vehiclename===null)){

          
            console.log("pls Enter Vahicle name 1 ",vehiclename);
         
             return false
 
         }
         else if(remindertype==1&&vehiclename&&vehiclename.length<4){

          
            console.log("pls Enter Vahicle name min 4 (2)",vehiclename);
         
             return false
 
         }

         else if(remindertype==2&&licensetype===null ){

          
            console.log("pls select license type ",licensetype);
         
             return false
 
         }

         else if(remindertype==2&&(licensenumber===null ||isStrEmpty(licensenumber))){

          
            console.log("pls Enter License Number",licensenumber);
         
             return false
 
         }
         else if(remindertype==2&&licensenumber&& licensenumber.length<6){

          
            console.log("pls Enter License Number max 6",licensenumber);
         
             return false
 
         }
return true
    }
    function onPressReminderSubmit(){
        if(inputValidation()){
       
        let data={
            remindertype,
            vehicletype,
            vehicleregitrationnumber,
            vehiclename,
        }
        console.log('====================================');
        console.log(data);
        console.log('====================================');
       
        }
    }

    function renewalfun(){
        setIsRenewalDate(true)
        setIsExpireDate(false)
        setIsRenewal(true)

    }
    function expirefun(){
        setIsExpireDate(true)
        setIsRenewalDate(false)
        setIsRenewal(false)

    }
    return(<>
    <View style={styles.container}>
        <KeyboardAwareScrollView style={{paddingHorizontal:15}}>    
        <PrimaryDropdown {...reminder}/>
        <PrimaryDropdown {...vehicle}/>
       { remindertype==1&&
       <>
        <PrimaryInput {...inputregistretion}/>
            <PrimaryInput {...inputvehiclename}/>
        </>
        }
       {
        remindertype==2&&
            <>
            <PrimaryDropdown {...licensetype}/>
            <PrimaryInput {...inputlicensenumber}/>
            </>
        }
        <View style={styles.lastrenewalview}>
            <Text style={styles.lastrenewaltext}>Last Renewal Date</Text>
            {RequireField()}
        </View>
        <View style={styles.inlasrenewaldate}>
            <View style={styles.renewalexpired}>
                <TouchableOpacity onPress={()=>renewalfun()}>
                    <Image source={isrenewaldate&& Images.audioOff} style={styles.lastrenewalimg}/>
                </TouchableOpacity>
                <Text style={styles.renewalexpiredtext}>Renewal Date</Text>
            </View>
            <View style={styles.renewalexpired}>

            <TouchableOpacity onPress={()=>expirefun()}>
                    <Image source={isexpiredate&&Images.audioOff} style={styles.lastrenewalimg}/>
                </TouchableOpacity>
                <Text style={styles.renewalexpiredtext}>Expire Date</Text>
            </View>
        </View>
       
        <View style={styles.renewalexpired}>
         <TouchableOpacity onPress={() => setOpen(true)} style={styles.datepicker}>
            <Text style={styles.renewalexpiredtext}>{open?"date":"Select Expire Date"}</Text>
             <Image source={Images.dateicon} style={styles.dateicon}/>
                  
                </TouchableOpacity>
                <DatePicker
                    modal={date}
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                         setOpen(false)
                        setDate(date)
                        }}
                    onCancel={() => {
                    setOpen(false)
                    }}
                    />
            </View>
            <PrimaryDropdown {...licensetype}/>
       <PrimaryButton {...btndate}/>
        </KeyboardAwareScrollView>

        </View> 
        </>

    )
}

const styles =StyleSheet.create({
    container:{
        flex: 1,
       },
    layoutViewStyle:{
        flex: 1,
       /*  backgroundColor:colors.lightpink, */
        borderRadius:getScreenWidth(5),
        paddingHorizontal:getScreenWidth(5)
    },
    textstyle:{
        marginVertical:getScreenHeight(2)
    },
    btntitlestyle:{

    },
    onpressbtnstyle:{
        flex:1,
        backgroundColor:colors.blue100,
      
        padding:getScreenWidth(5),
        borderRadius:getScreenWidth(4),
        alignItems:'center',
        justifyContent:'center',
        marginTop:10
    },
    lastrenewalview:{
        flex:1,
        flexDirection:'row',
        marginVertical:10
    },
    lastrenewaltext:{
        fontSize:18,
        color:colors.black
    },
    lastrenewalimg:{
        borderColor:'red',
        borderRadius:100,
        borderWidth:1,
        width:20,
        height:20
    },
    inlasrenewaldate:{
        flex:1,
        flexDirection:'row'
    },
    renewalexpired:{
        flex:1,
        flexDirection:'row',
       alignItems:'center'
    }
    ,
    renewalexpiredtext:{
        flex:1,
        marginLeft:10
    },
    datepicker:{
        flex:1,
        flexDirection:'row',
        borderRadius:10,
        borderWidth:.5,
        marginVertical:10,
        paddingVertical:15,
        borderColor:'gray',
        alignItems:'center'
    },
    datepickerimg:{
      
        borderRadius:10,
        borderWidth:1,
        width:25,
        height:25,
        marginRight:10,
       

    },
    dateicon:{
       
        width:25,
        height:25,
        marginRight:10,
    }

})