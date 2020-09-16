import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/home/Home';

const MainNav = createStackNavigator();
const styles = StyleSheet.create({
    logo: {
        width: '75%',
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


export default function Main() {

    return (
        <NavigationContainer>
            <MainNav.Navigator>
                <MainNav.Screen name="Home" component={Home} title="Home"
                    options={
                        {
                            headerTitle: () => <LogoTitle />,
                        }
                    }
                />
            </MainNav.Navigator>
        </NavigationContainer>
    );
}