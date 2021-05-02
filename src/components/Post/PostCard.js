import React, {useContext, memo} from 'react';
import {View, Text} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {
  getPostisDeleted,
  getPostAuthorId,
} from '../../redux/selectors/PostSelectors';
import {getBlockedUsers} from '../../redux/reducers/AuthSlice';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostTitle from './PostTitle';
import PostFooter from './PostFooter';

function PostCard(props) {
  const {theme} = useContext(ThemeContext);
  const {postId} = props;
  const isDeleted = useSelector((state) => getPostisDeleted(state, postId));
  const postAuthorId = useSelector((state) => getPostAuthorId(state, postId));
  const blockedUsers = useSelector(getBlockedUsers);

  const isAuthorBlocked = blockedUsers?.includes(postAuthorId);

  return !isAuthorBlocked && isDeleted !== undefined ? (
    isDeleted === false ? (
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
          Post deleted
        </Text>
      </View>
    )
  ) : (
    <View></View>
  );
}

export default memo(PostCard);
