import React, {useState, memo} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {Icon} from 'react-native-elements';
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
  const {commentId, children, level} = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    analytics().logEvent('comment_togglecollapse', {value: !isCollapsed});
    setIsCollapsed(!isCollapsed);
  };
  const isCommentDeleted = useSelector((state) =>
    getCommentisDeleted(state, commentId),
  );
  const isCommentRemoved = useSelector((state) =>
    getCommentisRemoved(state, commentId),
  );

  const CommentView = (
    <View style={{paddingLeft: 10}}>
      <CommentMetadata
        commentId={commentId}
        onPressToggleCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
      />
      <Collapsible collapsed={isCollapsed} duration={50} collapsedHeight={5}>
        <CommentBody commentId={commentId} />
        <CommentFooter commentId={commentId} level={level} />
        {children}
      </Collapsible>
    </View>
  );
  const DeletedCommentView = (
    <View>
      <View
        style={{
          paddingVertical: 5,
          paddingLeft: 5,
          backgroundColor: '#fff9f9',
          borderBottomWidth: 1,
          borderBottomColor: '#fff9f9',
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
              color: '#444',
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
      <Collapsible collapsed={isCollapsed} duration={50} collapsedHeight={0}>
        <View
          pointerEvents="none"
          style={{
            paddingBottom: 5,
            backgroundColor: '#fff9f9',
          }}>
          <CommentFooter commentId={commentId} level={level} />
        </View>
        <View style={{paddingLeft: 10}}>{children}</View>
      </Collapsible>
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
