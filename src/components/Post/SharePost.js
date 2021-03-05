import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';

const SharePost = (props) => {
  const postId = props.postId;
  return (
    <TouchableOpacity style={{flex: 3, flexDirection: 'row'}}>
      <Icon name="share" type="font-awesome" size={18} color="#888" />
      <Text
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          paddingLeft: 12,
          color: '#777',
        }}>
        Share
      </Text>
    </TouchableOpacity>
  );
};

export default SharePost;
