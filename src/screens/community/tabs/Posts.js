import React, {useEffect, useState, useContext} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import mainClient from '../../../client/mainClient';
import {ThemeContext} from 'react-native-elements';
import Post from '../../../components/Post/Post';

function Posts({route, navigation}) {
  const {theme} = useContext(ThemeContext);

  const [feed, setFeed] = useState([]);
  const [communityId, setCommunityId] = useState(null);

  const loadFeed = async (communityId) => {
    const client = await mainClient;
    client
      .get('post?query={"community":"' + communityId + '"}&populate=community')
      .then((response) => {
        setFeed(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    setCommunityId(route.params.community_id);
  }, []);
  useEffect(() => {
    console.log('in effect communityid ', communityId);
    if (communityId != null) {
      loadFeed(communityId);
    }
  }, [communityId]);

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

export default Posts;
