import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import mainClient from '../../client/mainClient';
import { ThemeContext } from 'react-native-elements';
import HeaderBar from '../../components/Header';

function Home({ navigation }) {

    const { theme } = useContext(ThemeContext);

    const [feed, setFeed] = useState([]);

    const loadFeed = async () => {
        const client = await mainClient;
        client.get('post').then(response => {
            console.log('response is', response.data);
            setFeed(response.data);
        }).catch(error => {
            console.log(error);
        });
        console.log(theme.colors.primary);
    }
    useEffect(() => {
        loadFeed();

    }, []);

    const renderRow = ({ item }) => {
        return (
            <View style={
                {
                    borderWidth: 1,
                    backgroundColor: theme.colors.background
                }
            }>
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
            <View>
                <HeaderBar navigation={navigation} />
            </View>
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

export default Home;