import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Text, useTheme} from 'react-native-elements';
import {push} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {getPostCommentCount} from '../../redux/selectors/PostSelectors';
import analytics from '@react-native-firebase/analytics';
import {kFormatter} from '../helpers';

const PostTotalComments = props => {
  const {theme} = useTheme();

  const {postId, screen} = props;

  const screenType = screen.split('-')[0];

  const commentCount = useSelector(state => getPostCommentCount(state, postId));

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
        color={theme.colors.black0}
        size={18}
        color="#888"
      />
      <Text
        style={{
          fontWeight: 'bold',
          color: theme.colors.black8,
          paddingLeft: 15,
        }}>
        {kFormatter(commentCount)}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(PostTotalComments);
