import { ChatRoom, DeleteMessageRequest, DisconnectUserRequest, SendMessageRequest } from "amazon-ivs-chat-messaging";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Images from "../assets/images";
import { colors } from "../themes";
import { moderateScale } from "../utils/ScalingUtils";

const config = {
    CHAT_REGION: "us-east-1",
    API_URL: "https://oxbwx4ybt9.execute-api.us-east-1.amazonaws.com/Prod/",
    CHAT_ROOM_ID: "arn:aws:ivschat:us-east-1:522259265868:room/UFA9ewlWzWp4"
}

const uuidv4 = () => {
    // eslint-disable-next-line
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            // eslint-disable-next-line
            var r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
};

const Chat = ({ navigation, route }: any) => {
    const [username, setUsername] = useState("");
    const [moderator, setModerator] = useState(false);
    const [avatar, setAvatar] = useState({});
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<any>([]);
    const [chatRoom, setChatRoom] = useState<any>([]);
    const [tokenObj, setTokenObj] = useState<any>({});

    const chatRef = useRef<any>();
    const messagesEndRef = useRef<any>();

    const userName = route?.params?.username

    const tokenProvider: any = async (selectedUsername: any, isModerator: any, _avatarUrl: { src: any; }) => {
        const uuid = uuidv4();

        const permissions = isModerator
            ? ["SEND_MESSAGE", "DELETE_MESSAGE", "DISCONNECT_USER"]
            : ["SEND_MESSAGE"];

        const data = {
            arn: config.CHAT_ROOM_ID,
            userId: `${selectedUsername}.${uuid}`,
            attributes: {
                username: `${selectedUsername}`,
                avatar: `${''}`,
            },
            capabilities: permissions,
        };

        console.log("chat room data", data)

        var token;
        try {
            const response = await axios.post(`${config.API_URL}/auth`, data);
            console.log("response", response)
            token = {
                token: response.data.token,
                sessionExpirationTime: new Date(response.data.sessionExpirationTime),
                tokenExpirationTime: new Date(response.data.tokenExpirationTime),
            };
        } catch (error) {
            console.error("Error:", error);
        }

        return token;
    }

    useEffect(() => {

        setModerator(false)

        const room = new ChatRoom({
            regionOrUrl: config.CHAT_REGION,
            tokenProvider: () => tokenProvider('jyoti', false, ''),
        });

        setChatRoom(room);

        // Connect to the chat room
        room.connect();


    }, [])


    useEffect(() => {
        // If chat room listeners are not available, do not continue
        if (!chatRoom.addListener) {
            return;
        }

        // Hide the sign in modal


        const unsubscribeOnConnected = chatRoom.addListener('connect', () => {
            console.log("connect")
            // Connected to the chat room.
            renderConnect();
        });

        const unsubscribeOnDisconnected = chatRoom.addListener('disconnect', (_reason: any) => {
            // Disconnected from the chat room.

            console.log("Disconnected from the chat room.");

        });

        const unsubscribeOnUserDisconnect = chatRoom.addListener('userDisconnect', (disconnectUserEvent: { reason: any; }) => {
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
            console.log("userDisconnect");

            renderDisconnect(disconnectUserEvent.reason);
        });

        const unsubscribeOnConnecting = chatRoom.addListener('connecting', () => {
            // Connecting to the chat room.
            console.log('====================================');
            console.log("connecting to chat room");
            console.log('====================================');
        });

        const unsubscribeOnMessageReceived = chatRoom.addListener('message', (message: any) => {
            // Received a message
            const messageType = message.attributes?.message_type || "MESSAGE";
            switch (messageType) {
                case "STICKER":
                    handleSticker(message);
                    break;
                default:
                    handleMessage(message);
                    break;
            }
        });

        const unsubscribeOnEventReceived = chatRoom.addListener('event', (event: any) => {
            // Received an event
            handleEvent(event);
        });

        const unsubscribeOnMessageDeleted = chatRoom.addListener('messageDelete', (deleteEvent: { messageId: any; }) => {
            // Received message delete event
            const messageIdToDelete = deleteEvent.messageId;
            setMessages((prevState: any[]) => {
                // Remove message that matches the MessageID to delete
                const newState = prevState.filter(
                    (item: { messageId: any; }) => item.messageId !== messageIdToDelete
                );
                return newState;
            });
        });

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
        const username = "";
        const userId = "";
        const avatar = "";
        const message = `Error ${data.errorCode}: ${data.errorMessage}`;
        const messageId = "";
        const timestamp = `${Date.now()}`;

        const newMessage = {
            type: "ERROR",
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

    const handleMessage = (data: { sender: { attributes: { username: any; avatar: any; }; userId: any; }; content: any; id: any; sendTime: any; }) => {
        const username = data.sender?.attributes?.username;
        const userId = data.sender?.userId;
        const avatar = data.sender?.attributes.avatar;
        const message = data.content;
        const messageId = data.id;
        const timestamp = data.sendTime;

        const newMessage = {
            type: "MESSAGE",
            timestamp,
            username,
            userId,
            avatar,
            message,
            messageId,
        };

        console.log("newMessage", newMessage)

        setMessages((prevState: any) => {
            return [...prevState, newMessage];
        });
    };

    const handleEvent = (event: { eventName: any; attributes: { userId: any; }; }) => {
        const eventName = event.eventName;
        switch (eventName) {
            case "aws:DELETE_MESSAGE":
                // Ignore system delete message events, as they are handled
                // by the messageDelete listener on the room.
                break;
            case "app:DELETE_BY_USER":
                const userIdToDelete = event.attributes.userId;
                setMessages((prevState: any[]) => {
                    // Remove message that matches the MessageID to delete
                    const newState = prevState.filter(
                        (item: { userId: any; }) => item.userId !== userIdToDelete
                    );
                    return newState;
                });
                break;
            default:
                console.info("Unhandled event received:", event);
        }
    };





    const onSubmitEditing = () => {
        console.log("sibmitedt mesg", message);

        if (message.length > 0) {
            sendMessage(message);
            setMessage("");
        }

    };

    const deleteMessageByUserId = async (userId: any) => {
        // Send a delete event
        try {
            const response = await sendEvent({
                eventName: "app:DELETE_BY_USER",
                eventAttributes: {
                    userId: userId,
                },
            });
            return response;
        } catch (error) {
            return error;
        }
    };

    const handleMessageDelete = async (messageId: string) => {
        const request = new DeleteMessageRequest(messageId, 'Reason for deletion');
        try {
            await chatRoom.deleteMessage(request);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUserKick = async (userId: string) => {
        const request = new DisconnectUserRequest(userId, 'Kicked by moderator');
        try {
            await chatRoom.disconnectUser(request);
            await deleteMessageByUserId(userId);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSticker = (data: { sender: { attributes: { username: any; avatar: any; }; userId: any; }; content: any; attributes: { sticker_src: any; }; id: any; sendTime: any; }) => {
        const username = data.sender.attributes?.username;
        const userId = data.sender.userId;
        const avatar = data.sender.attributes.avatar;
        const message = data.content
        const sticker = data.attributes.sticker_src;
        const messageId = data.id;
        const timestamp = data.sendTime;

        const newMessage = {
            type: "STICKER",
            timestamp,
            username,
            userId,
            avatar,
            message,
            messageId,
            sticker,
        };

        setMessages((prevState: any) => {
            return [...prevState, newMessage];
        });
    };

    const handleStickerSend = async (sticker: { name: any; src: any; }) => {
        const content = `Sticker: ${sticker.name}`;
        const attributes = {
            message_type: "STICKER",
            sticker_src: `${sticker.src}`
        }
        const request = new SendMessageRequest(content, attributes);
        try {
            await chatRoom.sendMessage(request);
        } catch (error) {
            handleError(error);
        }
    };

    const sendMessage = async (message: string) => {
        const content = `${message.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}`;
        const request = new SendMessageRequest(content);
        try {
            await chatRoom.sendMessage(request);
        } catch (error) {
            handleError(error);
        }
    };

    const sendEvent = async (data: { eventName: any; eventAttributes: any; }) => {
        const formattedData = {
            arn: config.CHAT_ROOM_ID,
            eventName: `${data.eventName}`,
            eventAttributes: data.eventAttributes,
        };

        try {
            const response = await axios.post(`${config.API_URL}/event`, formattedData);
            console.info("SendEvent Success:", response.data);
            return response;
        } catch (error) {
            console.error("SendEvent Error:", error);
            return error;
        }
    };

    // Renderers
    const renderErrorMessage = (errorMessage: any) => {
        return (
            <Text>{errorMessage.message}</Text>

        );
    };

    const renderSuccessMessage = (successMessage: any) => {
        return (
            <Text>{successMessage.message}</Text>
        );
    };

    const renderChatLineActions = (_message: { messageId: any; userId: any; }) => {
        return (
            <>
            </>
        );
    };

    const renderStickerMessage = (_message: any) => (
        <>
        </>
    );

    const renderMessage = (message: any) => {
        const formattedMessage = message.message;
        return (
            <></>
        );
    };

    const renderMessages = () => {
        return messages.map((message: { type: any; }) => {
            switch (message.type) {
                case "ERROR":
                    const errorMessage = renderErrorMessage(message);
                    return errorMessage;
                case "SUCCESS":
                    const successMessage = renderSuccessMessage(message);
                    return successMessage;
                case "STICKER":
                    const stickerMessage = renderStickerMessage(message);
                    return stickerMessage;
                case "MESSAGE":
                    const textMessage = renderMessage(message);
                    return textMessage;
                default:
                    console.info("Received unsupported message:", message);
                    return <></>;
            }
        });
    };

    const renderDisconnect = (reason: any) => {
        const error = {
            type: "ERROR",
            timestamp: `${Date.now()}`,
            username: "",
            userId: "",
            avatar: "",
            message: `Connection closed. Reason: ${reason}`,
        };
        setMessages((prevState: any) => {
            return [...prevState, error];
        });
    };

    const renderConnect = () => {
        const status = {
            type: "SUCCESS",
            timestamp: `${Date.now()}`,
            username: "",
            userId: "",
            avatar: "",
            message: `Connected to the chat room.`,
        };
        setMessages((prevState: any) => {
            return [...prevState, status];
        });
    };

    const isChatConnected = () => {
        const chatState = chatRoom.state;
        return chatState === "connected";
    }

    const onMessageChange = (txt: any) => {
        setMessage(txt)
    }

    const onNameChange = (txt: any) => {
        setUsername(txt)
    }

    const onSendBtnPress = () => {
        console.log("message", message)
        if (message.length > 0) {
            sendMessage(message);
            setMessage("");
        }
    }

    console.log("msg arrrr", messages)

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            keyboardShouldPersistTaps={'handled'}
            scrollEnabled={true}
        >


            <View style={{ flex: 1, paddingHorizontal: moderateScale(20) }}>
                {
                    messages.length > 0 ?
                        messages.map((data: any, index: number) => {
                            return (

                                <View key={index}>
                                    {
                                        (data?.username.lenth <= 0 || data?.message === "Connected to the chat room.") ?
                                            <Text style={styles.connectedTxt}>{data?.message + userName}</Text>
                                            :
                                            <>
                                                <Text style={styles.userNameStyle}>{data?.username}</Text>
                                                <Text style={styles.receivedMsgStyle}>{data?.message}</Text>
                                            </>
                                    }

                                </View>
                            )
                        })
                        : null
                }

                <View style={styles.MsgAndSendBtn}>
                    <TextInput
                        // ref={chatRef}
                        ref={chatRef}
                        value={message}
                        style={styles.msgInputStyle}
                        onChangeText={onMessageChange}
                        placeholder={
                            isChatConnected() ? "Say something" : "Waiting to connect..."
                        }
                        onSubmitEditing={onSubmitEditing}
                    />
                    <TouchableOpacity onPress={onSendBtnPress}>
                        <Image
                            source={Images.sendBtn}
                            style={styles.sendBtn}

                        />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default Chat;

const styles = StyleSheet.create({

    contentContainerStyle: {
        flexGrow: 1,
        // justifyContent: 'space-between',
    },
    sendBtn: {
        width: moderateScale(30),
        height: moderateScale(30),
        marginLeft: moderateScale(5)

    },
    msgInputStyle: {
        fontSize: moderateScale(20),
        color: colors.black,
        backgroundColor: colors.white,
        flex: 1,
        borderRadius: moderateScale(5),
        borderWidth: moderateScale(1),
        borderColor: 'gray',
        paddingHorizontal: moderateScale(5)
    },
    MsgAndSendBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginVertical: moderateScale(20)
    },
    modalView: {
        flex: 1,
        justifyContent: 'center'
    },
    modalText: {

    },
    textStyle: {

    },
    userNameStyle: {
        backgroundColor: '#F0D6D6',
        color: 'black',
        fontWeight: '800',

        paddingVertical: moderateScale(2),
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(10),
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: moderateScale(15)
    },
    userNameCon: {

    },
    receivedMsgStyle: {
        backgroundColor: '#ADCEDA',
        color: 'black',
        fontWeight: '800',
        marginBottom: moderateScale(5),
        paddingVertical: moderateScale(10),
        alignSelf: 'flex-start',
        paddingHorizontal: moderateScale(10),
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: moderateScale(15)
    },
    connectedTxt: {
        textAlign: 'center',
        color: 'black',
        marginBottom: moderateScale(5),
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(10),

    }
})

