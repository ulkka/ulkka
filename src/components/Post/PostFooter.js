import React, {memo} from 'react';
import {View} from 'react-native';
import Vote from '../Vote';
import PostTotalComments from './PostTotalComments';
import SharePost from './SharePost';

const PostFooter = (props) => {
  const {postId, userVote, voteCount, commentCount} = props;

  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        justifyContent: 'space-evenly',
      }}>
      <Vote
        id={postId}
        userVote={userVote}
        voteCount={voteCount}
        entityType="post"
        style={{
          flex: 3,
          paddingLeft: 10,
        }}
      />
      <PostTotalComments commentCount={commentCount} postId={postId} />
      <SharePost postId={postId} />
    </View>
  );
};

export default memo(PostFooter);
