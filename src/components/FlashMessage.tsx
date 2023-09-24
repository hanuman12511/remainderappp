import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    unstable_batchedUpdates,
    View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Images from '../assets/images';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Images from '../assets/images';
import colors from '../themes/colors';
import type { FlashMessageParams } from '../types/types';
import { moderateScale } from '../utils/ScalingUtils';

const FlashMessage = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('default');
    const [success, setSuccess] = useState(false);

    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const init = () => {
            //initialize
        };
        init();
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            show: (params: FlashMessageParams) => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
                const tM = params.duration ?? 3000;
                unstable_batchedUpdates(() => {
                    setVisible(true);
                    setMessage(params.message);
                    setSuccess(params.success ?? false);
                });
                setMessage(params.message);
                timerRef.current = setTimeout(() => {
                    setVisible(false);
                }, tM);
            },
            hide: () => {
                setVisible(false);
            },
        }),
        [],
    );

    if (!visible) {
        return null;
    }
    return (
        <View style={[styles.container, {
            backgroundColor: colors.white,
            borderColor: !success ? colors.pinkA2 : colors.pinkA2,
        }]}>
            {!success ? (
                <Image
                    source={Images.redExclamation}
                    style={{ width: 25, height: 25, resizeMode: 'cover', marginRight: 5 }}
                />
            ) : (
                <Image
                    source={Images.rightTickSuccessIcon}
                    style={{ width: 25, height: 25, resizeMode: 'cover', marginRight: 5 }}
                />
            )}
            <Text style={{ maxWidth: '95%', color: success ? colors.skycc : colors.red55 }}>{message}</Text>
        </View>
    );
});

export default FlashMessage;

const styles = StyleSheet.create({
    container: {
        
        minHeight: 40,
        marginTop: getStatusBarHeight(true) + 10,
        position: 'absolute',
        padding: 10,
        marginHorizontal: 25,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center',
        borderWidth: moderateScale(1)
    },
});
