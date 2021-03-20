import React from 'react';
import {View} from 'react-native';
import Feed from '../../../components/Feed';
import CreatePostButtonOverlay from '../../../components/Post/CreatePostButtonOverlay';

function Home(props) {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Feed screen="home" />
      <CreatePostButtonOverlay />
    </View>
  );
}

export default Home;
