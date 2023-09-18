import NetInfo from '@react-native-community/netinfo';
import { activateKeepAwake, deactivateKeepAwake } from '@sayem314/react-native-keep-awake';
import { ChatRoom, SendMessageRequest } from 'amazon-ivs-chat-messaging';
import IVSPlayer, {
  IVSPlayerRef,
  PlayerState,
  Quality
} from 'amazon-ivs-react-native-player';

import { API } from 'aws-amplify';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  LayoutAnimation, Modal, Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  unstable_batchedUpdates,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebouncedCallback } from 'use-debounce';
import Images from '../../assets/images';
import { PrimaryImage } from '../../components';
import { Timer } from '../../components/Timer';
import BuyerRepo from '../../data/repo/BuyerRepo';
import ChatRepo from '../../data/repo/ChatRepo';
import * as mutations from '../../graphql/mutations';
import Strings from '../../localization/Strings';
import NavigationConstants from '../../navigators/NavigationConstant';
import { colors } from '../../themes';
import FlashMessageRef from '../../utils/FlashMessageRef';
import { moderateScale } from '../../utils/ScalingUtils';
import {
  isStrEmpty,
  parseSecondsToString,
  uuidv4
} from '../../utils/UtilityFunc';

const INITIAL_PLAYBACK_RATE = 1;
const INITIAL_PROGRESS_INTERVAL = 1;
const INITIAL_BREAKPOINTS = [10, 20, 40, 55, 60, 130, 250, 490, 970, 1930];
const UPDATED_BREAKPOINTS = [5, 15, 30, 45, 60, 120, 240, 480, 960, 1920];

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { width } = Dimensions.get('window');
const boxWidth = 100;

const config = {
  CHAT_REGION: 'us-east-1',
  API_URL: 'https://oxbwx4ybt9.execute-api.us-east-1.amazonaws.com/Prod/',
  CHAT_ROOM_ID: 'arn:aws:ivschat:us-east-1:522259265868:room/UFA9ewlWzWp4',
};

let counterValue = 0

