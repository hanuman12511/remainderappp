import NetInfo from '@react-native-community/netinfo';
import {
  activateKeepAwake,
  deactivateKeepAwake,
} from '@sayem314/react-native-keep-awake';
import {ChatRoom, SendMessageRequest} from 'amazon-ivs-chat-messaging';
import {
  BroadcastQuality,
  CameraPosition,
  IAudioStats,
  IBroadcastSessionError,
  IIVSBroadcastCameraView,
  ITransmissionStatistics,
  IVSBroadcastCameraView,
  NetworkHealth,
  StateStatusUnion,
} from 'amazon-ivs-react-native-broadcast';
import {DataStore} from 'aws-amplify';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  unstable_batchedUpdates,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDebouncedCallback} from 'use-debounce';
import Fonts from '../../assets/fonts';
import Images from '../../assets/images';
import {PrimaryText, SecondaryInput} from '../../components';
import MessageItem from '../../components/MessageItem';
import ChatRepo from '../../data/repo/ChatRepo';
import SellerRepo from '../../data/repo/SellerRepo';
import Strings from '../../localization/Strings';
import {Bid} from '../../models';
import {colors} from '../../themes';
import FlashMessageRef from '../../utils/FlashMessageRef';
import {moderateScale} from '../../utils/ScalingUtils';
import {isStrEmpty} from '../../utils/UtilityFunc';
import ApiManager from '../../webServices/ApiManager';
import WebConstants from '../../webServices/WebConstants';
import {useIsFocused} from '@react-navigation/native';

// const rtmpsUrl = 'rtmps://bb44ab5e6ed3.global-contribute.live-video.net:443/app/'
// const streamKey = 'sk_eu-west-1_owFhmQsMFOei_wySj1nBcxf8QIg7AaPALmdaI3aazqp'

enum SessionReadyStatus {
  None = 'NONE',
  Ready = 'READY',
  NotReady = 'NOT_READY',
}
const {None, NotReady, Ready} = SessionReadyStatus;

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

const Spinner = () => (
  <ActivityIndicator color={colors.skycc} size="large" style={s.spinner} />
);

