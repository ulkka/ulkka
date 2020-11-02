import React from 'react';
import {View, Text, TouchableHighlight, Image} from 'react-native';

export default function PostContent(props) {
  const TextPost = (
    <View
      style={{
        paddingVertical: 15,
        borderLeftWidth: 1,
        borderColor: '#eee',
        width: '99%',
        alignSelf: 'center',
        padding: 3,
      }}>
      <TouchableHighlight
        activeOpacity={0.9}
        underlayColor="#fff"
        onPress={() =>
          props.navigation.navigate('PostDetail', {
            post: props.item,
          })
        }>
        <Text
          style={{
            color: '#444',
            fontSize: 14,
            fontWeight: '400',
          }}>
          {props.item.description}
        </Text>
      </TouchableHighlight>
    </View>
  );

  const ImagePost = (
    <View style={{backgroundColor: '#fff'}}>
      <TouchableHighlight
        activeOpacity={0.9}
        underlayColor="#fff"
        onPress={() =>
          props.navigation.navigate('PostDetail', {
            post: props.item,
          })
        }>
        <Image
          style={{
            width: '100%',
            //height: 270,
            aspectRatio: 1,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
          source={{
            uri: props.item.link,
          }}
        />
      </TouchableHighlight>
    </View>
  );

    const DefaultPost = (
            <Text>{JSON.stringify(props.item)}</Text>
    )
  switch (props.item.type) {
    case 'text':
      return TextPost;
    case 'image':
      return ImagePost;
  default:
      return DefaultPost;
  }
}