const BuyerLiveShow = ({ navigation, route }: any) => {
  const mediaPlayerRef = React.useRef<IVSPlayerRef>(null);
  const messageListRef = React.useRef<any>(null);
  const netInfoSubs = useRef<any>();
  const chatRef = useRef<any>();
  const messagesEndRef = useRef<any>();
  const firstNetState = useRef<any>();
  const firstTimeLatencyLoad = useRef<any>(false);
  const timerInterval = useRef<any>(null)
  const counterRef = useRef(0);

  const {
    playbackUrl,
    CHAT_ROOM_ID,
    CHAT_REGION,
    sellerName,
    buyerName,
    buyerProfileImg,
    sellerProfileImg,
    channelARNForCreateBid,
    liveShowId,
    biddingMetaDataObjFromParams,
    productName,
    buyerId,
    sellerId,
  } = route?.params;

  console.log('buyerProfileImg', buyerProfileImg);

  const handlePlay = () => {
    mediaPlayerRef.current?.play();
  };
  const handlePause = () => {
    mediaPlayerRef.current?.pause();
  };

  // Chat function starts
  const [username, setUsername] = useState('');
  const [moderator, setModerator] = useState(false);
  const [avatar, setAvatar] = useState({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [chatRoom, setChatRoom] = useState<any>([]);
  const [inputWidthFlexValue, setInputWidthFlexValue] = useState(0);
  const [onRight, setOnRight] = useState(false);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [breakpoints, setBreakpoints] = useState<number[]>(INITIAL_BREAKPOINTS);
  const [logs, setLogs] = useState<string[]>([]);
  const [duration, setDuration] = useState<number | null>(null);
  const [detectedQuality, setDetectedQuality] = useState<Quality | null>(null);
  const [buffering, setBuffering] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [biddingMetaDataObj, setBiddingMetaDataObj] = useState<any>(null);
  const [initialSellerBid, setInitialSellerBid] = useState<any>('');
  const [differenceInNextBid, setDifferenceInNextBid] = useState<any>('');
  const [auctionId, setAuctionId] = useState<any>('');
  const [buyerBid, setBuyerBid] = useState<any>(0);
  const [winnerName, setWinnerName] = useState('');
  const [winnerProfileImg, setWinnerProfileImg] = useState('');
  const [auctionTime, setAuctionTime] = useState(0);
  const [auctionDuration, setAuctionDuration] = useState(0);

  const animate = () => {
    LayoutAnimation.easeInEaseOut();
    setOnRight(!onRight);
  };

  // useEffect(() => {
  //   // activateKeepAwake();
  //   const timer = setTimeout(() => {
  //     console.log("Lokesh")
  //   }, 10000);
  //   console.log("timer", timer)
  //   return () => {
  //     // deactivateKeepAwake();
  //     clearTimeout(timer)
  //   };
  // }, []);

  // const createBid = useCallback(async (id) => {
  //   console.log("IS<S<S<S<>D><D", id)
  //   try {
  //     const bid = {
  //       price: parseFloat(buyerBid),
  //       userId: buyerId,
  //       auctionId: id,
  //     };
  //     console.log("SSBID", bid)
  //     const res = await API.graphql({
  //       query: mutations.createBid,
  //       variables: { input: bid },
  //     });
  //     console.log(">S>S>S", res)
  //     if (res) {
  //       // Alert.alert('ADDED!');
  //     }
  //   } catch (error: any) {
  //     console.log('Eror >', error);
  //     // Alert.alert(error.errors[0].message);
  //   }
  // }, [buyerId, buyerBid]);

  const createBid = useCallback(async (id, price) => {
    try {
      const bid = {
        price: parseFloat(price),
        userId: buyerId,
        auctionId: id,
      };
      const res = await API.graphql({
        query: mutations.createBid,
        variables: { input: bid },
      });
      if (res) {
        // Alert.alert('ADDED!');
      }
    } catch (error: any) {
      console.log('Eror >', error);
      // Alert.alert(error.errors[0].message);
    }
  }, [buyerId]);


  // create a function that will be debounced

  useEffect(() => {
    activateKeepAwake();
    unstable_batchedUpdates(() => {
      setBiddingMetaDataObj(biddingMetaDataObjFromParams);
      setInitialSellerBid(biddingMetaDataObjFromParams?.initialSellerBid);
      setBuyerBid(biddingMetaDataObjFromParams?.buyerBid);
      setDifferenceInNextBid(biddingMetaDataObjFromParams?.differenceinNextBid);
      setAuctionDuration(biddingMetaDataObjFromParams?.auctionDuration);
    });
    netInfoSubs.current = NetInfo.addEventListener(async state => {
      const netInfo = await NetInfo.fetch();
      console.log('Connection info', JSON.stringify(netInfo));
      netListener(netInfo);
    });
    setModerator(false);

    const room = new ChatRoom({
      // regionOrUrl: "us-east-1",
      regionOrUrl: CHAT_REGION,
      tokenProvider: () => tokenProvider(buyerName, false, ''),
    });

    setChatRoom(room);
    // Connect to the chat room
    room.connect();

    return () => {
      deactivateKeepAwake();
      if (netInfoSubs.current) {
        netInfoSubs.current();
      }
    };
  }, []);

  useEffect(() => {
    onCalcTime()
  }, [biddingMetaDataObj, auctionDuration, auctionTime]);

  const netListener = useDebouncedCallback(isNetOnObj => {
    // console.log("isNetOnObj At Buyer end", isNetOnObj)

    if (isNetOnObj?.type === 'wifi') {
      if (isNetOnObj?.isConnected) {
        if (!isNetOnObj?.isInternetReachable) {
          FlashMessageRef.show({
            message: 'Internet connection is slow, please try again later',
          });
        }
        if (isNetOnObj?.details?.strength < 80) {
          FlashMessageRef.show({ message: Strings.goodInternetConnection });
        }
      }
    } else if (isNetOnObj?.type === 'cellular') {
      if (isNetOnObj?.isConnected) {
        if (
          isNetOnObj?.details?.cellularGeneration === '3g' ||
          isNetOnObj?.details?.cellularGeneration === '2g'
        ) {
          FlashMessageRef.show({ message: Strings.goodInternetConnection });
        } else {
          console.log('connected with 4G');
        }
      }
    } else {
      FlashMessageRef.show({ message: 'No internet connection' });
    }
  }, 1000);

  const changedAppStateListener = useDebouncedCallback(() => { }, 900);

  useEffect(() => {
    if (messages.length > 0) {
      messageListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    // create timer for 30 seconds and if logs.length === 1 then navigate to buyer shows screen
    let timer: any
    if (logs.length === 1) {
      setShowLoader(true);
      console.log("lenthh", logs.length)
      timer = setTimeout(() => {
        console.log("ashish", logs.length)
        if (logs.length === 1) {
          console.log("loader")
          setShowLoader(true);
          navigation.navigate(NavigationConstants.BuyerShows);
          console.log('show loader', logs.length);
        }
      }, 30000);

    } else {
      setShowLoader(false);
      // console.log('loader else part', logs.length);
    }
    return () => {
      clearTimeout(timer)
    }
  }, [logs]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      onFocusMessageInput();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      onBlurMessageInput();
      chatRef.current.blur?.();
      setOnRight(false);
      // animate()
    });


    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [inputWidthFlexValue, onRight]);

  // useEffect(() => {
  //   let a = onCustomBidBtnPress();
  //   console.log("a", a)
  // }, []);

  // useEffect(() => {
  //   let dateOFUtc = biddingMetaDataObj?.auctionStartTime;
  //   console.log('dateOFUtc', dateOFUtc);
  //   console.log(dateOFUtc);
  //   let date = new Date(dateOFUtc);
  //   let dTs = date.getTime();
  //   dTs = dTs - date.getTimezoneOffset() * 60000;
  //   const localDate = new Date(dTs);
  //   // let auctiontTime: any = moment(localDate).format("hh:mm A")
  //   let auctiontTime: any = localDate.getTime();
  //   let currentTime = new Date().getTime();

  //   const diffTimeCalculation = Math.abs(currentTime - auctiontTime) / 1000;
  //   // if difftime is equal to 0 and NAN then set the time to 0 
  //   let diffTime = 60 - diffTimeCalculation
  //   if (diffTime === 0 || diffTime < 0 || isNaN(diffTime)) {
  //     setAuctionTime(0);
  //   } else {
  //     // remove digits after decimal point from diffTime
  //     diffTime = Math.floor(diffTime);
  //     setAuctionTime(diffTime);
  //   }
  //   console.log('diffTime', 60 - diffTimeCalculation);
  //   auctionTimer()

  // }, [biddingMetaDataObj]);

  // const auctionTimer = () => {
  //   if (timerInterval) {
  //     clearInterval(timerInterval.current)
  //   }
  //   timerInterval.current = setInterval(() => {
  //     setAuctionTime((state: any) => {
  //       if (state === 1) {
  //         clearInterval(timerInterval.current)
  //         //callback
  //         setAuctionTime
  //       }
  //       return state - 1
  //     })
  //   }, 1000);
  // }

  // const getTime = (seconds: any) => {
  //   let minutes: any = Math.floor(seconds / 60);
  //   let extraSeconds: any = seconds % 60;
  //   minutes = minutes < 10 ? "0" + minutes : minutes;
  //   extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
  //   return `${minutes}:${extraSeconds}`;
  // }

  // const strTimer = getTime(auctionTime)

  const log = (text: string) => {
    console.log(text);
    setLogs(logs => [text, ...logs.slice(0, 30)]);
  };

  const tokenProvider: any = async (
    selectedUsername: any,
    isModerator: any,
    _avatarUrl: { src: any },
  ) => {
    console.log('this is user name =' + selectedUsername);
    const uuid = uuidv4();
    const permissions = isModerator
      ? ['SEND_MESSAGE', 'DELETE_MESSAGE', 'DISCONNECT_USER']
      : ['SEND_MESSAGE'];

    const data = {
      roomArn: CHAT_ROOM_ID,
      // userId: `${selectedUsername}.${uuid}`,
      // userId: userDetail?.userId.toString(),
      attributes: {
        userName: `${selectedUsername}`,
        avatar: buyerProfileImg,
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

  // useEffect(() => {
  //   setModerator(false);

  //   const room = new ChatRoom({
  //     // regionOrUrl: "us-east-1",
  //     regionOrUrl: CHAT_REGION,
  //     tokenProvider: () => tokenProvider(buyerName, false, ''),
  //   });

  //   setChatRoom(room);
  //   // Connect to the chat room
  //   room.connect();
  // }, []);

  useEffect(() => {
    // If chat room listeners are not available, do not continue
    if (!chatRoom.addListener) {
      return;
    }

    // Hide the sign in modal
    const unsubscribeOnConnected = chatRoom.addListener('connect', () => {
      console.log('connect');
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
      (disconnectUserEvent: { reason: any }) => {
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
      (deleteEvent: { messageId: any }) => {
        // Received message delete event
        const messageIdToDelete = deleteEvent.messageId;
        setMessages((prevState: any[]) => {
          // Remove message that matches the MessageID to delete
          const newState = prevState.filter(
            (item: { messageId: any }) => item.messageId !== messageIdToDelete,
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
    sender: { attributes: { userName: any; avatar: any }; userId: any };
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

  const handleEvent = (event: { eventName: any; attributes: { userId: any } }) => {
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
            (item: { userId: any }) => item.userId !== userIdToDelete,
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
    setInputWidthFlexValue(0);
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

  const renderChatLineActions = (_message: { messageId: any; userId: any }) => {
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

  const onNameChange = (txt: any) => {
    setUsername(txt);
  };

  const renderMessageItem = ({ item }: any) => {
    console.log('message item', item);
    return (
      <MessageItem
        buyerJoinedName={buyerName}
        buyerJoindProfileImg={buyerProfileImg}
        buyerName={item?.username}
        message={item?.message}
        img={item?.avatar}
      />
    );
  };


  const onFocusMessageInput = () => {
    setInputWidthFlexValue(1);
    animate();
  };

  const onBlurMessageInput = () => {
    setInputWidthFlexValue(0);
    // animate()
  };

  const onFollowBtnPress = () => {
    FlashMessageRef.show({ message: Strings.inProgress, success: true });
  };

  const onExploreBtnPress = () => {
    FlashMessageRef.show({ message: Strings.inProgress, success: true });
  };

  const onDownArrowBtnPress = () => {
    navigation.goBack();
  };

  const onMuteBtnPress = () => {
    setMuted(!muted);
  };

  const onShareBtnPress = async () => {
    FlashMessageRef.show({ message: Strings.inProgress, success: true });
    // try {
    //     const result = await Share.share({
    //         message:
    //             'Share everyone app, https://www.google.co.in',
    //     });
    //     if (result.action === Share.sharedAction) {
    //         if (result.activityType) {
    //             // shared with activity type of result.activityType
    //         } else {
    //             // shared
    //         }
    //     } else if (result.action === Share.dismissedAction) {
    //         // dismissed
    //     }
    // } catch (error: any) {
    //     console.log("errr", error.message)
    // }
  };

  const onPayBtnPress = () => {
    FlashMessageRef.show({ message: Strings.inProgress, success: true });
  };

  const onBrodBtnPress = () => {
    FlashMessageRef.show({ message: Strings.inProgress, success: true });
  };

  const onCustomBidBtnPress = () => {

  };

  const onCalcTime = () => {
    let dateOFUtc = biddingMetaDataObj?.auctionStartTime;
    console.log('dateOFUtc', dateOFUtc);
    console.log(dateOFUtc);
    let date = new Date(dateOFUtc);
    let dTs = date.getTime();
    dTs = dTs - date.getTimezoneOffset() * 60000;
    const localDate = new Date(dTs);
    // let auctiontTime: any = moment(localDate).format("hh:mm A")
    let auctiontTime: any = localDate.getTime();
    let currentTime = new Date().getTime();

    const diffTime = Math.abs(currentTime - auctiontTime) / 1000;
    // let auctionDur = auctionDuration * 60;
    let auctionDur = auctionDuration;
    const timeCalculation = auctionDur - diffTime
    // console.log('diffTime', 60 - diffTime);
    // console.log("auctionDuration>>>>>>>>>>>>>>>>", biddingMetaDataObj.auctionDuration)
    // return diffTime which does not contain negative value and NAN
    if (timeCalculation < 60 && timeCalculation > 0) {
      let time = Math.floor(timeCalculation);
      setAuctionTime(time);
      console.log('diffTime', time);
      return time;
    } else if (timeCalculation > 60) {
      setAuctionTime(0);
      console.log('Greater than 60');
    } else {
      console.log('Less than 0');
      setAuctionTime(0);
    }
  }

  // const onBidBtnPress = async () => {
  //   if (
  //     biddingMetaDataObj?.isAuctionActive === 1 &&
  //     biddingMetaDataObj?.isAuctionCreated === 1
  //   ) {
  //     let data = {
  //       liveShowId: liveShowId,
  //       channelARN: channelARNForCreateBid,
  //       bid: initialSellerBid.toString(),
  //     };

  //     console.log('data for metadata obj<<<', data);
  //     console.log("FirstTimeBiding")
  //     createBid(biddingMetaDataObj.auctionId);
  //     await BuyerRepo.BuyerCreateBidApi(
  //       data?.liveShowId,
  //       data?.channelARN,
  //       data?.bid,
  //     );
  //   } else {
  //     let data = {
  //       liveShowId: liveShowId,
  //       channelARN: channelARNForCreateBid,
  //       bid: (differenceInNextBid + buyerBid).toString(),
  //     };
  //     console.log("Second time bidding")
  //     console.log('differenceInNextBid>>>>>', differenceInNextBid, "buyerBid", buyerBid, "Total", differenceInNextBid + buyerBid);
  //     console.log('data for metadata obj<<<', data);
  //     createBid(biddingMetaDataObj.auctionId);
  //     await BuyerRepo.BuyerCreateBidApi(
  //       data?.liveShowId,
  //       data?.channelARN,
  //       data?.bid,
  //     );
  //   }
  // };

  const onBidBtnPress = async () => {
    if (
      biddingMetaDataObj?.isAuctionActive === 1 &&
      biddingMetaDataObj?.isAuctionCreated === 1
    ) {
      let data = {
        liveShowId: liveShowId,
        channelARN: channelARNForCreateBid,
        bid: initialSellerBid.toString(),
      };
      createBid(biddingMetaDataObj.auctionId, initialSellerBid);
      await BuyerRepo.BuyerCreateBidApi(
        data?.liveShowId,
        data?.channelARN,
        data?.bid,
      );
    } else {
      let data = {
        liveShowId: liveShowId,
        channelARN: channelARNForCreateBid,
        bid: (differenceInNextBid + buyerBid).toString(),
      };
      let price = (differenceInNextBid + buyerBid)
      createBid(biddingMetaDataObj.auctionId, price);
      await BuyerRepo.BuyerCreateBidApi(
        data?.liveShowId,
        data?.channelARN,
        data?.bid,
      );
    }
  };

  console.log(' firstTimeLatencyLoad.current', firstTimeLatencyLoad.current);
  console.log('biddingMetaDataObj', biddingMetaDataObj);
  console.log('initialSellerBid', initialSellerBid);
  console.log('differenceInNextBid', differenceInNextBid);
  console.log('winnerName', winnerName),
    console.log('winnerProfileImg', winnerProfileImg);
  console.log("Auctiontime", auctionTime);
  console.log("logs", logs);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={true}>
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <>
            <IVSPlayer
              ref={mediaPlayerRef}
              streamUrl={playbackUrl}
              //  streamUrl={'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8'}
              resizeMode={'aspectFill'}
              autoplay={true}
              muted={muted ? true : false}
              paused={paused}
              playbackRate={playbackRate}
              breakpoints={breakpoints}
              onSeek={newPosition => console.log('new position', newPosition)}
              onPlayerStateChange={state => {
                if (state === PlayerState.Buffering) {
                  counterValue = counterValue + 1
                  log(`buffering at ${detectedQuality?.name}`);

                  console.log('buffering at', detectedQuality);
                }
                if (
                  state === PlayerState.Playing ||
                  state === PlayerState.Idle
                ) {
                  setBuffering(false);
                }
                if (state === PlayerState.Idle) {
                  console.log("Idle")
                  FlashMessageRef.show({
                    message: sellerName + " 's internet connection is slow",
                    success: true,
                  });
                  setTimeout(() => {
                    navigation.navigate(NavigationConstants.BuyerShows);
                  }, 5000);
                }
                counterValue = counterValue + 1
                log(`state changed: ${state}`);
                console.log('state changed:', state);
                if (state === 'Ended') {
                  FlashMessageRef.show({
                    message: sellerName + ' ended live show',
                    success: true,
                  });
                  navigation.navigate(NavigationConstants.BuyerShows);
                }
              }}
              onDurationChange={duration => {
                setDuration(duration);
                counterValue = counterValue + 1
                log(`duration changed: ${parseSecondsToString(duration || 0)}`);

              }}
              onQualityChange={newQuality => {
                setDetectedQuality(newQuality);
                counterValue = counterValue + 1
                log(`quality changed: ${newQuality?.name}`);

              }}
              onRebuffering={() => setBuffering(true)}
              onLoadStart={() => log(`load started`)}
              onLoad={loadedDuration => {
                counterValue = counterValue + 1
                log(
                  `loaded duration changed: ${parseSecondsToString(
                    loadedDuration || 0,
                  )}`,
                )
              }
              }
              onLiveLatencyChange={liveLatency => {
                console.log(`live latency changed: ${liveLatency}`);
                // if (firstTimeLatencyLoad.current === true) {
                //   console.log('liveLatency in true block', liveLatency);
                //   if (liveLatency > 0) {
                //     setShowLoader(false);
                //   } else {
                //     setShowLoader(false);
                //     console.log('navigation latency', liveLatency);
                //     FlashMessageRef.show({ message: Strings.lowLiveLatency });
                //     navigation.navigate(NavigationConstants.BuyerShows);
                //   }
                // }
                // firstTimeLatencyLoad.current = true;
              }}
              onTextCue={textCue => {
                console.log('textcue', textCue);
                // setBiddingMetaDataObj(textCue)
              }}
              onTextMetadataCue={(textMetadataCue: any) => {
                console.log('textMetadataCueWithoutJson', textMetadataCue.text);
                const metadata = JSON.parse(textMetadataCue.text);
                console.log('TextCuemetadata', metadata);

                // console.log("stringifyJson", JSON.stringify(textMetadataCue))
                // let initialbid = textMetadataCue?.text?.InitialSellerBid
                // console.log("Text", textMetadataCue?.text)

                console.log('iniitalbid', metadata.initialSellerBid);

                setAuctionId(metadata.auctionId);
                if (
                  metadata?.isAuctionActive === 1 &&
                  metadata?.isAuctionCreated === 1
                ) {
                  console.log('metadata when auction created', metadata);
                  setInitialSellerBid(metadata.initialSellerBid);
                  setDifferenceInNextBid(metadata.differenceinNextBid);
                  setBiddingMetaDataObj(metadata);
                  setWinnerName('');
                  setWinnerProfileImg('');
                  setBuyerBid(metadata.buyerBid);
                  setAuctionDuration(metadata.auctionDuration);
                  FlashMessageRef.show({
                    message: 'Auction started',
                    success: true,
                  });
                } else if (
                  metadata?.isAuctionActive === 1 &&
                  metadata?.isAuctionCreated === 0
                ) {
                  console.log(
                    'metadata when auction in running state',
                    metadata,
                  );
                  unstable_batchedUpdates(() => {
                    setBiddingMetaDataObj(metadata);
                    setBuyerBid(metadata.buyerBid);
                    setInitialSellerBid(metadata.initialSellerBid);
                    setDifferenceInNextBid(metadata.differenceinNextBid);
                    // setAuctionDuration(metadata.auctionDuration);
                  });
                } else if (
                  metadata?.isAuctionActive === 0 &&
                  metadata?.isAuctionEnded === 1
                ) {
                  unstable_batchedUpdates(() => {
                    setBiddingMetaDataObj(metadata);
                    // setBuyerBid(metadata.buyerBid)
                    setInitialSellerBid(metadata.initialSellerBid);
                    setDifferenceInNextBid(metadata.differenceinNextBid);
                    setAuctionDuration(0);
                  });
                  if (metadata?.winnerName !== 'default') {
                    setWinnerName(metadata?.winnerName);
                    setWinnerProfileImg(metadata?.winnerImage);
                  }
                  FlashMessageRef.show({
                    message: 'Auction ended',
                    success: true,
                  });
                } else {
                  FlashMessageRef.show({
                    message: 'some problem with auction',
                    success: true,
                  });
                }
              }}>
              <View style={styles.absoluteContainer}>
                <TopContainer
                  onFollowBtnPress={onFollowBtnPress}
                  onExploreBtnPress={onExploreBtnPress}
                  onDownArrowBtnPress={onDownArrowBtnPress}
                  sellerName={sellerName}
                  sellerProfileImg={sellerProfileImg}
                />

                <View
                  style={[
                    styles.chatContainer,
                    { flexDirection: 'row', flex: 0.8, alignItems: 'flex-end' },
                  ]}>
                  <View
                    style={{
                      height: moderateScale(260),
                    }}>
                    <View
                      style={{
                        flex: 1,
                        bottom: 0,
                        alignItems: 'flex-end',
                        flexDirection: 'row',
                      }}>
                      <FlatList
                        ref={messageListRef}
                        data={messages}
                        renderItem={renderMessageItem}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                        showsVerticalScrollIndicator={false}
                        inverted
                      />
                    </View>
                    <View style={styles.MsgAndSendBtn}>
                      <TextInput
                        ref={chatRef}
                        value={message}
                        style={[
                          styles.msgInputStyle,
                          { width: onRight ? '100%' : '70%' },
                        ]}
                        onChangeText={onMessageChange}
                        placeholderTextColor={colors.white}
                        placeholder={
                          isChatConnected()
                            ? 'Say something...'
                            : 'Waiting to connect...'
                        }
                        maxLength={300}
                        editable={isChatConnected() ? true : false}
                        onSubmitEditing={onSubmitEditing}
                      // maxLength={100}
                      // onFocus={onFocusMessageInput}
                      // onBlur={onBlurMessageInput}
                      />
                    </View>
                    {!onRight ? (
                      <BottomContainer
                        isWinner={isStrEmpty(winnerName) ? false : true}
                        winnerProfileImg={winnerProfileImg}
                        winnerName={isStrEmpty(winnerName) ? '' : winnerName}
                        productName={productName}
                      />
                    ) : null}
                  </View>
                  <Animated.View
                    style={[
                      styles.rightSideContainer,
                      { marginLeft: onRight ? width - boxWidth : 0 },
                    ]}>
                    <RightSideContainer
                      muteBtnTitle={muted ? 'Unmute' : 'Mute'}
                      onMuteBtnPress={onMuteBtnPress}
                      onShareBtnPress={onShareBtnPress}
                      onPayBtnPress={onPayBtnPress}
                      onBrodBtnPress={onBrodBtnPress}
                      muteBtnImg={muted ? Images.mute_on : Images.mute}
                      buyerBid={buyerBid}
                      time={auctionTime}
                      onSuccess={() => { console.log('success'); }}
                      start={!(auctionTime == 0)}
                      stop={false}
                    />
                  </Animated.View>
                </View>
                {/* <TouchableOpacity
                  onPress={onCustomBidBtnPress}
                  style={{
                    paddingHorizontal: moderateScale(20),
                    paddingVertical: moderateScale(20),
                    backgroundColor: 'pink',
                  }}>
                  <Text
                    style={{
                      color: colors.pinkA2,
                      fontSize: moderateScale(16),
                      fontWeight: 'bold',
                    }}>
                    CUSTOM
                  </Text>
                </TouchableOpacity> */}
                {biddingMetaDataObj?.isAuctionEnded === 1 ? (
                  <TouchableOpacity
                    disabled={true}
                    style={styles.auctionEndedBtn}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: moderateScale(16),
                        fontWeight: 'bold',
                      }}>
                      {Strings.auctionEnded}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {initialSellerBid > '0' ? (
                  // <View style={styles.customBidContainer}>
                  //     <TouchableOpacity
                  //         onPress={onCustomBidBtnPress}
                  //         style={styles.customBidBtn}>
                  //         <Text style={{ color: colors.pinkA2, fontSize: moderateScale(16), fontWeight: 'bold' }}>CUSTOM</Text>
                  //     </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onBidBtnPress}
                    style={styles.bidBtn}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: moderateScale(16),
                        fontWeight: 'bold',
                      }}>
                      BID $
                      {biddingMetaDataObj?.isAuctionCreated === 1
                        ? initialSellerBid
                        : buyerBid + differenceInNextBid}
                    </Text>
                    {/* <Text style={{ color: colors.white, fontSize: moderateScale(16), fontWeight: 'bold' }}>{'BID' + (biddingMetaDataObj?.IsAuctionCreated === 1) ? initialSellerBid : (buyerBid + differenceInNextBid)}</Text> */}
                  </TouchableOpacity>
                ) : null}
              </View>
            </IVSPlayer>

          </>
        </View>
        <Modal style={{ flex: 1 }}
          onRequestClose={() => {
            // setShowLoader(false)
            navigation.navigate(NavigationConstants.BuyerShows);
          }}
          visible={showLoader}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black',
            }}>
            <ActivityIndicator
              color={colors.pinkA2}
              size={'large'}
              animating={showLoader}
            />
            <Text style={{ color: 'white', paddingVertical: moderateScale(40) }}>
              {Strings.lowLiveLatency}
            </Text>
          </View>
        </Modal>
        {/* {
          showLoader ? < ShowDefaultLoaderComponent /> : null
        } */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default BuyerLiveShow;

interface MessageItemProps {
  buyerName: any;
  message: any;
  img: any;
  buyerJoinedName: any;
  buyerJoindProfileImg: any;
}

const MessageItem = ({
  buyerName,
  message,
  img,
  buyerJoinedName,
  buyerJoindProfileImg,
}: MessageItemProps) => {
  return (
    <View style={styles.itemContainer}>
      <View>
        {buyerName.length === 0 || message === 'Connected to the chat room.' ? (
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: buyerJoindProfileImg }}
              style={styles.buyerImgStyle}
            />
            <View style={styles.userNameAndMsgConWithWaveHand}>
              <Text style={styles.userNameStyle}>
                {buyerJoinedName + ' joined '}
              </Text>
              <Image source={Images.waveHand} style={styles.waveHandImg} />
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Image source={{ uri: img }} style={styles.buyerImgStyle} />
            </View>
            <View>
              <Text style={styles.userNameStyle}>{buyerName}</Text>
              <Text style={styles.receivedMsgStyle}>{message}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const ItemSeparatorComponent = () => {
  return <View style={styles.seperator} />;
};

interface topContainerProps {
  onFollowBtnPress: any;
  onExploreBtnPress: any;
  onDownArrowBtnPress: any;
  sellerName: any;
  sellerProfileImg: any;
}

const TopContainer = ({
  onFollowBtnPress,
  onExploreBtnPress,
  onDownArrowBtnPress,
  sellerName,
  sellerProfileImg,
}: topContainerProps) => {
  return (
    <View style={{ flex: 0.2 }}>
      <View style={styles.topContainer}>
        <View style={{}}>
          <View style={styles.topLeftSellerDetailContainer}>
            <Image
              source={{ uri: sellerProfileImg }}
              style={styles.sellerProfileImg}
            />
            <View style={styles.sellerNameAndRatingCon}>
              <Text style={styles.sellerNameStyle}>{sellerName}</Text>
              <View style={styles.ratingContainer}>
                <PrimaryImage
                  primaryImgSource={Images.star}
                  primaryImageStyle={styles.ratingImgStyle}
                />
                <Text style={styles.ratingTxtStyle}>4.85</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.topRightContainer}>
          <View style={styles.soundMoveAndBackArrowContainer}>
            <View style={styles.soundMoveAndTxtCon}>
              <PrimaryImage
                primaryImgSource={Images.soundWave}
                primaryImageStyle={styles.soundWaveImgStyle}
              />
              <Text style={styles.soundWaveTxt}>56</Text>
            </View>
            <TouchableOpacity onPress={onDownArrowBtnPress}>
              <PrimaryImage
                primaryImgSource={Images.downArrow}
                primaryImageStyle={styles.downArrowImgStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.followAndExploreBtnCon}>
        <TouchableOpacity style={styles.followBtn} onPress={onFollowBtnPress}>
          <Text style={styles.followBtnTxt}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exporeBtn} onPress={onExploreBtnPress}>
          <Text style={styles.exploreTxt}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface bottomProps {
  isWinner: any;
  winnerProfileImg?: any;
  winnerName?: any;
  productName?: any;
}

const BottomContainer = ({
  isWinner,
  winnerProfileImg,
  winnerName,
  productName,
}: bottomProps) => {
  return (
    <View style={[styles.bottomContainer, {}]}>
      {isWinner ? (
        <View style={styles.winnerCon}>
          <Image
            source={{ uri: winnerProfileImg }}
            style={styles.winnerprofileImgStyle}
          />
          <Text style={styles.winnerNameStyle}>{winnerName}</Text>
          <Text style={styles.isWinningTxt}>{Strings.isWinning}</Text>
        </View>
      ) : null}
      <Text style={styles.txt}>{productName}</Text>
      {/* <Text style={styles.txt}>wins free box</Text>
            <Text style={styles.txt}>Shipping & Taxes 497 Remaining</Text> */}
    </View>
  );
};

interface rightSideProps {
  muteBtnTitle: string;
  muteBtnImg: any;
  onMuteBtnPress: any;
  onShareBtnPress: any;
  onPayBtnPress: any;
  onBrodBtnPress: any;
  buyerBid: any;
  time: any;
  onSuccess: any;
  start: boolean;
  stop: boolean;
}

const RightSideContainer = ({
  onMuteBtnPress,
  muteBtnTitle,
  muteBtnImg,
  onShareBtnPress,
  onPayBtnPress,
  onBrodBtnPress,
  buyerBid,
  time,
  onSuccess,
  start,
  stop
}: rightSideProps) => {
  return (
    <>
      <TouchableOpacity
        onPress={onMuteBtnPress}
        style={styles.rightSideIconBtn}>
        <PrimaryImage
          primaryImgSource={muteBtnImg}
          primaryImageStyle={styles.rightConBtnImgStyle}
        />
        <Text style={styles.rightConBtnTxt}>{muteBtnTitle}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onShareBtnPress}
        style={styles.rightSideIconBtn}>
        <PrimaryImage
          primaryImgSource={Images.share}
          primaryImageStyle={styles.rightConBtnImgStyle}
        />
        <Text style={styles.rightConBtnTxt}>{Strings.share}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPayBtnPress} style={styles.rightSideIconBtn}>
        <PrimaryImage
          primaryImgSource={Images.pay}
          primaryImageStyle={styles.rightConBtnImgStyle}
        />
        <Text style={styles.rightConBtnTxt}>{Strings.pay}</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
                onPress={onBrodBtnPress}
                style={styles.brodBtn} >
                <PrimaryImage
                    primaryImgSource={Images.brod}
                    primaryImageStyle={styles.brodImg}
                />

                <View style={styles.brodView}>
                    <Text style={styles.brodTxt}>{'20'}</Text>
                </View>
            </TouchableOpacity> */}

      <Text style={styles.amountTxt}>{buyerBid}</Text>
      <Timer
        time={time}
        onSuccess={onSuccess}
        start={start}
        stop={stop}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  chatContainer: {
    justifyContent: 'space-between',
  },
  absoluteContainer: {
    // position: 'absolute',
    flex: 1,
    paddingHorizontal: moderateScale(15),
    justifyContent: 'space-between',
    // height: '100%',
    // width: '100%'
  },
  playIconStyle: {
    width: moderateScale(70),
    height: moderateScale(70),
    resizeMode: 'contain',
  },
  playBtnStyle: {
    backgroundColor: colors.pinkA2,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(5),
    width: '45%',
    alignItems: 'center',
  },
  playBtnTitle: {
    fontSize: moderateScale(20),
    color: colors.white,
    fontWeight: '600',
  },
  playPauseContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(20),
  },
  pauseBtnStyle: {
    backgroundColor: colors.pinkA2,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(5),
    width: '50%',
    alignItems: 'center',
  },

  sendBtn: {
    width: moderateScale(30),
    height: moderateScale(30),
    marginLeft: moderateScale(5),
  },
  msgInputStyle: {
    fontSize: moderateScale(14),
    color: colors.white,
    backgroundColor: 'transparent',
    // flex: 1,
    borderRadius: moderateScale(23),
    borderWidth: moderateScale(1),
    borderColor: colors.white,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(8),
  },
  MsgAndSendBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: moderateScale(10),
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
  },
  modalText: {},
  textStyle: {},
  userNameAndMsgCon: {
    flexDirection: 'row',
    // paddingHorizontal: moderateScale(5),
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
  connectedTxt: {
    textAlign: 'center',
    color: 'black',
    marginBottom: moderateScale(5),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
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
  rightSideContainer: {
    width: '17%',
    // width: '25%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingVertical: moderateScale(2),
  },
  rightConBtnImgStyle: {
    width: moderateScale(30),
    height: moderateScale(30),
    resizeMode: 'contain',
    marginVertical: moderateScale(3),
  },
  rightConBtnTxt: {
    color: colors.white,
    fontSize: moderateScale(14),
    paddingVertical: moderateScale(2),
  },
  rightSideIconBtn: {
    paddingVertical: moderateScale(5),
    alignItems: 'center',
    alignSelf: 'center',
  },
  brodImg: {
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(25),
    borderColor: 'yellow',
    resizeMode: 'contain',
    width: moderateScale(50),
    height: moderateScale(50),
  },
  brodBtn: {
    // alignItems: 'center'
    marginVertical: moderateScale(8),
  },
  timeTxt: {
    color: colors.red55,
    fontSize: moderateScale(15),
    fontWeight: '800',
    alignSelf: 'center',
  },
  brodView: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: moderateScale(3),
    borderRadius: moderateScale(25),
    // marginLeft: moderateScale(30)
    alignSelf: 'flex-end',
  },
  brodTxt: {
    fontSize: moderateScale(8),
    textAlign: 'center',
  },
  amountTxt: {
    fontWeight: '800',
    color: colors.white,
    fontSize: moderateScale(20),
    alignSelf: 'center',
  },
  bottomContainer: {},
  txt: {
    color: colors.white,
    fontSize: moderateScale(15),
    marginBottom: moderateScale(5),
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(15),
  },
  topLeftSellerDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sellerProfileImg: {
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: 'contain',
    borderRadius: moderateScale(25),
  },
  ratingImgStyle: {
    width: moderateScale(15),
    height: moderateScale(15),
    resizeMode: 'contain',
  },
  sellerNameStyle: {
    fontSize: moderateScale(16),
    fontWeight: '900',
    color: colors.white,
  },
  sellerNameAndRatingCon: {
    paddingHorizontal: moderateScale(7),
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  ratingTxtStyle: {
    fontSize: moderateScale(16),
    fontWeight: '900',
    color: colors.white,
    paddingLeft: moderateScale(5),
  },
  followBtn: {
    backgroundColor: '#F0BD38',
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(25),
    paddingHorizontal: moderateScale(25),
    // width: '20%',
  },
  followBtnTxt: {
    fontSize: moderateScale(17),
    color: colors.black,
    fontWeight: '500',
  },
  soundMoveAndBackArrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  soundMoveAndTxtCon: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingVertical: moderateScale(5),
  },
  soundWaveImgStyle: {
    width: moderateScale(35),
    height: moderateScale(25),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  soundWaveTxt: {
    fontSize: moderateScale(16),
    fontWeight: '900',
    color: colors.white,
  },
  downArrowImgStyle: {
    width: moderateScale(35),
    height: moderateScale(35),
    resizeMode: 'contain',
    marginLeft: moderateScale(20),
    alignSelf: 'flex-start',
  },
  followAndExploreBtnCon: {
    flexDirection: 'row',
    paddingVertical: moderateScale(10),
    justifyContent: 'space-between',
    marginRight: moderateScale(-15),
  },
  exporeBtn: {
    backgroundColor: 'rgba(10,10,10,0.3)',
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(25),
    borderTopLeftRadius: moderateScale(25),
    borderBottomLeftRadius: moderateScale(25),
  },
  exploreTxt: {
    fontSize: moderateScale(17),
    color: colors.white,
    fontWeight: '500',
  },

  winnerCon: {
    backgroundColor: colors.lighBlack,
    flexDirection: 'row',
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(25),
  },
  winnerprofileImgStyle: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: 'contain',
    borderRadius: moderateScale(10),
  },
  winnerNameStyle: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: colors.white,
    paddingHorizontal: moderateScale(5),
  },
  isWinningTxt: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: colors.lightGreen,
  },
  spinner: {
    flex: 1,
  },

  customBidBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    flex: 0.45,
    alignItems: 'center',
    borderRadius: moderateScale(5),
    borderWidth: moderateScale(1),
    borderColor: colors.pinkA2,
  },
  customBidContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),

    // flex: 0.1
  },
  bidBtn: {
    backgroundColor: colors.pinkA2,
    paddingVertical: moderateScale(10),
    alignItems: 'center',
    borderRadius: moderateScale(5),
    marginVertical: moderateScale(10),
  },
  auctionEndedBtn: {
    backgroundColor: colors.transparentBlack,
    alignItems: 'center',
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(10),
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  }
});
