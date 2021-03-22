import React, {memo} from 'react';
import {View} from 'react-native';
import Vote from '../Vote';
import PostTotalComments from './PostTotalComments';
import SharePost from './SharePost';

const PostFooter = (props) => {
  const {postId} = props;

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#fafafa',
        justifyContent: 'space-evenly',
      }}>
      <Vote
        id={postId}
        {...props}
        entityType="post"
        style={{
          flex: 3,
          paddingLeft: 10,
        }}
      />
      <PostTotalComments {...props} />
      <SharePost {...props} />
    </View>
  );
};

export default memo(PostFooter);
