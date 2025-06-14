import React, {memo} from 'react';
import {View, TouchableOpacity, Text, Platform} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
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
  getPostisRemoved,
  getPostIsPinned,
} from '../../redux/selectors/PostSelectors';
import {getRegisteredUser} from '../../redux/reducers/AuthSlice';
import UserAvatar from '../UserAvatar';
import CommunityMembershipToggler from './CommunityMembershipToggler';
import CommunityAvatar from '../CommunityAvatar';

const PostHeader = props => {
  const {theme} = useTheme();

  const {postId, screen} = props;

  const screenType = screen.split('-')[0];

  const isCommunityDetail = screenType == 'CommunityDetail';

  const createdAt = useSelector(state => getPostCreatedAt(state, postId));

  const communityId = useSelector(state => getPostCommunityId(state, postId));
  const communityName = useSelector(state =>
    getPostCommunityName(state, postId),
  );

  const authorId = useSelector(state => getPostAuthorId(state, postId));
  const authorDisplayname = useSelector(state =>
    getPostAuthorDisplayname(state, postId),
  );
  const isRemoved = useSelector(state => getPostisRemoved(state, postId));

  const registeredUser = useSelector(getRegisteredUser);

  const isPostAuthorCurrentUser = authorId === registeredUser?._id;

  const isPinned = useSelector(state => getPostIsPinned(state, postId));

  const PostAuthorAvatar = (
    <TouchableOpacity onPress={() => push('UserDetail', {userId: authorId})}>
      <UserAvatar seed={authorDisplayname} size="medium" />
    </TouchableOpacity>
  );

  const CommunityName = (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center'}}
      onPress={() =>
        push('CommunityNavigation', {
          communityId: communityId,
        })
      }>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: theme.colors.black6,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {communityName ? communityName : 'Ulkka'}
      </Text>
    </TouchableOpacity>
  );

  const CommentAuthorDisplaynameColor = isPostAuthorCurrentUser
    ? theme.colors.green
    : theme.colors.black7;

  const UserDisplayName = (
    <View>
      <Text
        style={{
          fontSize: isCommunityDetail ? 13 : 12,
          color: CommentAuthorDisplaynameColor,
          ...(isCommunityDetail && {fontWeight: 'bold'}),
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
    </TouchableOpacity>
  );

  const displayNameTimeAgo = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {UserDisplayNameWithIcon}

      <Icon
        name="circle"
        type="font-awesome"
        size={5}
        color="#999"
        style={{paddingHorizontal: 10}}
      />

      <TimeAgo time={createdAt} />
    </View>
  );

  const pinIcon = (
    <View>
      <Icon
        name="pin"
        type="material-community"
        size={16}
        color={theme.colors.green}
        style={{paddingHorizontal: 10}}
      />
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
        {!isCommunityDetail ? (
          <CommunityAvatar
            communityName={communityName}
            communityId={communityId}
            size="small"
          />
        ) : (
          PostAuthorAvatar
        )}
        <View
          style={{
            padding: 5,
            paddingLeft: 6,
          }}>
          {!isCommunityDetail && CommunityName}
          {displayNameTimeAgo}
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {isPinned && pinIcon}
        <CommunityMembershipToggler {...props} />
        {isRemoved && (
          <View
            style={{
              backgroundColor: 'rgba(256, 0, 0, 0.5)',
              padding: 5,
              borderRadius: 5,
            }}>
            <Text style={{fontSize: 12, color: theme.colors.black4}}>
              Post removed
            </Text>
          </View>
        )}
        <ExtraOptions id={postId} type={'post'} />
      </View>
    </View>
  );
};

export default memo(PostHeader);
