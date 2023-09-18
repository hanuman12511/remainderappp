import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../themes';

interface PrimaryContainerProps {
    primaryContainerStyle?: any;
}

const PrimaryContainer: React.FC<PrimaryContainerProps> = props => {

    return (
        <View style={[styles.container, props.primaryContainerStyle]}>
            {props.children}
        </View>
    )
}

export default PrimaryContainer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    }
})