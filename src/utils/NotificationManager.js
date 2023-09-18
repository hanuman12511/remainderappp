import messaging from '@react-native-firebase/messaging';
// import * as CommonFunction from "./CommonFunction";

class NotificationManager {
  constructor() {
    this.initNotification();
  }

  initNotification = () => {
    this.checkPermission();
  };

  //Check whether Push Notifications are enabled or not
  checkPermission = () => {
    messaging()
      .hasPermission()
      .then(async (authStatus) => {
        console.log('hasPermission authStatus1:>>>', authStatus);
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        console.log('hasPermission status2:>>>', enabled);
        if (enabled) {
          this.getToken();
        } else {
          this.requestUserPermission();
        }
      });
  };

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission({
      alert: true,
      badge: false,
      sound: true,
    });
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log("enabled", enabled);
    if (enabled) {
      console.log('Authorization status:>>>', authStatus);
      this.getToken();
    }
  };

  getInitialNotification = callBack => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage != null) {
          console.log('get Initial Notification', remoteMessage.notification);
          callBack(remoteMessage);
        }
      });
  };

  onNotificationTapped = callBack => {
    this.unsubscribeTapNotifListener = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('Tapped Notification', remoteMessage);
        FlashMessageRef.show({ message: "hello notification" });
        callBack(remoteMessage);
      },
    );
  };

  // receive notification in foreground state
  getNotificationInForeground = callBack => {
    this.unsubscribeforegroundMsgListener = messaging().onMessage(
      async notif => {
        console.log("hello forground test 11111", JSON.stringify(notif))
        callBack(notif);
      },
    );
  };

  // receive data in background state
  // getNotificationInBackground = (callBack) => {
  //     this.foregroundMessages = messaging().setBackgroundMessageHandler(async remoteMessage => {
  //         callBack(notif)
  //     });
  // }

  //Get Device Registration Token
  getToken = () => {
    messaging()
      .getToken()
      .then(async fcmToken => {
        if (fcmToken) {
          console.log('fcmToken:>>', fcmToken);
          //  await CommonFunction.saveFCMToken(fcmToken)
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  onTokenRefresh = () => {
    this.unsubscribeTokenRefreshListener = messaging().onTokenRefresh(
      async token => {
        console.log('refresh Token:>>>>', token);
        //  await CommonFunction.saveFCMToken(token)
      },
    );
  };
}

export default new NotificationManager();
