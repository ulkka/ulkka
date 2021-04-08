import React, {memo} from 'react';
import {View, TouchableOpacity, Text, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import TimeAgo from '../TimeAgo';
import ExtraOptions from '../ExtraOptions';
import {push} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {
  getPostAuthorId,
  getPostAuthorDisplayname,
  getPostCommunityId,
  getPostCommunityName,
  getPostCreatedAt,
} from '../../redux/selectors/PostSelectors';
import {getRegisteredUser} from '../../redux/reducers/AuthSlice';
import UserAvatar from '../UserAvatar';

const PostHeader = (props) => {
  const {postId} = props;

  const createdAt = useSelector((state) => getPostCreatedAt(state, postId));

  /*const communityId = useSelector((state) => getPostCommunityId(state, postId));
  const communityName = useSelector((state) =>
    getPostCommunityName(state, postId),
  );*/

  const authorId = useSelector((state) => getPostAuthorId(state, postId));
  const authorDisplayname = useSelector((state) =>
    getPostAuthorDisplayname(state, postId),
  );

  const registeredUser = useSelector(getRegisteredUser);

  const isPostAuthorCurrentUser = authorId === registeredUser?._id;

  /*const CommunityName = (
    <TouchableOpacity
      onPress={() =>
        push('Community', {
          communityId: communityId,
        })
      }>
      <Text style={{fontSize: 13, fontWeight: 'bold', color: '#432'}}>
        {communityName}
      </Text>
    </TouchableOpacity>
  );*/

  const CommentAuthorDisplaynameColor = isPostAuthorCurrentUser
    ? '#02862ad6'
    : '#555';

  const UserDisplayName = (
    <View>
      <Text
        style={{
          fontSize: 13,
          color: CommentAuthorDisplaynameColor,
          fontWeight: 'bold',
        }}>
        {authorDisplayname}
        {'  '}
      </Text>
    </View>
  );

  const PostAuthorIcon = isPostAuthorCurrentUser && (
    <Icon
      name={isPostAuthorCurrentUser ? 'user' : 'star'}
      type="font-awesome"
      size={12}
      color="#0CD7B8"
      style={{marginLeft: Platform.OS == 'ios' ? 0 : 5}}
    />
  );

  const UserDisplayNameWithIcon = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {UserDisplayName}
      {PostAuthorIcon}
    </View>
  );

  const displayNameTimeAgo = (
    <View
      style={{
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}>
      {UserDisplayNameWithIcon}
      <TimeAgo time={createdAt} />
    </View>
  );

  const PostAuthorAvatar = (
    <UserAvatar seed={authorDisplayname} size="medium" />
  );

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <TouchableOpacity
        onPress={() =>
          push('UserDetail', {
            userId: authorId,
          })
        }
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {PostAuthorAvatar}
        <View
          style={{
            padding: 5,
            paddingLeft: 6,
          }}>
          {
            // CommunityName
          }
          {displayNameTimeAgo}
        </View>
      </TouchableOpacity>
      <ExtraOptions id={postId} type={'post'} />
    </View>
  );
};

export default memo(PostHeader);
