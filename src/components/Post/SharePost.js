import React, {memo} from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import {Icon, Text} from 'react-native-elements';

const SharePost = (props) => {
  const postId = props.postId;
  const os = Platform.OS;

  const platFormIcon =
    os == 'ios' ? (
      <Icon name="share-outline" type="ionicon" size={19} color="#888" />
    ) : (
      <Icon name="share" type="font-awesome" size={18} color="#888" />
    );
  return (
    <TouchableOpacity style={{flex: 3, flexDirection: 'row'}}>
      {platFormIcon}
      <Text
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          paddingLeft: os == 'ios' ? 8 : 12,
          paddingTop: os == 'ios' ? 4 : 0,
          color: '#777',
        }}>
        Share
      </Text>
    </TouchableOpacity>
  );
};

export default memo(SharePost);
