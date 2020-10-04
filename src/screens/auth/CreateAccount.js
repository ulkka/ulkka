import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Button, SocialIcon, Divider } from 'react-native-elements';


export default function CreateAccount() {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
            <View style={{ flex: 3, alignItems: "center", justifyContent: "flex-end", padding: 20 }}>
                <Text style={{ fontWeight: "bold", width: 280, color: "#444", fontSize:18 }}>Welcome to Vellarikka Pattanam</Text>
            </View>
            <View style={{ flex: 3, padding: 15, alignItems: "center", justifyContent: "center", width: "90%", borderColor: "#ddd", borderRadius: 10 }}>
                <View style={{padding:10}}>
                    <TextInput placeholder="Email" />
                    <Divider style={{ backgroundColor: '#ddd', height: 1, width: 300 }} />
                    <TextInput placeholder="Password" passwordRules="minlength: 6" secureTextEntry={true} />
                    <Divider style={{ backgroundColor: '#ddd', height: 1, width: 300 }} />
                    <TextInput placeholder="Confirm Password" passwordRules="minlength: 6" secureTextEntry={true} />
                </View>
                <View style={{ width: "55%" }}>
                    <Button title="Submit"
                        buttonStyle={{
                            backgroundColor: "green",
                            borderRadius: 10,
                            width: "100%",
                            height: 35
                        }}
                        titleStyle={{
                            fontSize: 14
                        }} />
                </View>
            </View>
            <View style={{ flex: 3, alignItems: "center", justifyContent: "center", width: "80%", }}>
                <SocialIcon
                    title='Sign Up With Google'
                    button
                    type='google'
                    onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
                    iconSize={20}
                    style={{
                        width: "80%",
                        height: 45,
                    }}

                />
                <SocialIcon
                    title='Sign Up With Facebook'
                    button
                    type='facebook'
                    onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
                    iconSize={20}
                    style={{
                        width: "80%",
                        height: 45,
                    }}
                />
            </View>
        </View>
    )
}