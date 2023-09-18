import { StyleSheet } from 'react-native';
import { moderateScale } from '../../utils/ScalingUtils';

export default (streaming: boolean, android: boolean, warning: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            // alignItems: 'center',
            // justifyContent: 'center',
        },
        livestreamView: {
            flex: 1,
            backgroundColor: 'black',
            alignSelf: 'stretch',
        },
        streamButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 60,
            width: streaming ? 50 : undefined,
            height: streaming ? 50 : undefined,
            backgroundColor: streaming ? undefined : '#E53101',
            paddingVertical: streaming ? undefined : 15,
            paddingHorizontal: streaming ? undefined : 25,
        },
        streamText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '700',
        },
        resolutionButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            backgroundColor: 'yellow',
            width: 50,
            height: 50,
        },
        audioButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
        },
        cameraButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
        },
        settingsButton: {
            position: 'absolute',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            top: android ? 20 : 60,
            right: 15,
            minHeight: 50,
            paddingVertical: 5,
            paddingHorizontal: 15,
            borderRadius: warning ? 60 : undefined,
            borderColor: '#FFFFFF',
            borderWidth: warning ? 0.5 : undefined,
            backgroundColor: warning ? '#DC3546' : undefined,
        },
        settingsIcon: {
            position: 'absolute',
            right: 10,
        },
        warningContainer: {
            marginRight: 20,
        },
        warning: {
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: '700',
        },
        otherButtonsContainer: {
            position: 'absolute',

        },
        absoluteContainer: {
            flex: 1,
            position: 'absolute',
        },
        iconContainer: {
            position: 'absolute',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            paddingHorizontal: moderateScale(10)
        },
        leftIconContainer: {
            flex: 1,

        },
        rightIconContainer: {
            flex: 1,

            alignItems: 'flex-end',
        },
        cameraStyle: {
            width: moderateScale(40),
            height: moderateScale(40),
            resizeMode: 'contain'
        },
        settingStyle: {
            width: moderateScale(40),
            height: moderateScale(40),
            resizeMode: 'contain'
        },
        stopStyle: {
            width: moderateScale(60),
            height: moderateScale(60),
            resizeMode: 'contain',
            marginVertical: moderateScale(10)
        },
        audioStyle: {
            width: moderateScale(40),
            height: moderateScale(40),
            resizeMode: 'contain'
        }
    });

interface IButtonParams {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

export const button = (position: IButtonParams) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            top: position.top,
            bottom: position.bottom,
            left: position.left,
            right: position.right,
        },
    });