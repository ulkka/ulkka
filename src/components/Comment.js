import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {Icon, Divider} from 'react-native-elements';

const CommentGroup = (props) => {
  return (
    <View
      style={{
        //  borderBottomWidth: 1,
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
          username
        </Text>
        <Divider
          style={{
            backgroundColor: 'white',
            width: 15,
          }}
        />
        <Text
          style={{
            fontSize: 11,
            color: '#888',
            fontWeight: '300',
          }}>
          3 h
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{flex: 1, alignItems: 'flex-end'}}
        onPress={() => {
          setIsCollapsed(!isCollapsed);
        }}>
        {<Icon name="expand-more" size={16} color="#888" />}
      </TouchableOpacity>
    </View>
  );

  const CommentBody = (props) => {
    return (
      <View style={{paddingTop: 5}}>
        <Text style={{color: '#333', fontSize: 13, fontWeight: '400'}}>
          {props.text}
        </Text>
      </View>
    );
  };
  const CommentActions = (
    <View
      style={{
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{paddingHorizontal: 40}}>
        <Icon name="more-horiz" size={18} color="#888" />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="reply" type="font-awesome" size={14} color="#777" />
        <Text style={{paddingHorizontal: 10, color: '#444', fontSize: 12}}>
          Reply
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          alignItems: 'center',
        }}>
        <Icon
          name="arrow-up-bold"
          type="material-community"
          size={17}
          color="#888"
        />
        <Text
          style={{
            fontWeight: 'bold',
            color: '#888',
            paddingHorizontal: 10,
            fontSize: 12,
          }}>
          -50
        </Text>
        <Icon
          name="arrow-down-bold"
          type="material-community"
          size={17}
          color="#888"
        />
      </View>
    </View>
  );

  return (
    <View style={{paddingLeft: 10}}>
      {CommentMetadata}
      <Collapsible collapsed={isCollapsed}>
        <CommentBody text={props.text} />
        {CommentActions}
        {props.children}
      </Collapsible>
    </View>
  );
};

export {Comment, CommentGroup};
