import React from 'react';
import {View, TextInput, Button, Text, Modal} from 'react-native';
import {Icon, Input} from 'react-native-elements';

export default function FloatingAddComment(props) {
  const AddCommentHeader = (
    <View style={{padding: 5, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
      <Text
        style={{
          color: '#555',
          fontSize: 12,
          fontWeight: '400',
          paddingHorizontal: 5,
        }}>
        Commenting on
      </Text>
    </View>
  );
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        flex: 1,
        backgroundColor: '#ddd',
        width: '100%',
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
      }}>
      {
        //AddCommentHeader
      }
      <View
        style={{
          padding: 5,
          backgroundColor: '#ddd',
        }}>
        <Input
          placeholder="Add a comment ..."
          containerStyle={{
            backgroundColor: '#555',
            padding: 5,
            borderRadius: 8,
          }}
          inputContainerStyle={{
            borderBottomWidth: 0,
            height: 25,
          }}
          inputStyle={{
            fontSize: 14,
            color: '#ddd',
          }}
          renderErrorMessage={false}
          rightIcon={<Icon name="send" color="green" size={15} />}
        />
      </View>
    </View>
  );
}
