import React from 'react';
import {View, Text} from 'react-native';
import {getPostTitle} from '../../redux/reducers/PostSlice';
import {useSelector} from 'react-redux';

const PostTitle = (props) => {
  const postTitle = useSelector((state) => getPostTitle(state, props.postId));

  return (
    <View>
      <Text
        style={{
          fontSize: 15,
          paddingVertical: 10,
          fontWeight: 'bold',
          color: '#555',
        }}>
        {postTitle}
      </Text>
    </View>
  );
};

export default PostTitle;
