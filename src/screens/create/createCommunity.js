import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import mainClient from '../../client/mainClient';
import { Button, Icon } from 'react-native-elements';
import Header from '../../components/Header';

export default function createCommunity({ navigation }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const submit = async () => {
        const client = await mainClient;
        client.post('community', {
            name: title,
            Description: description
        }).then(response => {
            console.log('response is', response.data);
        }).catch(error => {
            console.log(error);
        });
    }
    return (
        <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center" }}>
            <Header navigation={navigation} />
            <View style={{ flex: 1, width: "100%",padding:25, }}>
                <View style={{ flex:2,height: 40, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", width: 180,color:"#555" }}>Create Community</Text>
                </View>
                <View style={{flex:5}}>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, borderBottomColor: "#eee" }}
                        onChangeText={text => setTitle(text)}
                        value={title}
                        placeholder={"Title"}
                    />
                    <TextInput
                        style={{ borderColor: 'gray' }}
                        multiline
                        numberOfLines={10}
                        onChangeText={text => setDescription(text)}
                        value={description}
                        placeholder={"Description"}
                    />
                    <View style={{ width: "35%", alignSelf: "center", marginTop:50 }}>
                        <Button
                            buttonStyle={{
                                backgroundColor: "#20bb29c4",
                                borderRadius: 20
                            }}
                            title="Submit" onPress={() => submit()} />
                    </View>
                </View>
            </View>
        </View>
    );
}