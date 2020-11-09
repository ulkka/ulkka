import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {CommentGroup} from './Comment';
import mainClient from '../client/mainClient';
import Comment from '../redux/actions/Comment';

export default function CommentList(props) {
  const [commentsOfPost, setCommentsOfPost] = useState([]);

  useEffect(() => {
    loadComments();
  }, []);

  loadComments = async () => {
    const client = await mainClient;
    client
      .get('post/' + props.item._id + '/comments')
      .then((response) => {
        console.log(
          'Successfully retrieved comments from Post - ',
          props.item._id,
          ', No of Parent Comments - ',
          response.data.length,
        );
        setCommentsOfPost(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const CommentListTitle = (
    <View
      style={{
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#eee',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#888',
          fontSize: 13,
          width: '100%',
        }}>
        Comments
      </Text>
    </View>
  );

  const getComments = (item, index) => {
    return (
      <Comment key={index} comment={item} post={props.item}>
        <CommentGroup>
          {item.replies === undefined
            ? null
            : item.replies.map((item, index) => {
                return getComments(item, index);
              })}
        </CommentGroup>
      </Comment>
    );
  };

  const CommentListView = (
    <CommentGroup root={true}>
      {commentsOfPost.map((item, index) => {
        return getComments(item, index);
      })}
    </CommentGroup>
  );

  return (
    <View>
      {CommentListTitle}
      {CommentListView}
    </View>
  );
}
