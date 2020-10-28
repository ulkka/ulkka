import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Comment, CommentGroup} from './Comment';

export default function CommentList(props) {
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

  const CommentListView = (
    <View>
      {
        <CommentGroup root={true}>
          <Comment text="Hi first level comment">
            <CommentGroup>
              <Comment text="Hi second level comment">
                <CommentGroup>
                  <Comment text="hi third level comment"></Comment>
                </CommentGroup>
              </Comment>
            </CommentGroup>
          </Comment>
          <Comment text="Hi first level comment">
            <CommentGroup>
              <Comment text="Hi second level comment"></Comment>
              <Comment text="Hi second level comment">
                <CommentGroup>
                  <Comment text="Hi third level comment"></Comment>
                </CommentGroup>
              </Comment>
            </CommentGroup>
          </Comment>
        </CommentGroup>
      }
    </View>
  );

  return (
    <View>
      {CommentListTitle}
      {CommentListView}
    </View>
  );
}
