import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import SignIn from '../redux/actions/SignIn';
import MyAccount from '../redux/actions/MyAccount';
import Home from '../screens/home/Home';
import createCommunity from '../screens/create/createCommunity';
import createPost from '../screens/create/createPost';


const StackNav = createStackNavigator();
const DrawerNav = createDrawerNavigator();

const styles = StyleSheet.create({
    logo: {
        height: 44,
        alignSelf: "center",
    }
});

function LogoTitle() {
    return (
        <Image
            resizeMode='contain'
            style={styles.logo}
            source={require('../assets/vellarikka_pattanam.png')}
        />
    );
}

export default function Main(props) {
    return (
        props.auth_state == 'AUTHENTICATED' ?
            <NavigationContainer>
                <DrawerNav.Navigator initialRouteName="Home">
                    <DrawerNav.Screen name="Home" component={Home} title="Home" headerTitle="hh" />
                    <DrawerNav.Screen name="Create Post" component={createPost} title="Create Post" headerTitle="hh" />
                    <DrawerNav.Screen name="Create Community" component={createCommunity} title="Create Community" headerTitle="hh" />
                    <DrawerNav.Screen name="MyAccount" component={MyAccount} title="MyAccount" />
                </DrawerNav.Navigator>
            </NavigationContainer>
            :
            <NavigationContainer>
                <StackNav.Navigator initialRouteName="SignIn">
                    <StackNav.Screen name="SignIn" component={SignIn} title="SignIn"
                        options={
                            {
                                headerTitle: () => <LogoTitle />,
                            }
                        }
                    />
                </StackNav.Navigator>
            </NavigationContainer>
    )
}