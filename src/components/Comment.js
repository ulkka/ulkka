import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {Icon, Divider} from 'react-native-elements';
import TimeAgo from './TimeAgo';
import Vote from './Vote';

const CommentGroup = (props) => {
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
};

const Comment = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const CommentMetadata = (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Account')}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '300',
            color: 'darkgreen',
          }}>
          {props.comment.author.name}
        </Text>
        <Divider
          style={{
            backgroundColor: 'white',
            width: 15,
          }}
        />
        <TimeAgo time={props.comment.created_at} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{flex: 1, alignItems: 'flex-end'}}
        onPress={() => {
          setIsCollapsed(!isCollapsed);
        }}>
        {
          <Icon
            name={isCollapsed ? 'expand-more' : 'expand-less'}
            size={16}
            color="#888"
          />
        }
      </TouchableOpacity>
    </View>
  );

  const CommentBody = (
    <View style={{paddingTop: 5}}>
      <Text style={{color: '#333', fontSize: 13, fontWeight: '400'}}>
        {props.comment.text}
      </Text>
    </View>
  );

  const CommentActions = (
    <View
      style={{
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
      }}>
      <TouchableOpacity style={{paddingHorizontal: 40}}>
        <Icon name="more-horiz" size={18} color="#888" />
      </TouchableOpacity>
      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="reply" type="font-awesome" size={14} color="#777" />
        <Text style={{paddingHorizontal: 10, color: '#444', fontSize: 12}}>
          Reply
        </Text>
      </TouchableOpacity>
      <Vote
        item={props.comment}
        style={{paddingHorizontal: 15}}
        type="comment"
      />
    </View>
  );

  return (
    <View style={{paddingLeft: 10}}>
      {CommentMetadata}
      <Collapsible collapsed={isCollapsed}>
        {CommentBody}
        {CommentActions}
        {props.children}
      </Collapsible>
    </View>
  );
};

export {Comment, CommentGroup};
