import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { enableScreens } from 'react-native-screens';

import MyAccount from '../redux/actions/MyAccount';
import Splash from '../redux/actions/Splash';
import SignIn from '../redux/actions/SignIn';
import CreateAccount from '../screens/auth/CreateAccount';

import { navigationRef } from '../screens/auth/AuthNavigation';
import HomeNavigation from '../screens/home/HomeNavigation';
import createCommunity from '../screens/create/createCommunity';
import createPost from '../screens/create/createPost';


const StackNav = createStackNavigator();
const DrawerNav = createDrawerNavigator();

enableScreens();

export default function Main(props) {
    return (
        props.auth_state == 'AUTHENTICATED' ?
            <NavigationContainer >
                <DrawerNav.Navigator initialRouteName="Home" drawerContentOptions={{ activeTintColor: "#e91e63", itemStyle: { marginVertical: 5 }, activeBackgroundColor: "#ffe" }}                >
                    <DrawerNav.Screen name="Home" component={HomeNavigation} title="Home" />
                    <DrawerNav.Screen name="Create Post" component={createPost} title="Create Post" />
                    <DrawerNav.Screen name="Create Community" component={createCommunity} title="Create Community" />
                    <DrawerNav.Screen name="My Account" component={MyAccount} title="MyAccount" />
                </DrawerNav.Navigator>
            </NavigationContainer >
            : props.auth_state == 'UNAUTHENTICATED' ?
                <NavigationContainer ref={navigationRef}>
                    <StackNav.Navigator initialRouteName="SignIn" screenOptions={{
                        headerShown: false
                    }}
                    >
                        <StackNav.Screen name="SignIn" component={SignIn} title="SignIn" />
                        <StackNav.Screen name="CreateAccount" component={CreateAccount} title="CreateAccount" />
                    </StackNav.Navigator >
                </NavigationContainer>
                :
                <NavigationContainer>
                    <StackNav.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                        <StackNav.Screen name="Splash" component={Splash} title="Splash" />
                    </StackNav.Navigator>
                </NavigationContainer>
    )
}