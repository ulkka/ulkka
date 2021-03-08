import React, {memo} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import TimeAgo from '../TimeAgo';
import PostExtraOptions from '../PostExtraOptions';
import {navigate} from '../../navigation/Ref';

const PostHeader = (props) => {
  const {
    postId,
    createdAt,
    communityName,
    authorDisplayname,
    communityId,
    authorId,
  } = props;

  const CommunityName = (
    <TouchableOpacity
      onPress={() =>
        navigate('Community', {
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
        navigate('Account', {
          userId: authorId,
        })
      }>
      <Text style={{fontSize: 11, paddingRight: 10, color: '#555'}}>
        {authorDisplayname}
      </Text>
    </TouchableOpacity>
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
          <View style={{flexDirection: 'row'}}>
            {UserDisplayName}
            <TimeAgo time={createdAt} />
          </View>
        </View>
      </View>
      <PostExtraOptions postId={postId} optionType={'post'} />
    </View>
  );
};

export default memo(PostHeader);
