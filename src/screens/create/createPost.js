import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import mainClient from '../../client/mainClient';

import ImagePicker from 'react-native-image-crop-picker';
import Header from '../../components/Header';

export default function createPost({ navigation }) {
    const [slug, setSlug] = useState("");
    const [type, setType] = useState("");
    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [community, setCommunity] = useState("");
    const [text, setText] = useState("");
    const [avatarSource, setAvatarSource] = useState("");

    const options = {
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };

    const imageUpload = () => {

        ImagePicker.openPicker({
         //   width: 300,
         //   height: 400,
            cropping: true,
            cropperCircleOverlay:true
        }).then(image => {
            console.log(image);
        });

    }

    const submit = async () => {
        const client = await mainClient;
        client.post('post', {
            community: community,
            text: text,
            slug: slug,
            type: type,
            author: {
                user_id: userId,
                name: name
            },
        }).then(response => {

            console.log('response is', response.data);
        }).catch(error => {
            console.log(error);
        });
    }
    return (
        <View>
            <Header navigation={navigation} />
            <View style={{ height: 40, padding: 10, marginBottom: 10, alignItems: "center" }}>
                <Text>Create Post</Text>
            </View>
            <View>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setCommunity(text)}
                    value={community}
                    placeholder={"Community"}
                />
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setText(text)}
                    value={text}
                    placeholder={"Text"}
                />
                <TextInput
                    style={{ borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setSlug(text)}
                    value={slug}
                    placeholder={"Slug"}
                />
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setType(text)}
                    value={type}
                    placeholder={"Type"}
                />
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setUserId(text)}
                    value={userId}
                    placeholder={"Author ID"}
                />
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={text => setName(text)}
                    value={name}
                    placeholder={"Author Name"}
                />
                <View>
                    <Button title="Image Upload" onPress={() => imageUpload()} />
                </View>
               
                <View>
                    <Button title="Submit" onPress={() => submit()} />
                </View>
            </View>
        </View>
    );
}