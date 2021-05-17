import React, {useContext, memo} from 'react';
import {View, Text} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {
  getPostisDeleted,
  getPostAuthorId,
  getPostType,
  getPostisRemoved,
} from '../../redux/selectors/PostSelectors';
import {getBlockedUsers} from '../../redux/reducers/AuthSlice';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostTitle from './PostTitle';
import PostFooter from './PostFooter';
import ErrorBoundary from 'react-native-error-boundary';
import crashlytics from '@react-native-firebase/crashlytics';

const allowedPostTypes = ['text', 'image', 'link', 'gif', 'video'];

function PostCard(props) {
  const {theme} = useContext(ThemeContext);
  const {postId} = props;
  const isDeleted = useSelector((state) => getPostisDeleted(state, postId));
  const isRemoved = useSelector((state) => getPostisRemoved(state, postId));
  const postAuthorId = useSelector((state) => getPostAuthorId(state, postId));
  const postType = useSelector((state) => getPostType(state, postId));
  const blockedUsers = useSelector(getBlockedUsers);

  const isAuthorBlocked = blockedUsers?.includes(postAuthorId);
  const isPostTypeAllowed = allowedPostTypes.includes(postType);

  const errorFallback = (props: {error: Error, resetError: Function}) => (
    <View></View>
  );

  const errorHandler = (error: Error, stackTrace: string) => {
    console.log('error displaying post content', error);
    crashlytics().recordError(error);
  };

  return (
    <ErrorBoundary FallbackComponent={errorFallback} onError={errorHandler}>
      {!isAuthorBlocked && isDeleted !== undefined && isPostTypeAllowed ? (
        isDeleted === false && isRemoved === false ? (
          <View
            style={{
              alignSelf: 'center',
              backgroundColor: theme.colors.background,
              width: '100%',
              paddingTop: 10,
              paddingBottom: 3,
              borderBottomColor: '#fafafa',
              borderBottomWidth: 1,
            }}>
            <View style={{paddingHorizontal: 5}}>
              <PostHeader {...props} />
              <PostTitle {...props} />
            </View>
            <PostContent {...props} />
            <PostFooter {...props} />
          </View>
        ) : (
          <View
            style={{
              marginHorizontal: 3,
              paddingVertical: 30,
              borderRadius: 10,
              paddingHorizontal: 10,
              backgroundColor: '#ffeded',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#666',
                letterSpacing: 0.5,
                fontWeight: '500',
                textDecorationLine: 'line-through',
              }}>
              {isDeleted ? 'Post deleted' : 'Post removed'}
            </Text>
          </View>
        )
      ) : (
        <View></View>
      )}
    </ErrorBoundary>
  );
}

export default memo(PostCard);
