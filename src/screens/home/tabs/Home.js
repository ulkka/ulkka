import React, {useEffect, useContext} from 'react';
import {View, FlatList, SafeAreaView} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import Post from '../../../components/Post';
import FeedFooter from '../../../components/FeedFooter';
import RegisterDeviceToken from '../../../components/RegisterDeviceToken';

function Home(props) {
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    props.feedFetch();
  }, []);

  const renderRow = ({item}) => {
    return <Post item={item} navigation={props.navigation} />;
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
          data={props.feed}
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
