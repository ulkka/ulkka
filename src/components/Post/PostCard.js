import React, {memo} from 'react';
import {View, Text} from 'react-native';
import {useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {
  getPostisDeleted,
  getPostAuthorId,
  getPostType,
  getPostisRemoved,
} from '../../redux/selectors/PostSelectors';
import {
  getBlockedUsers,
  getRegisteredUser,
} from '../../redux/reducers/AuthSlice';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostTitle from './PostTitle';
import PostFooter from './PostFooter';
import ErrorBoundary from 'react-native-error-boundary';
import crashlytics from '@react-native-firebase/crashlytics';

const allowedPostTypes = ['text', 'image', 'link', 'gif', 'video'];

function PostCard(props) {
  const {theme} = useTheme();
  const {postId, screen, screenName} = props;
  const isDeleted = useSelector(state => getPostisDeleted(state, postId));
  const isRemoved = useSelector(state => getPostisRemoved(state, postId));
  const postAuthorId = useSelector(state => getPostAuthorId(state, postId));
  const postType = useSelector(state => getPostType(state, postId));
  const blockedUsers = useSelector(getBlockedUsers);
  const registeredUser = useSelector(getRegisteredUser);

  const registeredUserId = registeredUser?._id;

  const isProfile = postAuthorId == registeredUserId;
  const isAuthorBlocked = blockedUsers?.includes(postAuthorId);
  const isPostTypeAllowed = allowedPostTypes.includes(postType);
  const errorFallback = (props: {error: Error, resetError: Function}) => (
    <View></View>
  );

  const errorHandler = (error: Error, stackTrace: string) => {
    console.error('error displaying post content', error);
    crashlytics().recordError(error);
  };

  const PostCardView = (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: theme.colors.background,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 3,
        borderBottomColor: theme.colors.grey0,
        borderBottomWidth: 1,
      }}>
      <View style={{paddingHorizontal: 5}}>
        <PostHeader {...props} />
        <PostTitle {...props} />
      </View>
      <PostContent {...props} />
      <PostFooter {...props} />
    </View>
  );

  const PostDeletedRemovedView = (
    <View
      style={{
        marginHorizontal: 3,
        paddingVertical: 30,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: theme.colors.reddishWhite,
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: theme.colors.black6,
          letterSpacing: 0.5,
          fontWeight: '500',
          textDecorationLine: 'line-through',
        }}>
        {isDeleted ? 'Post deleted' : 'Post removed'}
      </Text>
    </View>
  );

  const PostCardViewHandler = () => {
    if (!isAuthorBlocked && isDeleted !== undefined && isPostTypeAllowed) {
      if (
        isDeleted === true ||
        (isRemoved === true && !screen.startsWith('UserDetail'))
      ) {
        return PostDeletedRemovedView;
      } else {
        if (
          isRemoved === true &&
          screen.startsWith('UserDetail') &&
          !isProfile
        ) {
          return <View></View>;
        } else return PostCardView;
      }
    } else {
      return <View></View>;
    }
  };

  return (
    <ErrorBoundary FallbackComponent={errorFallback} onError={errorHandler}>
      {PostCardViewHandler()}
    </ErrorBoundary>
  );
}

export default memo(PostCard);
