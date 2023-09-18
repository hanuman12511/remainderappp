import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CategoriesScreen from '../screens/buyerScreens/CategoriesScreen';
import ForMeScreen from '../screens/buyerScreens/ForMeScreen';
import { colors } from '../themes';
import { moderateScale } from '../utils/ScalingUtils';

function MyTabBar({ state, descriptors, navigation }) {

    return (
        <View style={[styles.tabBarStyle, {
            // backgroundColor: colors.black,
            // marginTop: Platform.OS === 'ios' ? moderateScale(-20): moderateScale(0)

        }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{
                            flex: 1,
                            backgroundColor: colors.black,
                            borderBottomColor: isFocused ? colors.pinkA2 : '#000000',
                            borderBottomWidth: isFocused ? moderateScale(2) : 0,

                        }}
                    >
                        <Text
                            style={[styles.tabText, {
                                color: isFocused ? colors.pinkA2 : '#FFFFFF',
                                alignSelf: 'center',
                            }]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const MyTabs = () => {

    return (
        <Tab.Navigator
            tabBar={(props) => <MyTabBar {...props} />}
        >
            <Tab.Screen name="For me" component={ForMeScreen} />
            <Tab.Screen name="Categories" component={CategoriesScreen} />
        </Tab.Navigator >
    );
}

const Tab = createMaterialTopTabNavigator();

export default function TopTabNav({ navigation }) {


    return (
        <View style={{ flex: 1, }}>

            <MyTabs />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,


    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: moderateScale(15),
    },
    filterBtnHitSlop: {
        width: moderateScale(8),
        height: moderateScale(8),
        left: moderateScale(8),
        right: moderateScale(8)
    },
    filter: {
        width: moderateScale(18),
        height: moderateScale(20),
        resizeMode: 'contain'
    },
    tabText: {
        fontSize: moderateScale(13),
        lineHeight: moderateScale(22),
        paddingVertical: moderateScale(13),
    },
    tabBarStyle: {
        flexDirection: 'row',
    }
})


