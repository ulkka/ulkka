import React, {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import TimeAgo from '../TimeAgo';
import PostExtraOptions from '../PostExtraOptions';
import {push} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {
  getPostAuthorId,
  getPostAuthorDisplayname,
  getPostCommunityId,
  getPostCommunityName,
  getPostCreatedAt,
} from '../../redux/selectors/PostSelectors';

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

  const CommunityName = (
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
  );

  const UserDisplayName = (
    <TouchableOpacity
      onPress={() =>
        push('UserDetail', {
          userId: authorId,
        })
      }>
      <Text style={{fontSize: 11, color: '#555'}}>{authorDisplayname}</Text>
    </TouchableOpacity>
  );

  const displayNameTimeAgo = (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {UserDisplayName}
      <View
        style={{
          paddingHorizontal: 7,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="circle" type="font-awesome" size={4} color="#888" />
      </View>
      <TimeAgo time={createdAt} />
    </View>
  );

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={{flexDirection: 'row'}}>
        <Icon name="account-circle" color="#333" size={32} />
        <View
          style={{
            padding: 5,
          }}>
          {CommunityName}
          {displayNameTimeAgo}
        </View>
      </View>
      <PostExtraOptions postId={postId} optionType={'post'} />
    </View>
  );
};

export default memo(PostHeader);
