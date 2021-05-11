import React, {memo} from 'react';
import {View} from 'react-native';
import Feed from '../../../components/Feed/Feed';
import CreatePostButtonOverlay from '../../../components/Post/CreatePostButtonOverlay';

function Popular(props) {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Feed screen="popular" {...props} />
      <CreatePostButtonOverlay />
    </View>
  );
}

export default memo(Popular);
