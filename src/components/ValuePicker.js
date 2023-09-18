import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from "react-native-modal";
import { colors } from '../themes';
import { moderateScale } from '../utils/ScalingUtils';

// values = [{label : "", value:""}]

const ValuePicker = forwardRef(({
    values = [],
    onSelect = () => { }
}, ref) => {

    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => {
            setVisible(true)
        },
        hide: () => {
            setVisible(false)
        },
    }));

    const onSelectOption = (item, index) => {
        setVisible(false)
        onSelect(item, index)
    }

    const renderOption = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => onSelectOption(item, index)}
                style={styles.item}>
                <Text style={[styles.itemText, { color: colors.black }]} >{item.label}</Text>
            </TouchableOpacity>
        )
    }, [values])

    return (
        <Modal
            onBackdropPress={() => setVisible(false)}
            isVisible={visible} style={[styles.itemModal, { backgroundColor: colors.white }]}>
            <View>
                <FlatList
                    data={values}
                    renderItem={renderOption}
                    keyExtractor={item => item.value.toString()}
                />
            </View>
        </Modal>
    )
})

export default ValuePicker

const styles = StyleSheet.create({
    itemModal: {

    },
    item: {
        alignItems: 'flex-start',
        padding: moderateScale(15)
    },
    itemText: {
        fontSize: moderateScale(16)
    },
})
