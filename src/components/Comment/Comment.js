import React, {useState, memo} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import CommentMetadata from './CommentMetadata';
import CommentBody from './CommentBody';
import CommentFooter from './CommentFooter';
import {
  getCommentisDeleted,
  getCommentisRemoved,
} from '../../redux/selectors/CommentSelectors';
import analytics from '@react-native-firebase/analytics';

function Comment(props) {
  const {theme} = useTheme();
  const {commentId, children, level} = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    analytics().logEvent('comment_togglecollapse', {value: !isCollapsed});
    setIsCollapsed(!isCollapsed);
  };
  const isCommentDeleted = useSelector(state =>
    getCommentisDeleted(state, commentId),
  );
  const isCommentRemoved = useSelector(state =>
    getCommentisRemoved(state, commentId),
  );

  const CommentView = (
    <View
      style={{
        paddingLeft: 10,
        paddingBottom: isCollapsed ? 7 : 0,
        paddingTop: 7,
      }}>
      <CommentMetadata
        commentId={commentId}
        onPressToggleCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
      />
      {!isCollapsed && (
        <View style={{paddingLeft: 2}}>
          <CommentBody commentId={commentId} />
          <CommentFooter commentId={commentId} level={level} />
          {children}
        </View>
      )}
    </View>
  );
  const DeletedCommentView = (
    <View>
      <View
        style={{
          paddingVertical: 5,
          paddingLeft: 5,
          backgroundColor: theme.colors.reddishWhite,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.reddishWhite,
        }}>
        <TouchableOpacity
          hitSlop={{top: 10, left: 20, right: 20}}
          onPress={toggleCollapse}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: theme.colors.black4,
              letterSpacing: 0.5,
              fontWeight: '500',
              fontSize: 12,
              textDecorationLine: 'line-through',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {isCommentDeleted ? 'comment deleted' : 'comment removed'}
          </Text>
          <Icon
            name={isCollapsed ? 'expand-more' : 'expand-less'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      {!isCollapsed && (
        <View>
          <View
            pointerEvents="none"
            style={{
              paddingBottom: 5,
              backgroundColor: theme.colors.reddishWhite,
            }}>
            <CommentFooter commentId={commentId} level={level} />
          </View>
          <View style={{paddingLeft: 10}}>{children}</View>
        </View>
      )}
    </View>
  );

  return (
    <View
      style={{
        marginTop: 2,
        paddingBottom: 3,
      }}>
      {isCommentDeleted || isCommentRemoved ? DeletedCommentView : CommentView}
    </View>
  );
}

export default memo(Comment);
