import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {push} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {getPostCommentCount} from '../../redux/selectors/PostSelectors';

const PostTotalComments = (props) => {
  const {postId, screen} = props;

  const commentCount = useSelector((state) =>
    getPostCommentCount(state, postId),
  );

  return (
    <TouchableOpacity
      disabled={screen == 'PostDetail' ? true : false}
      hitSlop={{top: 20, bottom: 20}}
      onPress={() => {
        push('PostDetail', {
          postId: postId,
        });
      }}
      style={{
        marginHorizontal: 20,
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon
        name="comment-outline"
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
