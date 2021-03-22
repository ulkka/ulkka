import React, {useContext, memo} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostTitle from './PostTitle';
import PostFooter from './PostFooter';

function Post(props) {
  const {theme} = useContext(ThemeContext);

  return (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: theme.colors.background,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 3,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
      }}>
      <View style={{paddingHorizontal: 5}}>
        <PostHeader {...props} />
        <PostTitle {...props} />
      </View>
      <PostContent {...props} />
      <PostFooter {...props} />
    </View>
  );
}

export default memo(Post);
