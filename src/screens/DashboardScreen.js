import React, { useEffect } from"react"
import {Text,Button} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { getDashbordDetailsthunk } from "../data/store/thunks/BuyerShowsThunk"

import NavigationConstants from "../navigators/NavigationConstant"

export default function DashbordScreen({navigation}){

const dispatch = useDispatch()
const data = useSelector(state=>state?.buyerShowState?.DashboarDetails)
console.log("dash board",data);    
useEffect(()=>{
    function shwDetails(){
dispatch(getDashbordDetailsthunk())
    }
    shwDetails()},
    [])

    function addremainder(){
        console.log("addd remainer");
navigation.push(NavigationConstants.Addremainder)
    }

    return(<>
        <Text>
            Dashbord
        </Text>
        <Button onPress={addremainder} title="Add Remainder"/>
        </>
    )
}