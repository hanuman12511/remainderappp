import React,{useState, useEffect} from 'react'
import {Text,Button,View,StyleSheet} from 'react-native'
import DatePicker from 'react-native-date-picker'
import { Dropdown } from 'react-native-element-dropdown';
import Moment from 'moment';
const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
  const data2 = [
    { label: 'Item 11', value: '11' },
    { label: 'Item 21', value: '21' },
    { label: 'Item 31', value: '31' },
    { label: 'Item 41', value: '41' },
    { label: 'Item 51', value: '51' },
    { label: 'Item 61', value: '61' },
    { label: 'Item 71', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
  const data3 = [
    { label: 'Item 13', value: '13' },
    { label: 'Item 23', value: '23' },
    { label: 'Item 33', value: '33' },
    { label: 'Item 43', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
export default function ReminderScreen(){
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [date2, setDate2] = useState("")
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    useEffect(()=>{
        let dd =[]
        function show(value){
            if(value==2)
            dd=data2
        else if (value ==3)
        dd=data3
    else
    dd=data
        }
        show(value)
setDate2(dd)
    },[value])
  
        
    
        const renderLabel = () => {
          if (value || isFocus) {
            return (
              <Text style={[styles.label, isFocus && { color: 'blue' }]}>
                Dropdown label
              </Text>
            );
          }
        }
    
    Moment.locale('en');
   
    console.log( Moment(date).format('d MMM YYYY'))
    return(<>
     <Text></Text>
     <Button title="Open" onPress={() => setOpen(true)} />
    
    <DatePicker
        modal
        open={open}
        mode="date"
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
       <View style={styles.container}>
   {/* { renderLabel()} */}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
        /*   search */
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
         /*  searchPlaceholder="Search..." */
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
        /*   renderLeftIcon={() => (
            
          )} */
        />
        
      </View>
      {value&&<Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={date2}
        /*   search */
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
         /*  searchPlaceholder="Search..." */
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
      />
        }  
          
    </>
       
    )
}


const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
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
      fontSize: 16,
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
  });