import React, {useState, memo} from 'react';
import {View} from 'react-native';
import Collapsible from 'react-native-collapsible';
import CommentMetadata from './CommentMetadata';
import CommentBody from './CommentBody';
import CommentFooter from './CommentFooter';

function Comment(props) {
  const {commentId, comment} = props;

  const {author, created_at, text, userVote, voteCount} = comment;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View
      style={{
        paddingLeft: 10,
        marginTop: 5,
        paddingBottom: 5,
      }}>
      <CommentMetadata
        onPressToggleCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
        author={author}
        createdAt={created_at}
      />
      <Collapsible collapsed={isCollapsed} duration={50} collapsedHeight={5}>
        <CommentBody text={text} />
        <CommentFooter
          commentId={commentId}
          userVote={userVote}
          voteCount={voteCount}
        />
        {props.children}
      </Collapsible>
    </View>
  );
}

export default Comment;
