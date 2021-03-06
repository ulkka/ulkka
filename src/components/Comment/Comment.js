import React, {useState, memo} from 'react';
import {View} from 'react-native';
import Collapsible from 'react-native-collapsible';
import CommentMetadata from './CommentMetadata';
import CommentBody from './CommentBody';
import CommentFooter from './CommentFooter';

function Comment(props) {
  const commentId = props.commentId;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View
      style={{
        paddingLeft: 10,
        marginTop: 10,
      }}>
      <CommentMetadata
        commentId={commentId}
        onPressToggleCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
      />
      <Collapsible collapsed={isCollapsed}>
        <CommentBody commentId={commentId} />
        <CommentFooter commentId={commentId} />
        {props.children}
      </Collapsible>
    </View>
  );
}

export default Comment;
