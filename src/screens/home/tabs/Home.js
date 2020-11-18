import React, {useEffect, useState, useContext} from 'react';
import {View, FlatList, SafeAreaView, Text, RefreshControl} from 'react-native';
import mainClient from '../../../client/mainClient';
import {ThemeContext} from 'react-native-elements';
import Post from '../../../components/Post';
import FeedFooter from '../../../components/FeedFooter';
import RegisterDeviceToken from '../../../components/RegisterDeviceToken';

function Home({navigation}) {
  const {theme} = useContext(ThemeContext);

  const [feed, setFeed] = useState([]);

  const loadFeed = async () => {
    const client = await mainClient;
    client
      .get('post?populate=community')
      .then((response) => {
        console.log(
          'Successfully got Home Feed from server - ',
          response.data.length,
        );
        setFeed(response.data);
      })
      .catch((error) => {
        console.log('Error getting Home Feed from server -', error);
      });
  };
  useEffect(() => {
    loadFeed();
  }, []);

  const renderRow = ({item}) => {
    return <Post item={item} navigation={navigation} />;
  };
  const separator = () => {
    return <View style={{padding: 5}}></View>;
  };

  const ListHeaderComponent = () => {
    return (
      <View
        style={{
          height: 10,
          backgroundColor: '#fff',
        }}></View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <FlatList
          ListHeaderComponent={ListHeaderComponent}
          listKey={'homelist'}
          data={feed}
          renderItem={renderRow}
          ItemSeparatorComponent={separator}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          keyExtractor={(item) => item._id.toString()}
          ListFooterComponent={<FeedFooter complete={true} />}
        />
      </View>
      <RegisterDeviceToken />
    </SafeAreaView>
  );
}

export default Home;
