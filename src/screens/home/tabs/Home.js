import React from 'react';
import {View} from 'react-native';
import Feed from '../../../components/Feed/Feed';
import CreatePostButtonOverlay from '../../../components/Post/CreatePostButtonOverlay';
import ShareMenuHandler from '../../../components/ShareMenuHandler';
import NotificationHandler from '../../../components/NotificationHandler';

function Home(props) {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Feed screen="home" />
      <CreatePostButtonOverlay />
      <ShareMenuHandler />
      <NotificationHandler />
    </View>
  );
}

export default Home;
