import React, { useEffect } from"react"
import {Text,Button} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { getDashbordDetailsthunk } from "../data/store/thunks/BuyerShowsThunk"

export default function Addremainder({navigation}){

const dispatch = useDispatch()
   
useEffect(()=>{
  },
    [])

    function addremainder(){
        const params={ 
            "remainderType": 0,
        "vehicleType": 0,
        "vehicleTypeName": "Maruti",
        "vehicleName": "800",
        "vehicleModel": "2014",
        "vehicleManufacturingYear": "2013",
        "vehicleRegistrationNumber": "wewe23223",
        "licenseNumber": "asad323232",
        "licenseType": 0,
        "renewalFrequency": 0,
        "registrationExpireDate": "2023-09-20T19:45:13.118Z",
        "lastRenewalDate": "2022-09-20T19:45:13.118Z",}
        dispatch(getDashbordDetailsthunk(params))
    }
    return(<>
        <Text>
           Add Remainder
        </Text>
        <Button onPress={addremainder} title="Add Remainder"/>
        </>
    )
}