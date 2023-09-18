import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator, Alert,
    AppState, Modal, StyleSheet, Text, TouchableOpacity,
    TouchableOpacityProps, View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


import {
    BroadcastQuality, CameraPosition, IAudioStats, IBroadcastSessionError, IIVSBroadcastCameraView, ITransmissionStatistics, IVSBroadcastCameraView, NetworkHealth, StateStatusUnion
} from 'amazon-ivs-react-native-broadcast';


const rtmpsUrl = 'rtmps://bb44ab5e6ed3.global-contribute.live-video.net:443/app/'
const streamKey = 'sk_eu-west-1_y2aK9eohukOS_yBcS5ShxERbeINXJjj1zt2bPvWaydg'


enum SessionReadyStatus {
    None = 'NONE',
    Ready = 'READY',
    NotReady = 'NOT_READY',
}
const { None, NotReady, Ready } = SessionReadyStatus;

const INITIAL_BROADCAST_STATE_STATUS = 'INVALID' as const;
const INITIAL_STATE = {
    readyStatus: None,
    stateStatus: INITIAL_BROADCAST_STATE_STATUS,
};
const INITIAL_META_DATA_STATE = {
    audioStats: {
        rms: 0,
        peak: 0,
    },
    broadcastQuality: '',
    networkHealth: '',
};
const VIDEO_CONFIG = {
    width: 1920,
    height: 1080,
    bitrate: 7500000,
    targetFrameRate: 60,
    keyframeInterval: 2,
    isBFrames: true,
    isAutoBitrate: true,
    maxBitrate: 8500000,
    minBitrate: 1500000,
} as const;
const AUDIO_CONFIG = {
    bitrate: 128000,
} as const;

const Spinner = () => <ActivityIndicator size="large" style={s.spinner} />;

