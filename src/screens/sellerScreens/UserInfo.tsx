import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { moderateScale } from '../../utils/ScalingUtils';

const UserInfo = ({ navigation }: any) => {

    const [username, setUsername] = useState('');

    const onNameChange = (txt: any) => {
        setUsername(txt)
    }

    const onPressSubmit = () => {
        if (username.length > 0) {
            navigation.navigate({
                name: 'Chat',
                params: {
                    username: username
                }
            })
        }

    }

    return (
        <View style={{ flex: 1, paddingHorizontal: moderateScale(20) }}>
            <Text style={styles.title}>Enter your name</Text>
            <TextInput
                value={username}
                style={styles.msgInputStyle}
                onChangeText={onNameChange}
                placeholder={'Enter your name'}
            />

            <TouchableOpacity
                onPress={onPressSubmit}
                style={{ backgroundColor: 'green', paddingVertical: moderateScale(20), alignItems: 'center', justifyContent: 'center' }}
            >
                <Text>submit</Text>

            </TouchableOpacity>

        </View>
    )
}

export default UserInfo

const styles = StyleSheet.create({
    title: {
        fontSize: moderateScale(20)
    },
    msgInputStyle: {

        backgroundColor: 'yellow'
    }
})