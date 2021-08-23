import React, {memo} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {
  getCommentAuthorDisplayname,
  getCommentCreatedAt,
  getCommentAuthorId,
  getCommentPostAuthor,
} from '../../redux/selectors/CommentSelectors';
import {getRegisteredUser} from '../../redux/reducers/AuthSlice';
import TimeAgo from '../TimeAgo';
import {push} from '../../navigation/Ref';
import UserAvatar from '../UserAvatar';

const CommentMetadata = props => {
  const {theme} = useTheme();
  const {isCollapsed, commentId, onPressToggleCollapse} = props;

  const authorDisplayname = useSelector(state =>
    getCommentAuthorDisplayname(state, commentId),
  );
  const createdAt = useSelector(state => getCommentCreatedAt(state, commentId));
  const authorId = useSelector(state => getCommentAuthorId(state, commentId));
  const postAuthorId = useSelector(state =>
    getCommentPostAuthor(state, commentId),
  );
  const registeredUser = useSelector(getRegisteredUser);

  const isCommentAuthorPostAuthor = authorId === postAuthorId;
  const isCommentAuthorCurrentUser = authorId === registeredUser?._id;

  const CommentAuthorIcon = (isCommentAuthorPostAuthor ||
    isCommentAuthorCurrentUser) && (
    <Icon
      name={isCommentAuthorCurrentUser ? 'user' : 'pencil'}
      type="font-awesome"
      size={11}
      color="#0CD7B8"
      style={{marginLeft: 3}}
    />
  );

  const CommentAuthorDisplaynameColor = isCommentAuthorCurrentUser
    ? theme.colors.green
    : isCommentAuthorPostAuthor
    ? theme.colors.blue
    : theme.colors.black4;

  const CommentAuthor = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '300',
          fontWeight: '500',
          color: CommentAuthorDisplaynameColor,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {authorDisplayname}
      </Text>
      {CommentAuthorIcon}
    </View>
  );

  const Seperator = (
    <Icon
      name="circle"
      type="font-awesome"
      size={4}
      color="#aaa"
      style={{paddingHorizontal: 5}}
    />
  );

  const avatar = <UserAvatar seed={authorDisplayname} size="small" />;

  const CreatedAt = <TimeAgo time={createdAt} />;

  const HeaderLeft = (
    <TouchableOpacity
      onPress={() => push('UserDetail', {userId: authorId})}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {avatar}
      <View
        style={{
          paddingHorizontal: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {CommentAuthor}
        {Seperator}
        {CreatedAt}
      </View>
    </TouchableOpacity>
  );

  const HeaderRight = (
    <TouchableOpacity
      style={{flex: 1, alignItems: 'flex-end', marginRight: 11}}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      onPress={onPressToggleCollapse}>
      {
        <Icon
          name={isCollapsed ? 'expand-more' : 'expand-less'}
          size={23}
          color="#777"
        />
      }
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {HeaderLeft}
      {HeaderRight}
    </View>
  );
};

export default memo(CommentMetadata);
