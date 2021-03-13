import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';
import WebView from 'react-native-webview';

const LinkPostContent = (props) => {
  const {ogData, link, width} = props;

  const type = ogData
    ? ogData.ogVideo
      ? 'video'
      : ogData.ogImage
      ? 'image'
      : null
    : null;

  const LinkVideo = ogData ? (
    ogData.ogVideo ? (
      ogData.ogVideo.url ? (
        <View style={{flex: 1}}>
          <WebView
            style={{
              //   marginTop: Platform.OS == 'ios' ? 20 : 0,
              width: '100%',
              aspectRatio: 1,
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            scrollEnabled={false}
            source={{uri: ogData.ogVideo.url}}
          />
        </View>
      ) : (
        <></>
      )
    ) : (
      <></>
    )
  ) : (
    <></>
  );

  console.log('running link post content', type, ogData);

  const LinkImage = ogData ? (
    ogData.ogImage ? (
      ogData.ogImage.url ? (
        <TouchableOpacity
          onPress={() => console.log('click link')}
          style={{
            width: width - 21,
            height: 300,
            alignItems: 'flex-start',
            backgroundColor: '#222',
          }}>
          <Image
            source={{
              uri: ogData.ogImage.url,
            }}
            style={{
              width: width - 21,
              height: 300,
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )
    ) : (
      <></>
    )
  ) : (
    <></>
  );

  const LinkTitle = ogData ? (
    ogData.ogTitle ? (
      <View
        style={{
          margin: 5,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 13, color: '#333'}}>
          {ogData.ogTitle}
        </Text>
      </View>
    ) : (
      <></>
    )
  ) : (
    <></>
  );

  const LinkDescription = ogData ? (
    ogData.ogDescription ? (
      <View style={{marginHorizontal: 5}}>
        <Text style={{fontSize: 11, color: '#444'}}>
          {ogData.ogDescription}
        </Text>
      </View>
    ) : (
      <></>
    )
  ) : (
    <></>
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

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderColor: '#ccc',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
      }}>
      {type == 'image' ? LinkImage : LinkVideo}
      {LinkDetails}
    </View>
  );
};

export default memo(LinkPostContent);
