import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon, Divider} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {
  getCommentAuthorDisplayname,
  getCommentCreatedAt,
  getCommentAuthorId,
} from '../../redux/selectors/CommentSelectors';
import TimeAgo from '../TimeAgo';
import {push} from '../../navigation/Ref';

const CommentMetadata = (props) => {
  const {isCollapsed, commentId, onPressToggleCollapse} = props;

  const authorDisplayname = useSelector((state) =>
    getCommentAuthorDisplayname(state, commentId),
  );
  const createdAt = useSelector((state) =>
    getCommentCreatedAt(state, commentId),
  );
  const authorId = useSelector((state) => getCommentAuthorId(state, commentId));

  const CommentAuthor = (
    <Text
      style={{
        fontSize: 12,
        fontWeight: '300',
        color: 'darkgreen',
      }}>
      {authorDisplayname}{' '}
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

  const CreatedAt = <TimeAgo time={createdAt} />;

  const HeaderLeft = (
    <TouchableOpacity
      onPress={() => push('UserDetail', {userId: authorId})}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}>
      {CommentAuthor}
      {Seperator}
      {CreatedAt}
    </TouchableOpacity>
  );

  const HeaderRight = (
    <TouchableOpacity
      style={{flex: 1, alignItems: 'flex-end'}}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      onPress={onPressToggleCollapse}>
      {
        <Icon
          name={isCollapsed ? 'expand-more' : 'expand-less'}
          size={20}
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

export default memo(CommentMetadata);
