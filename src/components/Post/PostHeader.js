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
import CommunityMembershipToggler from './CommunityMembershipToggler';

const PostHeader = (props) => {
  const {postId} = props;

  const createdAt = useSelector((state) => getPostCreatedAt(state, postId));

  const communityId = useSelector((state) => getPostCommunityId(state, postId));
  const communityName = useSelector((state) =>
    getPostCommunityName(state, postId),
  );

  const authorId = useSelector((state) => getPostAuthorId(state, postId));
  const authorDisplayname = useSelector((state) =>
    getPostAuthorDisplayname(state, postId),
  );

  const registeredUser = useSelector(getRegisteredUser);

  const isPostAuthorCurrentUser = authorId === registeredUser?._id;

  const PostAuthorAvatar = (
    <UserAvatar seed={authorDisplayname} size="extra-small" />
  );

  const CommunityAvatar = (
    <UserAvatar seed={communityName ? communityName : 'ULKKA'} size="medium" />
  );

  const CommunityName = (
    <TouchableOpacity
      onPress={() =>
        push('Community', {
          communityId: communityId,
        })
      }>
      <Text
        style={{
          fontSize: 13,
          fontWeight: 'bold',
          color: '#333',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {communityName ? communityName : 'Ulkka'}
      </Text>
    </TouchableOpacity>
  );

  const CommentAuthorDisplaynameColor = isPostAuthorCurrentUser
    ? '#02862ad6'
    : '#444';

  const UserDisplayName = (
    <View>
      <Text
        style={{
          fontSize: 11,
          color: CommentAuthorDisplaynameColor,
          fontWeight: 'bold',
          color: '#777',
          paddingRight: 4,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {authorDisplayname}
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
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => push('UserDetail', {userId: authorId})}>
      {UserDisplayName}
      {PostAuthorAvatar}
      {
        //PostAuthorIcon
      }
    </TouchableOpacity>
  );

  const displayNameTimeAgo = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      {UserDisplayNameWithIcon}
      <Icon
        name="circle"
        type="font-awesome"
        size={5}
        color="#777"
        style={{paddingHorizontal: 10}}
      />
      <TimeAgo time={createdAt} />
    </View>
  );

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {CommunityAvatar}
        <View
          style={{
            padding: 5,
            paddingLeft: 6,
          }}>
          {CommunityName}
          {displayNameTimeAgo}
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CommunityMembershipToggler {...props} />
        <ExtraOptions id={postId} type={'post'} />
      </View>
    </View>
  );
};

export default memo(PostHeader);
