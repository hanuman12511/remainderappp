import React, { useEffect, useRef, useState } from 'react'
import {Text, View,StyleSheet, Image, ScrollView} from 'react-native'
import { PrimaryInput } from '../components'
import string from '../localization/string'
import Images from '../assets/images'
import { colors } from '../assets/colors'
import BuyerRepo from '../data/repo/BuyerRepo'
export default function ReminderDetails(){
    const registrationref =useRef('')
    const[remindertypeid,setReminderTypeId] = useState(0)
    const[remindertype,setReminderType] = useState("")
    const[ vehicletype,setVehicleType] = useState(null)
    const[vehicleregitrationnumber,setVehicleRegitrationNumber] = useState(null)
    const[vehiclename,setVehicleName] = useState(null)
    const[licensetype1,setLicenseType] = useState(null)
    const[licensenumber,setLicenseNumber] = useState(null)
    const[modeluse,serModel] = useState(null)
    const[manuuse,setManufact] = useState(null)
    const[renealdate,setRenewaldate] = useState(null)
    const[renewalfre,setRenewalFre] = useState(null)
    const [isrenewaldate,setIsRenewalDate]=useState(true)



useEffect(()=>{

    showvahicledetails()


},[])

async function showvahicledetails(){

const data ={
    Id:23
}
    const res =await BuyerRepo.remainderDetailsApi(data.Id)
    console.log('====================================')
    console.log(red)
    console.log('====================================')

    setReminderTypeId(2)
setReminderType("Vehicle")
setVehicleType('Cars')
setVehicleRegitrationNumber("74838293")
setVehicleName("HondaCity")
setLicenseType("Haivy")
setLicenseNumber("657656")
serModel("2023")
setManufact("2016")
setRenewaldate("22 Sep 2023")
setRenewalFre("6 Months")

}

    let inremindertype={
        passwordInput: false,
        inputName: string.remindertype,
        inputIcon: "",
        placeholder: `${remindertype!==''?remindertype:""}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: "",
        keyboardType: "",
        editable:false,
        requiref:false,
    }
    let vehicletypein={
        passwordInput: false,
        inputName: string.vehicletype,
        inputIcon: "",
        placeholder: `${ vehicletype? vehicletype:""}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:false,
        requiref:false,
    }
    let vehicleregistrationnumber={
        passwordInput: false,
        inputName: string.vehicleregistrationnumber,
        inputIcon: "",
        placeholder:  `${vehicleregitrationnumber?vehicleregitrationnumber:""}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:false,
        requiref:false,
    }
   
    let vehiclenamein={
        passwordInput: false,
        inputName: string.vehiclename,
        inputIcon: "",
        placeholder: `${vehiclename? vehiclename:"*"}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:false,
        requiref:false,
    }
    let licensetypein={
        passwordInput: false,
        inputName: string.licensetype,
        inputIcon: "",
        placeholder:`${licensetype1? licensetype1:"*"}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:false,
        requiref:false,
    }
    let licensenumin={
        passwordInput: false,
        inputName: string.licensenumber,
        inputIcon: "",
        placeholder: `${licensenumber? licensenumber:"*"}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:false,
        requiref:false,
    }
    let model={
        passwordInput: false,
        inputName: string.model,
        inputIcon: "",
        placeholder: `${modeluse? modeluse:"*"}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:false,
        requiref:false,
    }
    let manufuc={
        passwordInput: false,
        inputName: string.menufacturing,
        inputIcon: "",
        placeholder:  `${manuuse? manuuse:"*"}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:false,
        requiref:false,
    }
    let renewalfra={
        passwordInput: false,
        inputName: string.renewalfrequency,
        inputIcon: "",
        placeholder:  `${renewalfre? renewalfre:"*"}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:false,
        requiref:false,
    }
    let renewaldate1={
        passwordInput: false,
        inputName: "",
        inputIcon: "",
        placeholder:  `${renealdate!==''?renealdate:"*"}`,
        maxLength:15 ,
        refObj:registrationref,
        returnKeyType:"" ,
        onSubmitEditing: "",
        value:{remindertype},
        onChangeText: VehicleRegitrationNumber,
        keyboardType: "",
        editable:false,
        requiref:false,
    }
    
    function VehicleRegitrationNumber(text){
        setReminderType(text)
    }
    return(
        <>

        <View style={styles.container}>
        <ScrollView>
                        <View style={styles.incontainer}>
                 <PrimaryInput {...inremindertype}/>
                 <PrimaryInput {...vehicletypein}/>


                 { remindertypeid==1&&<>
                 <PrimaryInput {...vehicleregistrationnumber}/>
                 <PrimaryInput {...vehiclenamein}/>
                 </>}
                { remindertypeid==2&&<><PrimaryInput {...licensetypein}/>
                 <PrimaryInput {...licensenumin}/>
                 </>
                    }
                     { remindertypeid==1&&
                 <View style={styles.modemanu}>
                    <View style={styles.model1}>
                    <PrimaryInput {...model}/>
                     </View>
                     
                    <View style={styles.manu1}>
                    <PrimaryInput {...manufuc}/>
                    </View>
                 </View>}
                 <View style={styles.lastrenewalview}>
            <Text style={styles.lastrenewaltext}>Last Renewal Date</Text>
         
        </View>
                 <View style={styles.renewalexpired}>
                     <Image source={isrenewaldate&& Images.audioOff} style={styles.lastrenewalimg}/>
                
                    <Text style={styles.renewalexpiredtext}>Renewal Date</Text>
            </View>
            <PrimaryInput {...renewaldate1}/>
            <PrimaryInput {...renewalfra}/>
            </View>
            </ScrollView>

        </View>
        </>
    )
}

const styles =StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:'gray',
    },
    incontainer:{
        flex:1,
        backgroundColor:'#fff',
        paddingHorizontal:10,
        borderRadius:15,
        paddingVertical:10
    },
    modemanu:{
        flex:1,
        flexDirection:'row'
    },
    model1:{
        flex:1,
        marginRight:5
    },
    manu1:{
        
        flex:1,
        marginLeft:5
    },
    lastrenewalimg:{
        borderColor:'red',
        borderRadius:100,
        borderWidth:1,
        width:20,
        height:20
    },
    renewalexpired:{
        flex:1,
        flexDirection:'row',
       alignItems:'center'
    },
    renewalexpiredtext:{
        flex:1,
        marginLeft:10
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
})