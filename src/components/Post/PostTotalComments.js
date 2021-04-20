import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Text} from 'react-native-elements';
import {push} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {getPostCommentCount} from '../../redux/selectors/PostSelectors';
import analytics from '@react-native-firebase/analytics';

const PostTotalComments = (props) => {
  const {postId, screen} = props;

  const screenType = screen.split('-')[0];

  const commentCount = useSelector((state) =>
    getPostCommentCount(state, postId),
  );

  return (
    <TouchableOpacity
      disabled={screen == 'PostDetail' ? true : false}
      hitSlop={{top: 20, bottom: 20}}
      onPress={() => {
        analytics().logEvent('postdetail_clickedfrom', {
          clicked_from: 'post_footer',
          screen: screenType,
        });
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
