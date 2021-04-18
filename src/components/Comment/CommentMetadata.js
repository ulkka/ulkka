import React, {memo} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
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

const CommentMetadata = (props) => {
  const {isCollapsed, commentId, onPressToggleCollapse} = props;

  const authorDisplayname = useSelector((state) =>
    getCommentAuthorDisplayname(state, commentId),
  );
  const createdAt = useSelector((state) =>
    getCommentCreatedAt(state, commentId),
  );
  const authorId = useSelector((state) => getCommentAuthorId(state, commentId));
  const postAuthorId = useSelector((state) =>
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
    ? '#02862ad6'
    : isCommentAuthorPostAuthor
    ? '#245a89d6'
    : '#444';

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
        }}>
        {authorDisplayname} {Platform.OS != 'ios' && ' '}
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
      style={{flex: 1, alignItems: 'flex-end'}}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      onPress={onPressToggleCollapse}>
      {
        <Icon
          name={isCollapsed ? 'expand-more' : 'expand-less'}
          size={20}
          color="#888"
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
