import React, {memo, useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {push} from '../../navigation/Ref';
import LinkPostContent from './LinkPostContent';
import TextPostContent from './TextPostContent';
import ImagePostContent from './ImagePostContent';
import VideoPostContent from './VideoPostContent';
import {useSelector} from 'react-redux';
import {getPostType} from '../../redux/selectors/PostSelectors';
import analytics from '@react-native-firebase/analytics';

function PostContent(props) {
  const {theme} = useContext(ThemeContext);
  const {postId, screen} = props;

  const type = useSelector(state => getPostType(state, postId));

  const ContentType =
    type == 'image' || type == 'video' || type == 'gif' ? 'media' : 'textual';

  const DefaultPost = <View></View>;

  function navigateToPostDetail() {
    push('PostDetail', {
      postId: postId,
    });
  }

  const onPressHandler = () => {
    if (type == 'video' || type == 'link') {
    } else {
      const screenType = screen.split('-')[0];
      analytics().logEvent('postdetail_clickedfrom', {
        clicked_from: 'post_content',
        screen: screenType,
      });
      navigateToPostDetail();
    }
  };

  const PostContentWrapper = props => {
    return (
      <View
        style={{
          paddingBottom: type == 'text' ? 10 : 0,
          width: '100%',
          paddingHorizontal: ContentType == 'media' ? 0 : 4,
          backgroundColor:
            ContentType == 'media' ? theme.colors.black1 : theme.colors.primary,
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={
            screen == 'PostDetail' || type == 'video' || type == 'link'
              ? true
              : false
          }
          underlayColor={theme.colors.primary}
          onPress={onPressHandler}>
          {props.children}
        </TouchableOpacity>
      </View>
    );
  };

  const PostType = () => {
    switch (type) {
      case 'text':
        return <TextPostContent {...props} />;
      case 'image':
      case 'gif':
        return <ImagePostContent {...props} />;
      case 'video':
        return <VideoPostContent {...props} />;
      case 'link':
        return <LinkPostContent {...props} />;
      default:
        return DefaultPost;
    }
  };

  return (
    <PostContentWrapper>
      <PostType />
    </PostContentWrapper>
  );
}

export default memo(PostContent);
