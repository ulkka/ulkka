import React, {memo} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {push} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {getPostTitle} from '../../redux/selectors/PostSelectors';
import analytics from '@react-native-firebase/analytics';

const PostTitle = (props) => {
  const {postId, screen} = props;

  const screenType = screen.split('-')[0];

  const postTitle = useSelector((state) => getPostTitle(state, postId));
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        analytics().logEvent('postdetail_clickedfrom', {
          clicked_from: 'post_title',
          screen: screenType,
        });
        push('PostDetail', {
          postId: postId,
        });
      }}>
      <Text
        style={{
          fontSize: 15,
          paddingVertical: 10,
          marginLeft: 3,
          fontWeight: 'bold',
          color: '#444',
        }}>
        {postTitle}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(PostTitle);
