import notifee, { EventType } from '@notifee/react-native';
import { NavigationContainer } from '@react-navigation/native';

import {
    StripeProvider
} from '@stripe/stripe-react-native';
/* import { Amplify } from 'aws-amplify'; */
import React, { useEffect, useRef } from 'react';
import { LogBox, Platform, StatusBar } from 'react-native';
import Config from "react-native-config";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import config from '../src/';
import FlashMessage from './components/FlashMessage';
import SpinnerLoader from './components/SpinnerLoader';
import setupStore from './data/store';
import RootNavigator from './navigators/StackNavigator';
import { colors } from './themes';
import Constants from './utils/Constants';
import FlashMessageRef, { flashMessageRefObj } from './utils/FlashMessageRef';
import { navigationRef } from './utils/NavigationObject';
import NotificationManager from './utils/NotificationManager';
import { spinnerRef } from './utils/SpinnerRef';

/* Amplify.configure({
    ...config,
    Analytics: {
        disabled: true,
    },
}); */


const store = setupStore()

const Index = () => {
    const notifeeRef = useRef(null)
/* 
    useEffect(() => {
        const init = () => {
            NotificationManager.getInitialNotification(onGetInitialNotificiation);
            NotificationManager.getNotificationInForeground(onNotificationForeground);
            NotificationManager.onNotificationTapped(onNotificationTap);
            notifeeRef.current = notifee.onForegroundEvent(({ type, detail }: any) => {
                console.log("details---", JSON.stringify(detail.notification));

                switch (type) {
                    case EventType.DISMISSED:
                        // navigate("NotificationScreen")
                        console.log('User dismissed foreground notification', detail.notification);
                        break;
                    case EventType.PRESS:
                        getNotificationType(detail.notification.data)
                        // pageNo.current = 1
                        // dispatch(notificationList({"page": pageNo.current, "page_size": pageSize.current}))  
                        // navigate("NotificationScreen")
                        // console.log('User tapped foreground notification', detail.notification.data);
                        break;
                }
            })
        }
        init()
        return () => {
            if (NotificationManager.unsubscribeforegroundMsgListener && NotificationManager.unsubscribeTapNotifListener) {
                NotificationManager.unsubscribeforegroundMsgListener()
                NotificationManager.unsubscribeTapNotifListener()
            }
            if (notifeeRef.current) {
                notifeeRef.current()
            }
        }
    }, [])

    const getNotificationType = (notifType: any) => {
        console.log("Notification type", notifType)
        FlashMessageRef.show({ message: "hello notification" });        // pageNo.current = 1
        // if(notifType.notification_type == "shift_allocation"){
        //     dispatch(shiftAllocationList({"page": pageNo.current, "page_size": pageSize.current}))
        //     navigate("ShiftAllocationScreen")  
        // }else{
        //     dispatch(notificationList({"page": pageNo.current, "page_size": pageSize.current}))  
        //     navigate("NotificationScreen") 
        // }
    }

    const onNotificationTap = (notif: any) => {
        console.log("notifData33", notif.data);
        // pageNo.current = 1
        // dispatch(notificationList({"page": pageNo.current, "page_size": pageSize.current}))  
        // navigate("NotificationScreen")
        getNotificationType(notif.data)
    }

    const onGetInitialNotificiation = (notif: any) => {
        console.log("Notifcation coming >>>>", notif);
        FlashMessageRef.show({ message: "hello notification" });  
        // if(notif.data.notification_type == "shift_allocation"){
        //     navigate("ShiftAllocationScreen")
        // }else{
        //     navigate("NotificationScreen")
        // }
    }

    const onNotificationForeground = async (notifData: any) => {
        console.log("NotifData===", notifData);
        FlashMessageRef.show({ message: "hello notification" });  
        const channelId = await notifee.createChannel({
            id: 'csabuddy-foreground',
            name: 'Default Channel',
        });
        //Display a notification
        await notifee.displayNotification({
            title: notifData.notification.title,
            body: notifData.notification.body,
            data: notifData.data,
            android: {
                channelId,
                //   smallIcon: '@mipmap/ic_notification'
            },
        });
    } */

    useEffect(() => {
        const initApp = () => {
            setStatusBar()
            if (__DEV__) {
                LogBox.ignoreLogs(['Require cycle:', 'EventEmitter.removeListener'])
            } else {
                initSentrySession()
            }
        }
        initApp()
        //unmounting effect
        return () => { }
    }, []);

    const setStatusBar = () => {
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(colors.black01)
        } else {
            // StatusBar.setBarStyle("light-content")
            StatusBar.setBarStyle('light-content')
        }
    }

   /*  const initSentrySession = () => {
        Sentry.init({
            dsn: Constants.SENTRY_SESSION_ID
        });
    } */

    return (
       
            <Provider store={store}>
                <SafeAreaProvider>
                    <NavigationContainer
                        ref={navigationRef} 
                        onReady={() => {
                            SplashScreen.hide();
                        }}>
                     <RootNavigator />  
                        <SpinnerLoader ref={spinnerRef} />
                        <FlashMessage ref={flashMessageRefObj} />
                    </NavigationContainer>
                </SafeAreaProvider>
            </Provider>
      
    )
}

export default Index





