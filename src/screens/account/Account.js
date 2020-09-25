import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, SafeAreaView } from 'react-native';
import mainClient from '../../client/mainClient';
import { ThemeContext } from 'react-native-elements';
import Post from '../../components/Post';

function Account({ navigation }) {

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
            <Post item={item} navigation={navigation} />
        )
    };
    const separator = () => {
        return (
            <View style={{ padding: 5 }}>
            </View>
        )
    };

    const ListHeaderComponent = () => {
        return (
            <View style={{
                height: 10,
                backgroundColor: "#fff",
            }}>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <View style={{ flex: 1 }}>
                <FlatList
                    ListHeaderComponent={ListHeaderComponent}
                    data={feed}
                    renderItem={renderRow}
                    ItemSeparatorComponent={separator}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    keyExtractor={item => item._id.toString()}

                />
            </View>
        </SafeAreaView>
    );
}

export default Account;