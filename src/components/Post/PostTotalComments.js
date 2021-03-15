import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {navigate} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {getPostField} from '../../redux/selectors/PostSelectors';

const PostTotalComments = (props) => {
  const {postId} = props;

  const commentCount = useSelector((state) =>
    getPostField(state, postId, 'commentCount'),
  );
  return (
    <TouchableOpacity
      hitSlop={{top: 20, bottom: 20}}
      onPress={() => {
        if (props.caller != 'PostDetail') {
          navigate('PostDetail', {
            postId: postId,
          });
        }
      }}
      style={{
        marginHorizontal: 20,
        flex: 5,
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

export default memo(PostTotalComments);
