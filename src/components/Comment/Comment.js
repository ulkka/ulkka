import React, {useState, memo} from 'react';
import {View} from 'react-native';
import Collapsible from 'react-native-collapsible';
import CommentMetadata from './CommentMetadata';
import CommentBody from './CommentBody';
import CommentFooter from './CommentFooter';

function Comment(props) {
  const {commentId, children, level} = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View
      style={{
        paddingLeft: 10,
        marginTop: 2,
        paddingBottom: 5,
      }}>
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
}

export default memo(Comment);
