
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomSideDrawer from '../navigators/CustomSideDrawer';
import OrdersScreen from '../screens/buyerScreens/OrdersScreen';
import SettingScreens from '../screens/buyerScreens/SettingScreens';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        swipeEnabled: false,
        drawerType: 'front',
      }}
      drawerContent={props => <CustomSideDrawer {...props} />}>
      <Drawer.Screen name="SettingScreens" component={SettingScreens} />
      <Drawer.Screen name="OrdersScreen" component={OrdersScreen} />
    </Drawer.Navigator>
  );
}
export default DrawerNavigation;
