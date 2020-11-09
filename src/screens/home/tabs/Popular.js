import React, {useEffect, useState, useContext} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import mainClient from '../../../client/mainClient';
import {ThemeContext} from 'react-native-elements';
import Post from '../../../components/Post';

function Popular({navigation}) {
  const {theme} = useContext(ThemeContext);

  const [feed, setFeed] = useState([]);

  const loadFeed = async () => {
    const client = await mainClient;
    client
      .get('post?populate=community')
      .then((response) => {
        console.log(
          'Successfully got Popular Feed from server -',
          response.data.length,
        );
        setFeed(response.data);
      })
      .catch((error) => {
        console.log('Error getting Popular Feed from server - ', error);
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
          listKey={'popularlist'}
          data={feed}
          renderItem={renderRow}
          ItemSeparatorComponent={separator}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}

export default Popular;
