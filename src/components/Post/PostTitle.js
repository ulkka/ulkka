import React, {memo} from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {getPostTitle} from '../../redux/selectors/PostSelectors';

const PostTitle = (props) => {
  const {postId} = props;
  const postTitle = useSelector((state) => getPostTitle(state, postId));
  return (
    <View>
      <Text
        style={{
          fontSize: 15,
          paddingVertical: 10,
          marginLeft: 3,
          fontWeight: 'bold',
          color: '#555',
        }}>
        {postTitle}
      </Text>
    </View>
  );
};

export default memo(PostTitle);
