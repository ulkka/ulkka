import React, {useContext, memo} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostTitle from './PostTitle';
import PostFooter from './PostFooter';

function Post(props) {
  const {theme} = useContext(ThemeContext);
  const postId = props.postId;

  return (
    <View
      style={{
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: theme.colors.background,
        width: '100%',
        paddingVertical: 10,
      }}>
      <View style={{paddingHorizontal: 5}}>
        <PostHeader postId={postId} />
        <PostTitle postId={postId} />
      </View>
      <PostContent postId={postId} caller={props.caller} />
      <PostFooter postId={postId} />
    </View>
  );
}

export default memo(Post);
