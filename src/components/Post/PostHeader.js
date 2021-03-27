import React, {memo} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Icon, Avatar} from 'react-native-elements';
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

  const UserDisplayName = (
    <View>
      <Text
        style={{
          fontSize: 13,
          color: '#555',
          fontWeight: 'bold',
        }}>
        {authorDisplayname}
        {'  '}
      </Text>
    </View>
  );

  const displayNameTimeAgo = (
    <View
      style={{
        //flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}>
      {UserDisplayName}
      <TimeAgo time={createdAt} />
    </View>
  );

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <TouchableOpacity
        onPress={() =>
          push('UserDetail', {
            userId: authorId,
          })
        }
        style={{flexDirection: 'row', alignItems: 'center'}}>
        {
          //<Icon name="account-circle" color="#333" size={38} />
          <Avatar
            rounded
            size="small"
            source={{
              uri:
                'https://avatars.dicebear.com/api/bottts/' +
                authorDisplayname +
                '.png',
            }}
            activeOpacity={0.7}
          />
        }
        <View
          style={{
            padding: 5,
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