const Button: FC<{
  title: string;
  onPress: NonNullable<TouchableOpacityProps['onPress']>;
}> = ({onPress, title}) => (
  <TouchableOpacity style={s.button} onPress={onPress}>
    <Text style={s.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const SellerLiveStreamingScreen: FC = ({navigation, route}: any) => {
  const {
    streamKey,
    rtmpURL,
    liveShowId,
    regionName,
    roomARN,
    isGiveWayProduct,
    channelArnForAuction,
  } = route?.params;

  const cameraViewRef = useRef<IIVSBroadcastCameraView>(null);
  const netInfoSubs = useRef<any>();
  const netInfoSubsWithCamera = useRef<any>();

  const timerInterval = useRef<any>(null);

  const productNameRef = useRef<any>(null);
  const auctionDurationRef = useRef<any>(null);
  const initialBidAmountRef = useRef<any>(null);
  const differenceInNextBidRef = useRef<any>(null);
  const messageListRef = React.useRef<any>(null);
  const chatRef = useRef<any>();
  const auctionIdRef = useRef<any>();
  const isFocused = useIsFocused();

  const [isMuted, setIsMuted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');
  const [productName, setProductName] = useState<any>('');
  const [auctionDuration, setAuctionDuration] = useState<any>('');
  const [initialBidAmount, setInitialBidAmount] = useState<any>('');
  const [differenceInNextBid, setDifferenceInNextBid] = useState<number>(0);
  const [isAuctionStarted, setIsAuctionStarted] = useState(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [moderator, setModerator] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [latestBid, setLatestBid] = useState(0);
  const intervalRef = useRef();
  useEffect(() => {
    let sub: any;

    if (auctionIdRef.current) {
      console.log('auctionIdRef.current', auctionIdRef.current);
      sub = DataStore.observeQuery(Bid, (bid: any) =>
        bid.auctionId.eq(auctionIdRef.current.toString()),
      ).subscribe(({items}: any) => {
        console.log('ALL BIDS <>>>>>>?4', items);
        // push all items to new local array
        let newBids = [...items];

        // get last item from new local array
        let lastItem = newBids[newBids.length - 1];
        let latestBidAmount = lastItem?.price;
        setLatestBid(latestBidAmount);
        console.log('latestBidAmount', latestBidAmount);

        // get highest element from array
        // let highestBid = newBids.reduce((prev, current) => (prev.price > current.price) ? prev : current)
        // console.log("highestBid", highestBid)

        // push all items to bids array
      });
    }

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [auctionIdRef.current]);

  const callUpdateShow = () => {
    intervalRef.current = setInterval(() => {
      const body = {
        showId: liveShowId
      }
      const apiManager = new ApiManager()
      apiManager.makePostRequest(
        WebConstants.kSellerUpdateShowStatus + '?showId=' + body.showId,
        body,).then((res: any) => {
          console.log("@123 resssssssss", res)
        })
    }, 5000)
  }

  const con = true;

 
  const disablePlayButtonRef = useRef(null)
  const [{ stateStatus, readyStatus }, setState] = useState<{
    readonly stateStatus: StateStatusUnion;
    readonly readyStatus: SessionReadyStatus;
  }>(INITIAL_STATE);

  const [{audioStats, networkHealth, broadcastQuality}, setMetaData] =
    useState<{
      readonly broadcastQuality: BroadcastQuality | string;
      readonly networkHealth: NetworkHealth | string;
      readonly audioStats: {
        readonly rms: number;
        readonly peak: number;
      };
    }>(INITIAL_META_DATA_STATE);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [chatRoom, setChatRoom] = useState<any>([]);

  const isConnecting = stateStatus === 'CONNECTING';
  const isConnected = stateStatus === 'CONNECTED';
  const isDisconnected = stateStatus === 'DISCONNECTED';

  // const appState = useRef(AppState.currentState);

  useEffect(() => {
    activateKeepAwake();
    return () => {
      deactivateKeepAwake();
    };
  }, []);

  useEffect(() => {
    console.log('length', messages.length);
    return () => {};
  }, [messages]);

  const netListener = useDebouncedCallback(isNetOnObj => {
    console.log('isNetOnObj At Seller end', isNetOnObj);
    if (isNetOnObj?.type === 'wifi') {
      if (isNetOnObj?.isConnected) {
        if (!isNetOnObj?.isInternetReachable) {
          FlashMessageRef.show({
            message: 'Internet connection is slow, please try again later',
          });
        }
        if (isNetOnObj?.details?.strength < 80) {
          FlashMessageRef.show({message: Strings.goodInternetConnection});
        }
      }
    } else if (isNetOnObj?.type === 'cellular') {
      if (isNetOnObj?.isConnected) {
        if (
          isNetOnObj?.details?.cellularGeneration === '3g' ||
          isNetOnObj?.details?.cellularGeneration === '2g'
        ) {
          FlashMessageRef.show({message: Strings.goodInternetConnection});
        } else {
          console.log('connected with 4G');
        }
      }
    } else {
      FlashMessageRef.show({message: 'No internet connection'});
    }
  }, 1000);

  const changedAppStateListener = useDebouncedCallback(() => {}, 900);

  useEffect(() => {
    netInfoSubs.current = NetInfo.addEventListener(async state => {
      const netInfo = await NetInfo.fetch();
      console.log('Connection info', JSON.stringify(netInfo));
      netListener(netInfo);
    });

    return () => {
      if (netInfoSubs.current) {
        netInfoSubs.current();
      }
    };
  }, []);

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
        'Broadcast session is not ready. Please try again.',
      );
    }
  }, [readyStatus]);

  // Chat handling code starts here

  useEffect(() => {
    if (messages.length > 0) {
      messageListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  const tokenProvider: any = async (
    selectedUsername: any,
    isModerator: any,
    _avatarUrl: {src: any},
  ) => {
    console.log('this is user name =' + selectedUsername);

    const permissions = isModerator
      ? ['SEND_MESSAGE', 'DELETE_MESSAGE', 'DISCONNECT_USER']
      : ['SEND_MESSAGE'];

    const data = {
      roomArn: roomARN,
      // userId: `${selectedUsername}.${uuid}`,
      // userId: userDetail?.userId.toString(),
      attributes: {
        userName: `${selectedUsername}`,
        // avatar: buyerProfileImg,
      },
      capabilities: permissions,
    };

    console.log('chat token data', data);

    var token;
    try {
      const response: any = await ChatRepo.getChatTokenApi(
        data?.roomArn,
        data?.attributes,
        data?.capabilities,
      );
      console.log('Chat api response', response);
      token = {
        token: response.token,
        sessionExpirationTime: new Date(response.sessionExpirationTime),
        tokenExpirationTime: new Date(response.tokenExpirationTime),
      };
    } catch (error) {
      console.error('Error:', error);
    }

    return token;
  };

  useEffect(() => {
    setModerator(false);

    const room = new ChatRoom({
      // regionOrUrl: "us-east-1",
      regionOrUrl: regionName,
      tokenProvider: () => tokenProvider('jyoti', false, ''),
    });

    setChatRoom(room);
    // Connect to the chat room
    room.connect();
  }, []);

  useEffect(() => {
    // If chat room listeners are not available, do not continue
    if (!chatRoom.addListener) {
      return;
    }

    // Hide the sign in modal
    const unsubscribeOnConnected = chatRoom.addListener('connect', () => {
      console.log('connect'),
        // Connected to the chat room.
        renderConnect();
    });

    const unsubscribeOnDisconnected = chatRoom.addListener(
      'disconnect',
      (_reason: any) => {
        // Disconnected from the chat room.
        console.log('Disconnected from the chat room.');
      },
    );

    const unsubscribeOnUserDisconnect = chatRoom.addListener(
      'userDisconnect',
      (disconnectUserEvent: {reason: any}) => {
        /* Example event payload:
         * {
         *   id: "AYk6xKitV4On",
         *   userId": "R1BLTDN84zEO",
         *   reason": "Spam",
         *   sendTime": new Date("2022-10-11T12:56:41.113Z"),
         *   requestId": "b379050a-2324-497b-9604-575cb5a9c5cd",
         *   attributes": { UserId: "R1BLTDN84zEO", Reason: "Spam" }
         * }
         */
        console.log('userDisconnect');
        renderDisconnect(disconnectUserEvent.reason);
      },
    );

    const unsubscribeOnConnecting = chatRoom.addListener('connecting', () => {
      // Connecting to the chat room.
      console.log('====================================');
      console.log('connecting to chat room');
      console.log('====================================');
    });

    const unsubscribeOnMessageReceived = chatRoom.addListener(
      'message',
      (message: any) => {
        // Received a message
        const messageType = message.attributes?.message_type || 'MESSAGE';
        switch (messageType) {
          default:
            handleMessage(message);
            break;
        }
      },
    );

    const unsubscribeOnEventReceived = chatRoom.addListener(
      'event',
      (event: any) => {
        // Received an event
        handleEvent(event);
      },
    );

    const unsubscribeOnMessageDeleted = chatRoom.addListener(
      'messageDelete',
      (deleteEvent: {messageId: any}) => {
        // Received message delete event
        const messageIdToDelete = deleteEvent.messageId;
        setMessages((prevState: any[]) => {
          // Remove message that matches the MessageID to delete
          const newState = prevState.filter(
            (item: {messageId: any}) => item.messageId !== messageIdToDelete,
          );
          return newState;
        });
      },
    );

    return () => {
      unsubscribeOnConnected();
      unsubscribeOnDisconnected();
      unsubscribeOnUserDisconnect();
      unsubscribeOnConnecting();
      unsubscribeOnMessageReceived();
      unsubscribeOnEventReceived();
      unsubscribeOnMessageDeleted();
    };
  }, [chatRoom]);

  // Handlers
  const handleError = (data: any) => {
    const username = '';
    const userId = '';
    const avatar = '';
    const message = `Error ${data.errorCode}: ${data.errorMessage}`;
    const messageId = '';
    const timestamp = `${Date.now()}`;

    const newMessage = {
      type: 'ERROR',
      timestamp,
      username,
      userId,
      avatar,
      message,
      messageId,
    };

    setMessages((prevState: any) => {
      return [...prevState, newMessage];
    });
  };

  const handleMessage = (data: {
    sender: {attributes: {userName: any; avatar: any}; userId: any};
    content: any;
    id: any;
    sendTime: any;
  }) => {
    console.log('Data============================', data);

    const username = data.sender?.attributes?.userName;
    const userId = data.sender?.userId;
    const avatar = data.sender?.attributes.avatar;
    const message = data.content;
    const messageId = data.id;
    const timestamp = data.sendTime;

    const newMessage = {
      type: 'MESSAGE',
      timestamp,
      username,
      userId,
      avatar,
      message,
      messageId,
    };

    console.log('newMessage', newMessage);

    setMessages((prevState: any) => {
      return [...prevState, newMessage];
    });
  };

  const handleEvent = (event: {eventName: any; attributes: {userId: any}}) => {
    const eventName = event.eventName;
    switch (eventName) {
      case 'aws:DELETE_MESSAGE':
        // Ignore system delete message events, as they are handled
        // by the messageDelete listener on the room.
        break;
      case 'app:DELETE_BY_USER':
        const userIdToDelete = event.attributes.userId;
        setMessages((prevState: any[]) => {
          // Remove message that matches the MessageID to delete
          const newState = prevState.filter(
            (item: {userId: any}) => item.userId !== userIdToDelete,
          );
          return newState;
        });
        break;
      default:
        console.info('Unhandled event received:', event);
    }
  };

  const onSubmitEditing = () => {
    console.log('sibmitedt mesg', message);
    if (message.length > 0) {
      sendMessage(message);
      setMessage('');
    }
  };

  const sendMessage = async (message: string) => {
    const content = `${message.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}`;
    const request = new SendMessageRequest(content);
    try {
      await chatRoom.sendMessage(request);
    } catch (error) {
      handleError(error);
    }
  };

  // Renderers
  const renderErrorMessage = (errorMessage: any) => {
    return <Text>{errorMessage.message}</Text>;
  };

  const renderSuccessMessage = (successMessage: any) => {
    return <Text>{successMessage.message}</Text>;
  };

  const renderChatLineActions = (_message: {messageId: any; userId: any}) => {
    return <></>;
  };

  const renderStickerMessage = (_message: any) => <></>;

  const renderDisconnect = (reason: any) => {
    const error = {
      type: 'ERROR',
      timestamp: `${Date.now()}`,
      username: '',
      userId: '',
      avatar: '',
      message: `Connection closed. Reason: ${reason}`,
    };
    setMessages((prevState: any) => {
      return [...prevState, error];
    });
  };

  const renderConnect = () => {
    const status = {
      type: 'SUCCESS',
      timestamp: `${Date.now()}`,
      username: '',
      userId: '',
      avatar: '',
      message: `Connected to the chat room.`,
    };
    setMessages((prevState: any) => {
      return [...prevState, status];
    });
  };

  const isChatConnected = () => {
    const chatState = chatRoom.state;
    return chatState === 'connected';
  };

  const onMessageChange = (txt: any) => {
    setMessage(txt);
  };

  const startShowBySeller = async () => {
    let data = {
      liveShowId: liveShowId,
      isStarted: true,
    };
    let d = cameraViewRef.current?.start();
    console.log('d', d);
    let res: any = await SellerRepo.sellerStartEndLiveShow(
      data?.liveShowId,
      data?.isStarted,
    );
    FlashMessageRef.show({message: res, success: true});
  };

  const netListenerAtStartShow = useDebouncedCallback(async isNetOnObj => {
    console.log('isNetOnObj At Camera end', isNetOnObj);
    if (isNetOnObj?.type === 'wifi') {
      if (isNetOnObj.isConnected) {
        if (!isNetOnObj?.isInternetReachable) {
          FlashMessageRef.show({
            message: 'Internet connection is slow, please try again later',
          });
        } else if (isNetOnObj?.details?.strength < 80) {
          FlashMessageRef.show({
            message: 'Internet connection is slow, please try again later',
          });
        } else {
          startShowBySeller();
        }
      }
    } else if (isNetOnObj?.type === 'cellular') {
      if (isNetOnObj?.isConnected) {
        if (
          isNetOnObj?.details?.cellularGeneration === '3g' ||
          isNetOnObj?.details?.cellularGeneration === '2g'
        ) {
          FlashMessageRef.show({message: Strings.goodInternetConnection});
        } else {
          startShowBySeller();
        }
      }
    } else {
      FlashMessageRef.show({message: 'No internet connection'});
    }
  }, 1000);

  // const changedAppState = useDebouncedCallback(() => {
  //   InteractionManager.runAfterInteractions(() => {

  //   })

  // }, 900)

  // useEffect(() => {
  //   console.log("hello")

  //   AppState.addEventListener(
  //     'change',
  //     nextAppState => {
  //       console.log("nextAppState", nextAppState)

  //       if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
  //         changedAppState()
  //       }

  //       appState.current = nextAppState
  //     },
  //   );
  //   return () => {

  //   };
  // }, []);

  const onIsBroadcastReadyHandler = useCallback(
    (isReady: boolean) =>
      setState(currentState => ({
        ...currentState,
        readyStatus: isReady ? Ready : NotReady,
      })),
    [],
  );

  const onBroadcastStateChangedHandler = useCallback(
    (status: StateStatusUnion) => {
      FlashMessageRef.show({ message: status })//@123 test

      if (status == 'CONNECTING') {
        clearInterval(intervalRef.current)
        disablePlayButtonRef.current = true
      } else if (status == 'CONNECTED') {
        callUpdateShow()
        disablePlayButtonRef.current = false
      } else if (status == 'DISCONNECTED') {
        clearInterval(intervalRef.current)
        disablePlayButtonRef.current = false
      }
      setState(currentState => ({
        ...currentState,
        stateStatus: status,
      }))
    },
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
    [],
  );

  const onTransmissionStatisticsChangedHandler = useCallback(
    (transmissionStatistics: ITransmissionStatistics) =>
      setMetaData(currentState => ({
        ...currentState,
        networkHealth: transmissionStatistics.networkHealth,
        broadcastQuality: transmissionStatistics.broadcastQuality,
      })),
    [],
  );

  const onBroadcastErrorHandler = useCallback(
    (exception: IBroadcastSessionError) =>
      console.log('Broadcast session error: ', exception),
    [],
  );

  const onErrorHandler = useCallback(
    (errorMessage: string) =>
      console.log('Internal module error: ', errorMessage),
    [],
  );

  const onMediaServicesWereLostHandler = useCallback(
    () => console.log('The media server is terminated.'),
    [],
  );

  const onMediaServicesWereResetHandler = useCallback(
    () => console.log('The media server is restarted.'),
    [],
  );

  const onAudioSessionInterruptedHandler = useCallback(() => {
    console.log('The audio session is interrupted.');
  }, []);

  const onAudioSessionResumedHandler = useCallback(() => {
    console.log('The audio session is resumed.');
  }, []);

  const onPressPlayButtonHandler = useCallback(
    async () => {
      disablePlayButtonRef.current = true
      netInfoSubsWithCamera.current = NetInfo.addEventListener(async (state) => {
        const netInfo = await NetInfo.fetch()
        console.log("Connection info for camera", JSON.stringify(netInfo));
        netListenerAtStartShow(netInfo)
      }
      )
    },
    []
  );

  const onPressStopButtonHandler = useCallback(async () => {
    let data = {
      liveShowId: liveShowId,
      isStarted: false,
    };

    // cameraViewRef.current?.stop()
    let res: any = await SellerRepo.sellerStartEndLiveShow(
      data?.liveShowId,
      data?.isStarted,
    );
    FlashMessageRef.show({message: res, success: true});
    navigation.navigate('SellerLiveShow');

    // setTimeout(async () => {
    //   let res: any = await SellerRepo.sellerStartEndLiveShow(data?.liveShowId, data?.isStarted)
    //   FlashMessageRef.show({ message: res, success: true })
    //   navigation.navigate('SellerLiveShow')
    // }, 4000);
  }, []);

  const onPressSwapCameraButtonHandler = useCallback(
    () =>
      setCameraPosition(currentPosition =>
        currentPosition === 'back' ? 'front' : 'back',
      ),
    [],
  );

  const onPressMuteButtonHandler = useCallback(
    () => setIsMuted(currentIsMuted => !currentIsMuted),
    [],
  );

  const onCreateAuctionBtnPress = () => {
    setIsAuctionModalOpen(true);
  };

  const onEndAuctionBtnPress = async () => {
    const data = {
      auctionId: auctionIdRef.current,
      channelARN: channelArnForAuction,
    };

    console.log('data of end auction btn', data);

    let res: any = await SellerRepo.sellerEndAuction(
      data?.auctionId,
      data?.channelARN,
    );

    if (res) {
      setIsAuctionStarted(false);
      auctionIdRef.current = '';
      clearInterval(timerInterval.current);
      setSeconds(0);
      setLatestBid(0);
    }
    FlashMessageRef.show({message: res, success: true});

    // FlashMessageRef.show({ message: Strings.auctionEnded, success: true })
  };

  const onProductNameChange = (txt: React.SetStateAction<any>) => {
    setProductName(txt);
  };

  const onAuctionDurationChange = (txt: React.SetStateAction<any>) => {
    setAuctionDuration(txt);
    setSeconds(txt);
  };

  const onInitialBidAmountChange = (txt: React.SetStateAction<any>) => {
    setInitialBidAmount(txt);
  };

  // const onDifferenceInNextBidChange = (txt: React.SetStateAction<any>) => {
  //   setDifferenceInNextBid(txt)
  // }

  const validateInputs = () => {
    if (isStrEmpty(productName.trim())) {
      FlashMessageRef.show({message: Strings.productNameValidation});
      return false;
    } else if (isStrEmpty(auctionDuration.trim())) {
      FlashMessageRef.show({message: Strings.auctionDurationValidation});
      return false;
    } else if (auctionDuration.trim() <= 30 && auctionDuration.trim() >= 60) {
      FlashMessageRef.show({message: Strings.maxAuctionDurationValidation});
      return false;
    } else if (isStrEmpty(initialBidAmount.trim())) {
      FlashMessageRef.show({message: Strings.initialAmountValidation});
      return false;
    } else if (initialBidAmount.trim() <= '0') {
      FlashMessageRef.show({message: Strings.initialAmountValueValidation});
      return false;
    } else if (differenceInNextBid === 0) {
      FlashMessageRef.show({message: Strings.differenceInNextBidValidation});
      return false;
    } else {
      setIsAuctionStarted(true);
      FlashMessageRef.show({message: Strings.auctionStarted, success: true});
      return true;
    }
  };

  const onAuctionModalStartBtnPress = async () => {
    let data = {
      liveShowId: liveShowId,
      productName: productName,
      auctionDuration: auctionDuration,
      initialBidAmount: initialBidAmount,
      differenceInNextBid: differenceInNextBid.toString(),
      channelARN: channelArnForAuction,
    };

    console.log('create auction data', data);
    // sellerCreateAuction
    if (validateInputs()) {
      setIsAuctionModalOpen(false);

      let res: any = await SellerRepo.sellerCreateAuction(
        data?.liveShowId,
        data?.productName,
        data?.auctionDuration,
        data?.initialBidAmount,
        data?.differenceInNextBid,
        data?.channelARN,
      );

      console.log('create auction res', res);

      if (res?.success_message) {
        auctionIdRef.current = res.response_packet.auctionId;
        onPressCreateTimer();
        FlashMessageRef.show({message: res?.success_message, success: true});
      }

      unstable_batchedUpdates(() => {
        setProductName('');
        setAuctionDuration('');
        setInitialBidAmount('');
        setDifferenceInNextBid(0);
      });
    }
  };

  const onAuctionModalCancelBtnPress = async () => {
    setIsAuctionModalOpen(false);
    unstable_batchedUpdates(() => {
      setProductName('');
      setAuctionDuration('');
      setInitialBidAmount('');
      setDifferenceInNextBid(0);
    });
  };

  const onDecrementBtnPress = () => {
    // setDifferenceInNextBid((prev: any) => {
    //   return prev - 1
    // }
    // )

    setDifferenceInNextBid(function (prevCount: any) {
      if (prevCount > 0) {
        return (prevCount -= 1);
      } else {
        return (prevCount = 0);
      }
    });
  };

  const onIncrementBtnPress = () => {
    // setDifferenceInNextBid((prev: any) => {
    //   return prev + 1
    // })

    setDifferenceInNextBid(function (prevCount: any) {
      return (prevCount += 1);
    });
  };

  // console.log("timer", timer)

  const onPressCreateTimer = () => {
    console.log('seconds', seconds);
    if (timerInterval) {
      clearInterval(timerInterval.current);
    }
    timerInterval.current = setInterval(() => {
      setSeconds(state => {
        if (state === 1) {
          clearInterval(timerInterval.current);
          //callback
          onEndAuctionBtnPress();
        }
        return state - 1;
      });
    }, 1000);
  };

  const getTime = (seconds: any) => {
    let minutes: any = Math.floor(seconds / 60);
    let extraSeconds: any = seconds % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    extraSeconds = extraSeconds < 10 ? '0' + extraSeconds : extraSeconds;

    return `${minutes}:${extraSeconds}`;
  };

  const strTimer = getTime(seconds);

  const isStartButtonVisible =
    isDisconnected || stateStatus === INITIAL_BROADCAST_STATE_STATUS;

  return (
    <View style={{flex: 1}}>
      <IVSBroadcastCameraView
        ref={cameraViewRef}
        style={s.cameraView}
        rtmpsUrl={rtmpURL}
        streamKey={streamKey}
        videoConfig={VIDEO_CONFIG}
        audioConfig={AUDIO_CONFIG}
        isMuted={isMuted}
        isCameraPreviewMirrored={true}
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
      <View style={s.container}>
        <View style={s.iconContainer}>
          <View style={s.leftIconContainer}>
            <View style={s.leftTopContainer}></View>
            <View style={s.chatContainer}>
              <FlatList
                ref={messageListRef}
                data={messages}
                renderItem={({item}) => {
                  return (
                    <MessageItem
                      buyerJoinedName={item?.username}
                      buyerJoindProfileImg={item?.avatar}
                      buyerName={item?.username}
                      message={item?.message}
                      img={item?.avatar}
                    />
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={ItemSeparatorComponent}
                showsVerticalScrollIndicator={false}
                inverted
              />
            </View>
          </View>
          <View style={s.rightIconContainer}>
            <TouchableOpacity
              onPress={onPressSwapCameraButtonHandler}
              style={s.cameraButton}>
              <Image source={Images.frontBackCamera} style={s.cameraStyle} />
            </TouchableOpacity>
            {isConnected ?(<>
              <TouchableOpacity
                onPress={onPressStopButtonHandler}
              >
                <Image
                  source={Images.stop}
                  style={s.stopStyle}
                />
              </TouchableOpacity> 
              <TouchableOpacity
                onPress={onPressPlayButtonHandler}
                disabled={disablePlayButtonRef.current}
              >
                <Image
                  source={Images.start}
                  style={{ ...s.stopStyle, tintColor: disablePlayButtonRef.current ? 'grey' : undefined }}
                />
              </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={onPressPlayButtonHandler}>
                <Image source={Images.start} style={s.stopStyle} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onPressMuteButtonHandler}>
              <Image
                source={isMuted ? Images.audioOff : Images.audioOn}
                style={s.audioStyle}
              />
            </TouchableOpacity>
            <Text style={s.timerText}>{strTimer}</Text>
          </View>
        </View>
        <View style={s.bottomContainer}>
          <View style={s.auctionCon}>
            {isConnected ? (
              <View style={s.auctionBtnContainer}>
                <TouchableOpacity
                  onPress={
                    isAuctionStarted
                      ? onEndAuctionBtnPress
                      : onCreateAuctionBtnPress
                  }
                  style={s.auctionBtn}>
                  <PrimaryText
                    text={
                      isAuctionStarted
                        ? Strings.endAuction
                        : Strings.createAuction
                    }
                    primaryTextStyle={s.createAuctionTxt}
                  />
                </TouchableOpacity>
                <TouchableOpacity disabled={true} style={s.showBiddingBtn}>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: moderateScale(16),
                      fontWeight: 'bold',
                    }}>
                    BID €
                    {latestBid > 0 || latestBid !== undefined ? latestBid : 0}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>
      {isConnecting && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}>
          <View style={s.modalContainer}>
            <Spinner />
          </View>
        </Modal>
      )}
      {
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAuctionModalOpen}
          onRequestClose={() => {
            // Alert.alert("Modal has been closed.");
            setIsAuctionStarted(false);
          }}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.contentContainerStyle}
            keyboardShouldPersistTaps={'handled'}
            scrollEnabled={true}>
            <View style={s.createAuctionModalContainer}>
              <View style={s.createAuctionModalContent}>
                <PrimaryText
                  text={Strings.auction}
                  primaryTextStyle={s.auctionTxt}
                />
                <SecondaryInput
                  inputName={Strings.productName}
                  placeholder={Strings.productNamePlaceholder}
                  value={productName}
                  onChangeText={onProductNameChange}
                  returnKeyType="next"
                  refObj={productNameRef}
                  onSubmitEditing={() => {
                    auctionDurationRef.current.focus();
                  }}
                  maxLength={50}
                  inputLableColor={colors.black}
                  secondaryInputColor={colors.black}
                  placeholderTextColor={colors.grayC7}
                  inputContainerBackgroundColor={{}}
                />
                {/* {isStrEmpty(productName.trim()) ? <Text style={s.errorTxt}>{Strings.productNameValidation}</Text> : null} */}
                <SecondaryInput
                  inputName={Strings.auctionDuration}
                  placeholder={Strings.auctionDurationPlaceholder}
                  value={auctionDuration}
                  onChangeText={onAuctionDurationChange}
                  returnKeyType="next"
                  refObj={auctionDurationRef}
                  onSubmitEditing={() => {
                    initialBidAmountRef.current.focus();
                  }}
                  keyboardType={'decimal-pad'}
                  inputLableColor={colors.black}
                  secondaryInputColor={colors.black}
                  placeholderTextColor={colors.grayC7}
                  maxLength={2}
                  inputContainerBackgroundColor={
                    s.inputContainerBackgroundColor
                  }
                />
                <SecondaryInput
                  inputName={Strings.initialBidAmount}
                  placeholder={Strings.initialAmountPlaceholder}
                  value={initialBidAmount}
                  onChangeText={onInitialBidAmountChange}
                  returnKeyType="next"
                  refObj={initialBidAmountRef}
                  maxLength={10}
                  // onSubmitEditing={() => { differenceInNextBidRef.current.focus(); }}
                  keyboardType={'number-pad'}
                  inputLableColor={colors.black}
                  secondaryInputColor={colors.black}
                  placeholderTextColor={colors.grayC7}
                  inputContainerBackgroundColor={
                    s.inputContainerBackgroundColor
                  }
                />
                <DifferenceInNextBidComponent
                  onDecrementBtnPress={onDecrementBtnPress}
                  onIncrementBtnPress={onIncrementBtnPress}
                  value={differenceInNextBid}
                />
                <View style={s.startAndCancelBtnContainer}>
                  <TouchableOpacity
                    onPress={onAuctionModalStartBtnPress}
                    style={s.startBtn}>
                    <PrimaryText
                      text={Strings.start}
                      primaryTextStyle={s.startAuctionTxt}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onAuctionModalCancelBtnPress}
                    style={s.startBtn}>
                    <PrimaryText
                      text={Strings.cancel}
                      primaryTextStyle={s.startAuctionTxt}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
      }
    </View>
  );
};

// interface MessageItemProps {
//   buyerName: any;
//   message: any;
//   img: any;
//   buyerJoinedName?: any;
//   buyerJoindProfileImg?: any;
// }

// const MessageItem = ({ buyerName, message, img, buyerJoinedName, buyerJoindProfileImg }: MessageItemProps,) => {
//   return (
//     <View
//       style={s.itemContainer}
//     >
//       <View>
//         {buyerName.length > 0 ? message === "Connected to the chat room." ?
//           null
//           :
//           <View style={{ flexDirection: 'row' }}>
//             <View>
//               <Image
//                 source={{ uri: img }}
//                 style={s.buyerImgStyle}
//               />
//             </View>
//             <View>
//               <Text style={s.userNameStyle}>{buyerName}</Text>
//               <Text style={s.receivedMsgStyle}>{message}</Text>
//             </View>
//           </View>
//           : null
//         }
//       </View>
//     </View>
//   )
// }

const ItemSeparatorComponent = () => {
  return <View style={s.seperator} />;
};

interface differenceInNextBidProps {
  onDecrementBtnPress: any;
  onIncrementBtnPress: any;
  value: any;
}

const DifferenceInNextBidComponent = ({
  onDecrementBtnPress,
  onIncrementBtnPress,
  value,
}: differenceInNextBidProps) => {
  return (
    <View style={s.differenceInNextBidContainerWithLabel}>
      <Text style={s.differenceInNextBidLabel}>
        {Strings.differenceInNextBid}
      </Text>
      <View style={s.differenceInNextBidContainer}>
        <TouchableOpacity
          disabled={value === 0 ? true : false}
          onPress={onDecrementBtnPress}
          style={s.decrementBtn}>
          <Text style={s.decrementBtnTxt}>-</Text>
        </TouchableOpacity>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={s.differenceInNextBidTxt}>{value}</Text>
        </View>
        <TouchableOpacity onPress={onIncrementBtnPress} style={s.incrementBtn}>
          <Text style={s.incrementBtnTxt}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    // flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    // backgroundColor: 'red'
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingHorizontal: moderateScale(10),
    // backgroundColor: 'blue'
  },
  leftIconContainer: {
    flex: 1,
    // backgroundColor: 'green'
  },
  rightIconContainer: {
    flex: 0.3,
    alignItems: 'flex-end',
    // backgroundColor: 'yellow'
  },
  cameraStyle: {
    width: moderateScale(40),
    height: moderateScale(40),
    resizeMode: 'contain',
  },
  settingStyle: {
    width: moderateScale(40),
    height: moderateScale(40),
    resizeMode: 'contain',
  },
  stopStyle: {
    width: moderateScale(60),
    height: moderateScale(60),
    resizeMode: 'contain',
    marginVertical: moderateScale(10),
  },
  audioStyle: {
    width: moderateScale(40),
    height: moderateScale(40),
    resizeMode: 'contain',
  },
  cameraButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  spinner: {
    // flex: 1,
    color: colors.skycc,
    alignSelf: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.1,
    // backgroundColor: 'yellow',
    paddingHorizontal: moderateScale(10),
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
  centerContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  auctionCon: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    flex: 0.3,
    paddingTop: moderateScale(10),
    // backgroundColor: 'yellow',
  },
  auctionBtn: {
    paddingVertical: moderateScale(10),
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(25),
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(10),
  },
  createAuctionTxt: {
    color: colors.pinkA2,
    fontSize: moderateScale(16),
    fontFamily: Fonts.OpenSans_SemiBold,
  },
  startAuctionTxt: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: Fonts.OpenSans_SemiBold,
  },
  createAuctionModalContainer: {
    flex: 1,
    backgroundColor: colors.darkTransparent,
    justifyContent: 'flex-end',
  },
  startAndCancelBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: moderateScale(20),
  },
  startBtn: {
    paddingVertical: moderateScale(10),
    backgroundColor: colors.pinkA2,
    paddingHorizontal: moderateScale(25),
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(10),
    marginLeft: moderateScale(10),
  },
  auctionTxt: {
    color: colors.black,
    fontSize: moderateScale(24),
    lineHeight: moderateScale(30),
    fontFamily: Fonts.OpenSans_Regular,
  },
  contentContainerStyle: {
    flexGrow: 1,
    // justifyContent: 'space-between',
  },
  inputContainerBackgroundColor: {
    color: colors.black21,
  },
  placeholderTextColor: {
    color: colors.white,
  },
  inputLableColor: {
    color: colors.white,
  },
  secondaryInputColor: {
    color: colors.white,
  },
  seperator: {
    marginVertical: moderateScale(5),
  },
  itemContainer: {
    width: '75%',
  },
  buyerImgStyle: {
    width: moderateScale(15),
    height: moderateScale(15),
    resizeMode: 'contain',
    borderRadius: moderateScale(7.5),
  },
  waveHandImg: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
  },
  userNameAndMsgConWithWaveHand: {
    flexDirection: 'row',
  },
  userNameStyle: {
    color: colors.white,
    fontWeight: '800',
    paddingHorizontal: moderateScale(5),
  },
  receivedMsgStyle: {
    color: colors.white,
    fontWeight: '800',
    width: moderateScale(200),
    paddingHorizontal: moderateScale(5),
    lineHeight: moderateScale(20),
  },
  leftTopContainer: {
    flex: 0.6,
    // backgroundColor: 'red'
  },
  createAuctionModalContent: {
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },

  differenceInNextBidContainer: {
    flexDirection: 'row',
    borderColor: colors.gray44,
    paddingHorizontal: moderateScale(2),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(2),
    justifyContent: 'space-between',
  },
  decrementBtn: {
    // width: moderateScale(41),
    // height: moderateScale(41),
    backgroundColor: colors.pinkA2,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  decrementBtnTxt: {
    color: colors.white,
    fontSize: moderateScale(15),
  },
  differenceInNextBidTxt: {
    color: colors.black,
    fontSize: moderateScale(15),
  },
  incrementBtn: {
    backgroundColor: colors.pinkA2,
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(5),
  },
  incrementBtnTxt: {
    color: colors.white,
    fontSize: moderateScale(15),
  },
  differenceInNextBidContainerWithLabel: {
    marginTop: moderateScale(15),
  },
  differenceInNextBidLabel: {
    fontFamily: Fonts.OpenSans_Regular,
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    color: colors.black,
    paddingVertical: moderateScale(5),
  },
  timerText: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.OpenSans_Regular,
    color: colors.black,
    textAlign: 'center',
  },
  auctionBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  showBiddingBtn: {
    paddingVertical: moderateScale(10),
    backgroundColor: colors.pinkA2,
    paddingHorizontal: moderateScale(25),
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(10),
    marginLeft: moderateScale(15),
  },
  showBiddingBtnTxt: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: Fonts.OpenSans_SemiBold,
  },
  errorTxt: {
    color: colors.red,
    fontSize: moderateScale(12),
    fontFamily: Fonts.OpenSans_Regular,
  },
});

export default SellerLiveStreamingScreen;
