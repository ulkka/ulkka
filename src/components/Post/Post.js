import React, {useContext, memo} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostTitle from './PostTitle';
import PostFooter from './PostFooter';

function Post(props) {
  const {theme} = useContext(ThemeContext);

  const {
    postId,
    screen,
    created_at,
    title,
    type,
    description,
    link,
    mediaMetadata,
    height,
    width,
    ogData,
    userVote,
    voteCount,
    commentCount,
    communityDetail,
    authorDetail,
  } = props;

  return (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: theme.colors.background,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 3,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
      }}>
      <View style={{paddingHorizontal: 5}}>
        <PostHeader
          postId={postId}
          createdAt={created_at}
          communityDetail={communityDetail}
          authorDetail={authorDetail}
        />
        <PostTitle postTitle={title} />
      </View>
      <PostContent
        postId={postId}
        screen={screen}
        type={type}
        description={description}
        mediaMetadata={mediaMetadata}
        height={height}
        width={width}
        ogData={ogData}
        link={link}
      />
      <PostFooter
        postId={postId}
        title={title}
        description={description}
        userVote={userVote}
        voteCount={voteCount}
        mediaMetadata={mediaMetadata}
        commentCount={commentCount}
        type={type}
        link={link}
        ogData={ogData}
      />
    </View>
  );
}

export default memo(Post);
