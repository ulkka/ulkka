import React, {useContext, memo} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {useSelector} from 'react-redux';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostTitle from './PostTitle';
import PostFooter from './PostFooter';
import {selectPostById} from '../../redux/reducers/PostSlice';

function Post(props) {
  const {theme} = useContext(ThemeContext);

  const {postId, caller} = props;
  const post = useSelector((state) => selectPostById(state, postId));
  const {
    community,
    author,
    created_at,
    title,
    type,
    description,
    mediaMetadata,
    ogData,
    userVote,
    voteCount,
    commentCount,
  } = post;

  return (
    <View
      style={{
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: theme.colors.background,
        width: '100%',
        paddingVertical: 10,
      }}>
      <View style={{paddingHorizontal: 5}}>
        <PostHeader
          postId={postId}
          communityId={community}
          createdAt={created_at}
          authorId={author}
        />
        <PostTitle postTitle={title} />
      </View>
      <PostContent
        postId={postId}
        caller={caller}
        type={type}
        description={description}
        mediaMetadata={mediaMetadata}
        ogData={ogData}
      />
      <PostFooter
        postId={postId}
        userVote={userVote}
        voteCount={voteCount}
        commentCount={commentCount}
      />
    </View>
  );
}

export default memo(Post);
