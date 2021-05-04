import React from 'react';
import {View} from 'react-native';
import Feed from '../../../components/Feed/Feed';
import CreatePostButtonOverlay from '../../../components/Post/CreatePostButtonOverlay';
import ShareMenuHandler from '../../../components/ShareMenuHandler';
import {
  NotificationHandler,
  ConfigurePushNotification,
} from '../../../components/NotificationHandler';

function Home(props) {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Feed screen="home" />
      <CreatePostButtonOverlay />
      <ShareMenuHandler />
      <ConfigurePushNotification />
      <NotificationHandler />
    </View>
  );
}

export default Home;
