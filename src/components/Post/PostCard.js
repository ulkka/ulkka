import React, {useContext, memo} from 'react';
import {View, Text} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getPostisDeleted} from '../../redux/selectors/PostSelectors';
import PostContent from './PostContent';
import PostHeader from './PostHeader';
import PostTitle from './PostTitle';
import PostFooter from './PostFooter';

function PostCard(props) {
  const {theme} = useContext(ThemeContext);
  const {postId} = props;
  const isDeleted = useSelector((state) => getPostisDeleted(state, postId));
  return !isDeleted ? (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: theme.colors.background,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 3,
        borderBottomColor: '#fafafa',
        borderBottomWidth: 1,
      }}>
      <View style={{paddingHorizontal: 5}}>
        <PostHeader {...props} />
        <PostTitle {...props} />
      </View>
      <PostContent {...props} />
      <PostFooter {...props} />
    </View>
  ) : (
    <View
      style={{
        marginHorizontal: 3,
        paddingVertical: 30,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#ffeded',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: '#444',
          letterSpacing: 0.5,
          fontWeight: '500',
          textDecorationLine: 'line-through',
        }}>
        Post deleted
      </Text>
    </View>
  );
}

export default memo(PostCard);
