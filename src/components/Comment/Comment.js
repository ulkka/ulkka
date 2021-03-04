import React, {useState} from 'react';
import {View} from 'react-native';
import Collapsible from 'react-native-collapsible';
import CommentMetadata from './CommentMetadata';
import CommentBody from './CommentBody';
import CommentFooter from './CommentFooter';

function CommentGroup(props) {
  return (
    <View
      style={{
        borderLeftWidth: 1,
        borderColor: '#eee',
        paddingVertical: 5,
        marginLeft: props.root ? 0 : 10,
      }}>
      {props.children}
    </View>
  );
}

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

export {Comment, CommentGroup};