const Button: FC<{
    title: string;
    onPress: NonNullable<TouchableOpacityProps['onPress']>;
}> = ({ onPress, title }) => (
    <TouchableOpacity style={s.button} onPress={onPress}>
        <Text style={s.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const App: FC = () => {
    const cameraViewRef = useRef<IIVSBroadcastCameraView>(null);

    const [isMuted, setIsMuted] = useState(true);

    const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');

    const [{ stateStatus, readyStatus }, setState] = useState<{
        readonly stateStatus: StateStatusUnion;
        readonly readyStatus: SessionReadyStatus;
    }>(INITIAL_STATE);

    const [{ audioStats, networkHealth, broadcastQuality }, setMetaData] =
        useState<{
            readonly broadcastQuality: BroadcastQuality | string;
            readonly networkHealth: NetworkHealth | string;
            readonly audioStats: {
                readonly rms: number;
                readonly peak: number;
            };
        }>(INITIAL_META_DATA_STATE);

    const isConnecting = stateStatus === 'CONNECTING';
    const isConnected = stateStatus === 'CONNECTED';
    const isDisconnected = stateStatus === 'DISCONNECTED';

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                cameraViewRef.current?.stop();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (readyStatus === NotReady) {
            Alert.alert(
                'Sorry, something went wrong :(',
                'Broadcast session is not ready. Please try again.'
            );
        }
    }, [readyStatus]);

    const onIsBroadcastReadyHandler = useCallback(
        (isReady: boolean) =>
            setState(currentState => ({
                ...currentState,
                readyStatus: isReady ? Ready : NotReady,
            })),
        []
    );

    const onBroadcastStateChangedHandler = useCallback(
        (status: StateStatusUnion) =>
            setState(currentState => ({
                ...currentState,
                stateStatus: status,
            })),
        []
    );

    const onBroadcastAudioStatsHandler = useCallback(
        (stats: IAudioStats) =>
            setMetaData(currentState => ({
                ...currentState,
                audioStats: {
                    ...currentState.audioStats,
                    ...stats,
                },
            })),
        []
    );

    const onTransmissionStatisticsChangedHandler = useCallback(
        (transmissionStatistics: ITransmissionStatistics) =>
            setMetaData(currentState => ({
                ...currentState,
                networkHealth: transmissionStatistics.networkHealth,
                broadcastQuality: transmissionStatistics.broadcastQuality,
            })),
        []
    );

    const onBroadcastErrorHandler = useCallback(
        (exception: IBroadcastSessionError) =>
            console.log('Broadcast session error: ', exception),
        []
    );

    const onErrorHandler = useCallback(
        (errorMessage: string) =>
            console.log('Internal module error: ', errorMessage),
        []
    );

    const onMediaServicesWereLostHandler = useCallback(
        () => console.log('The media server is terminated.'),
        []
    );

    const onMediaServicesWereResetHandler = useCallback(
        () => console.log('The media server is restarted.'),
        []
    );

    const onAudioSessionInterruptedHandler = useCallback(() => {
        console.log('The audio session is interrupted.');
    }, []);

    const onAudioSessionResumedHandler = useCallback(() => {
        console.log('The audio session is resumed.');
    }, []);

    const onPressPlayButtonHandler = useCallback(
        () => cameraViewRef.current?.start(),
        []
    );

    const onPressStopButtonHandler = useCallback(
        () => cameraViewRef.current?.stop(),
        []
    );

    const onPressSwapCameraButtonHandler = useCallback(
        () =>
            setCameraPosition(currentPosition =>
                currentPosition === 'back' ? 'front' : 'back'
            ),
        []
    );

    const onPressMuteButtonHandler = useCallback(
        () => setIsMuted(currentIsMuted => !currentIsMuted),
        []
    );





    const isStartButtonVisible =
        isDisconnected || stateStatus === INITIAL_BROADCAST_STATE_STATUS;

    return (
        <>
            <IVSBroadcastCameraView
                ref={cameraViewRef}
                style={s.cameraView}
                rtmpsUrl={rtmpsUrl}
                streamKey={streamKey}
                videoConfig={VIDEO_CONFIG}
                audioConfig={AUDIO_CONFIG}
                isMuted={isMuted}
                isCameraPreviewMirrored={false}
                cameraPosition={cameraPosition}
                cameraPreviewAspectMode={'fill'}
                onError={onErrorHandler}
                onBroadcastError={onBroadcastErrorHandler}
                onIsBroadcastReady={onIsBroadcastReadyHandler}
                onBroadcastAudioStats={onBroadcastAudioStatsHandler}
                onBroadcastStateChanged={onBroadcastStateChangedHandler}
                onTransmissionStatisticsChanged={onTransmissionStatisticsChangedHandler}
                onMediaServicesWereLost={onMediaServicesWereLostHandler}
                onMediaServicesWereReset={onMediaServicesWereResetHandler}
                onAudioSessionInterrupted={onAudioSessionInterruptedHandler}
                onAudioSessionResumed={onAudioSessionResumedHandler}
                {...(__DEV__ && {
                    logLevel: 'debug',
                    sessionLogLevel: 'debug',
                })}
            />
            <Modal
                visible
                transparent
                animationType="fade"
                supportedOrientations={['landscape', 'portrait']}
            >
                <SafeAreaProvider>
                    {readyStatus === None ? (
                        <Spinner />
                    ) : (
                        readyStatus === Ready && (
                            <SafeAreaView
                                testID="primary-container"
                                style={s.primaryContainer}
                            >
                                <View style={s.topContainer}>
                                    <View style={s.topButtonContainer}>
                                        <Button
                                            title={isMuted ? 'Unmute' : 'Mute'}
                                            onPress={onPressMuteButtonHandler}
                                        />

                                        <Button
                                            title="Swap"
                                            onPress={onPressSwapCameraButtonHandler}
                                        />
                                        {isConnected && (
                                            <Button title="Stop" onPress={onPressStopButtonHandler} />
                                        )}
                                    </View>

                                </View>
                                {(isStartButtonVisible || isConnecting) && (
                                    <View style={s.middleContainer}>
                                        {isStartButtonVisible && (
                                            <Button
                                                title="Start"
                                                onPress={onPressPlayButtonHandler}
                                            />
                                        )}
                                        {isConnecting && <Spinner />}
                                    </View>
                                )}
                                <View style={s.bottomContainer}>
                                    <View style={s.metaDataContainer}>
                                        <Text
                                            style={s.metaDataText}
                                        >{`Peak ${audioStats.peak?.toFixed(
                                            2
                                        )}, Rms: ${audioStats.rms?.toFixed(2)}`}</Text>
                                        <Text
                                            style={s.metaDataText}
                                        >{`Stream quality: ${broadcastQuality}`}</Text>
                                        <Text
                                            style={s.metaDataText}
                                        >{`Network health: ${networkHealth}`}</Text>
                                    </View>
                                    {isConnected && <Text style={s.liveText}>LIVE</Text>}
                                </View>
                            </SafeAreaView>
                        )
                    )}
                </SafeAreaProvider>
            </Modal>
        </>
    );
};

const s = StyleSheet.create({
    spinner: {
        flex: 1,
    },
    topContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topButtonContainer: {
        marginBottom: 16,
        flexDirection: 'row',
    },
    middleContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    button: {
        marginHorizontal: 8,
    },
    buttonText: {
        padding: 8,
        borderRadius: 8,
        fontSize: 20,
        color: '#ffffff',
        backgroundColor: 'rgba(128, 128, 128, 0.4)',
        textTransform: 'capitalize',
    },
    metaDataContainer: {
        flex: 1,
    },
    metaDataText: {
        color: '#ffffff',
    },
    liveText: {
        color: '#ffffff',
        padding: 8,
        backgroundColor: '#FF5C5C',
        borderRadius: 8,
    },
    cameraView: {
        flex: 1,
        backgroundColor: '#000000',
    },
    primaryContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
});

export default App;