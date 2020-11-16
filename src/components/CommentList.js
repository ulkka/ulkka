import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {CommentGroup} from './Comment';
import mainClient from '../client/mainClient';
import Comment from '../redux/actions/Comment';
import LoadingOverlay from '../components/LoadingOverlay';

export default function CommentList(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    props.AddComment([]);
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
        props.AddComment(response.data);
        setLoading(false);
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

  const getComments = (comment, index) => {
    console.log('index-  ', index);
    return (
      <Comment key={index} comment={comment} post={props.item} index={index}>
        <CommentGroup>
          {comment.replies === undefined
            ? null
            : comment.replies.map((reply, index) => {
                return getComments(reply, index);
              })}
        </CommentGroup>
      </Comment>
    );
  };

  const CommentListView = (
    <CommentGroup root={true}>
      {props.comments.map((comment, index) => {
        return getComments(comment, index);
      })}
    </CommentGroup>
  );

  return loading ? (
    <LoadingOverlay visible={loading} />
  ) : (
    <View>
      {CommentListTitle}
      {CommentListView}
    </View>
  );
}
