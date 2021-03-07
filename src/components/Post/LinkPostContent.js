import React, {memo} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

const LinkPostContent = (props) => {
  const post = props.post;
  const LinkImage = (
    <TouchableOpacity
      onPress={() => console.log('click link')}
      style={{
        padding: 5,
        alignItems: 'flex-start',
        backgroundColor: '#333',
      }}>
      <Image
        source={{
          uri: post.ogData.ogImage.url,
        }}
        style={{
          width: '100%',
          aspectRatio: 1,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );
  const LinkTitle = (
    <View style={{margin: 5}}>
      <Text style={{fontWeight: 'bold', fontSize: 13, color: '#333'}}>
        {post.ogData.ogTitle}
      </Text>
    </View>
  );
  const LinkDescription = (
    <View style={{marginHorizontal: 5}}>
      <Text style={{fontSize: 11, color: '#444'}}>
        {post.ogData.ogDescription}
      </Text>
    </View>
  );
  const LinkUrl = (
    <View style={{marginVertical: 10, marginHorizontal: 5}}>
      <Text style={{fontSize: 9, color: '#555'}}>{post.ogData.ogUrl}</Text>
    </View>
  );
  const LinkDetails = (
    <View
      style={{
        justifyContent: 'center',
        padding: 5,
      }}>
      {LinkTitle}
      {LinkDescription}
      {LinkUrl}
    </View>
  );
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderColor: '#ccc',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 5,
      }}>
      {LinkImage}
      {LinkDetails}
    </View>
  );
};

export default memo(LinkPostContent);
