import React, {memo} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Icon, Image} from 'react-native-elements';

const LinkPostContent = (props) => {
  const {ogData, link} = props;
  //const ogData = {};
  const LinkImage = (
    <TouchableOpacity
      onPress={() => console.log('click link')}
      style={{
        //  padding: 5,
        alignItems: 'flex-start',
        backgroundColor: '#333',
      }}>
      {ogData == undefined ? (
        <Icon
          name="image"
          size={40}
          reverse
          color="lightblue"
          type="font-awesome"
        />
      ) : (
        <Image
          source={{
            uri: ogData.ogImage.url,
          }}
          style={{
            width: '100%',
            aspectRatio: 1,
            resizeMode: 'contain',
          }}
          placeholderStyle={{
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          PlaceholderContent={
            <ActivityIndicator size="large" color="#4285f4" />
          }
        />
      )}
    </TouchableOpacity>
  );

  const LinkTitle = (
    <View style={{margin: 5}}>
      <Text style={{fontWeight: 'bold', fontSize: 13, color: '#333'}}>
        {ogData ? ogData.ogTitle : ''}
      </Text>
    </View>
  );

  const LinkDescription = (
    <View style={{marginHorizontal: 5}}>
      <Text style={{fontSize: 11, color: '#444'}}>
        {ogData ? ogData.ogDescription : ''}
      </Text>
    </View>
  );

  const LinkUrl = (
    <View style={{marginVertical: 10, marginHorizontal: 5}}>
      <Text style={{fontSize: 9, color: '#555'}}>
        {ogData ? (ogData.ogUrl ? ogData.ogUrl : link) : link}
      </Text>
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

  return ogData == undefined ? (
    <View>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 21,
        }}>
        {link}
      </Text>
    </View>
  ) : (
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
