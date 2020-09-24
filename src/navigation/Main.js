import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Header from '../components/Header';

import SignIn from '../redux/actions/SignIn';
import MyAccount from '../redux/actions/MyAccount';
import Home from '../screens/home/Home';
import createCommunity from '../screens/create/createCommunity';
import createPost from '../screens/create/createPost';


const StackNav = createStackNavigator();
const DrawerNav = createDrawerNavigator();



export default function Main(props) {
    return (
        props.auth_state == 'AUTHENTICATED' ?
            <NavigationContainer >
                <DrawerNav.Navigator initialRouteName="Home"
                    drawerContentOptions={{
                        activeTintColor: "#e91e63",
                        itemStyle: { marginVertical: 5 },
                         activeBackgroundColor:"#ffe"
                    }}
                    screenOptions={{
                        headerTitle: () => <Header />,
                    }}
                >
                    <DrawerNav.Screen name="Home" component={Home} title="Home"  />
                    <DrawerNav.Screen name="Create Post" component={createPost} title="Create Post" />
                    <DrawerNav.Screen name="Create Community" component={createCommunity} title="Create Community" />
                    <DrawerNav.Screen name="MyAccount" component={MyAccount} title="MyAccount" />
                </DrawerNav.Navigator>
            </NavigationContainer >
            :
            <NavigationContainer>
                <StackNav.Navigator initialRouteName="SignIn" screenOptions={
                    {
                        headerTitle: () => <Header />,
                    }
                }>
                    <StackNav.Screen name="SignIn" component={SignIn} title="SignIn"

                    />
                </StackNav.Navigator>
            </NavigationContainer>
    )
}