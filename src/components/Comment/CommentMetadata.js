import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, Divider} from 'react-native-elements';
import TimeAgo from '../TimeAgo';
import {useSelector} from 'react-redux';
import {selectUserById} from '../../redux/reducers/UserSlice';
import {navigate} from '../../navigation/Ref';
import {selectCommentById} from '../../redux/reducers/CommentSlice';

const CommentMetadata = (props) => {
  const commentId = props.commentId;
  const isCollapsed = props.isCollapsed;

  const comment = useSelector((state) => selectCommentById(state, commentId));
  const user = useSelector((state) => selectUserById(state, comment.author));

  const CommentAuthor = (
    <Text
      style={{
        fontSize: 12,
        fontWeight: '300',
        color: 'darkgreen',
      }}>
      {user.displayname}
    </Text>
  );

  const Seperator = (
    <Divider
      style={{
        backgroundColor: 'white',
        width: 15,
      }}
    />
  );

  const CreatedAt = <TimeAgo time={comment.created_at} />;

  const HeaderLeft = (
    <TouchableOpacity
      onPress={() => navigate('Account')}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {CommentAuthor}
      {Seperator}
      {CreatedAt}
    </TouchableOpacity>
  );

  const HeaderRight = (
    <TouchableOpacity
      style={{flex: 1, alignItems: 'flex-end'}}
      onPress={props.onPressToggleCollapse}>
      {
        <Icon
          name={isCollapsed ? 'expand-more' : 'expand-less'}
          size={16}
          color="#888"
        />
      }
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {HeaderLeft}
      {HeaderRight}
    </View>
  );
};

export default CommentMetadata;
