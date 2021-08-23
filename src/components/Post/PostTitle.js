import React, {memo, useContext} from 'react';
import {Text, TouchableOpacity, Platform} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {push} from '../../navigation/Ref';
import {useSelector} from 'react-redux';
import {getPostTitle} from '../../redux/selectors/PostSelectors';
import analytics from '@react-native-firebase/analytics';

const PostTitle = props => {
  const {theme} = useContext(ThemeContext);

  const {postId, screen} = props;

  const screenType = screen.split('-')[0];

  const postTitle = useSelector(state => getPostTitle(state, postId));
  return (
    <TouchableOpacity
      disabled={screenType == 'PostDetail'}
      activeOpacity={0.7}
      onPress={() => {
        analytics().logEvent('postdetail_clickedfrom', {
          clicked_from: 'post_title',
          screen: screenType,
        });
        push('PostDetail', {
          postId: postId,
        });
      }}>
      <Text
        style={{
          fontSize: Platform.OS == 'ios' ? 15 : 14,
          lineHeight: 20,
          paddingVertical: 10,
          marginLeft: 3,
          fontWeight: 'bold',
          color: theme.colors.black5,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {postTitle}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(PostTitle);
