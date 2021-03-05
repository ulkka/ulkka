import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {navigate} from '../../navigation/Ref';
import {getPostField} from '../../redux/reducers/PostSlice';
import {useSelector} from 'react-redux';

const PostTotalComments = (props) => {
  const postId = props.postId;
  const commentCount = useSelector(getPostField(postId, 'commentCount'));
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.caller != 'PostDetail') {
          navigate('PostDetail', {
            postId: postId,
          });
        }
      }}
      style={{
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon
        name="comment"
        type="material-community"
        color="#000"
        size={18}
        color="#888"
      />
      <Text style={{fontWeight: 'bold', color: '#888', paddingLeft: 15}}>
        {commentCount}
      </Text>
    </TouchableOpacity>
  );
};

export default PostTotalComments;
