import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import TimeAgo from '../TimeAgo';
import PostExtraOptions from '../PostExtraOptions';
import {navigate} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {selectCommunityById} from '../../redux/reducers/CommunitySlice';
import {selectUserById} from '../../redux/reducers/UserSlice';
import {
  getPostAuthorId,
  getPostCommunityId,
  getPostCreatedAt,
} from '../../redux/reducers/PostSlice';

const PostHeader = (props) => {
  const postId = props.postId;

  const communityId = useSelector((state) => getPostCommunityId(state, postId));
  const authorid = useSelector((state) => getPostAuthorId(state, postId));
  const postCreatedAt = useSelector((state) => getPostCreatedAt(state, postId));

  const community = useSelector((state) =>
    selectCommunityById(state, communityId),
  );
  const user = useSelector((state) => selectUserById(state, authorid));

  const CommunityName = (
    <TouchableOpacity
      onPress={() =>
        navigate('Community', {
          communityId: community._id,
        })
      }>
      <Text style={{fontSize: 13, fontWeight: 'bold', color: '#432'}}>
        {community.name}
      </Text>
    </TouchableOpacity>
  );

  const UserDisplayName = (
    <TouchableOpacity onPress={() => navigate('Account')}>
      <Text style={{fontSize: 11, paddingRight: 10, color: '#555'}}>
        {user.displayname}
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
            <TimeAgo time={postCreatedAt} />
          </View>
        </View>
      </View>
      <PostExtraOptions postId={postId} optionType={'post'} />
    </View>
  );
};

export default PostHeader;
