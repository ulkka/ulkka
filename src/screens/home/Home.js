import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import mainClient from '../../client/mainClient';

export default function Home() {

    const [feed, setFeed] = useState([]);

    const loadFeed = async () => {
        const client = await mainClient;
        client.get('post').then(response => {
            console.log('response is', response.data);
            setFeed(response.data);
        }).catch(error => {
            console.log(error);
        });
    }
    useEffect(() => {
        loadFeed();
    }, []);

    const renderRow = ({ item }) => {
        return (<View style={{ borderWidth: 1 }}>
            <Text>Community - {item.community}</Text>
            <Text>By - {item.author.name}</Text>
            <Text>Text - {item.text}</Text>
            <Text>Slug  - {item.slug}</Text>
        </View>

        )
    };
    const separator = () => {
        return (
            <View style={{ padding: 5 }}>
            </View>
        )
    };
    return (
        <View>
            <FlatList
                data={feed}
                renderItem={renderRow}
                ItemSeparatorComponent={separator}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                keyExtractor={item => item._id.toString()}
            />
        </View>
    );
}