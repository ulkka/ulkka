import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import mainClient from '../../client/mainClient';


export default function createCommunity() {
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
        <View>
            <View style={{ height: 40, padding: 10, marginBottom: 10, alignItems: "center" }}>
                <Text>Create Community</Text>
            </View>
            <View>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setTitle(text)}
                    value={title}
                    placeholder={"Title"}
                />
                <TextInput
                    style={{ borderColor: 'gray', borderWidth: 1 }}
                    multiline
                    numberOfLines={4}
                    onChangeText={text => setDescription(text)}
                    value={description}
                    placeholder={"Description"}
                />
                <View>
                    <Button title="Submit" onPress={() => submit()} />
                </View>
            </View>
        </View>
    );
}