import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-elements';
import WebView from 'react-native-webview';
import Video from 'react-native-video';

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
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {
            /* <WebView
            style={{
              //   marginTop: Platform.OS == 'ios' ? 20 : 0,
              width: width - 21,
              height: 350,
              // aspectRatio: 1,
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={false}
            scrollEnabled={false}
            allowsFullscreenVideo={false}
            onShouldStartLoadWithRequest={false}
            startInLoadingState={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={true}
            source={{ uri: ogData.ogVideo.url }}
          />*/
            <Video
              style={{
                width: width - 21,
                height: 350,
              }}
              source={{uri: ogData.ogVideo.url}}
              //source={{uri: 'https://www.youtube.com/embed/35npVaFGHMY'}}
              resizeMode="contain"
              paused={true}
              poster={ogData.ogImage.url}
              showPoster={true}
              playWhenInactive={false}
              muted={true}
              repeat={true}
              //controls={true}
              playWhenInactive={false}
            />
          }
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

  const LinkImage = ogData ? (
    ogData.ogImage ? (
      ogData.ogImage.url ? (
        <TouchableOpacity
          onPress={() => console.log('click link')}
          style={{
            //  width: width - 21,
            // /  height: 400,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#222',
          }}>
          <Image
            source={{
              uri: ogData.ogImage.url,
            }}
            style={{
              width: width - 21,
              height: 350,
              resizeMode: 'cover',
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
        // height: 400,
        //width: width,
      }}>
      <View
        style={{
          height: 350,
          width: width - 21,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {type == 'image' ? LinkImage : LinkVideo}
      </View>
      {LinkDetails}
    </View>
  );
};

export default memo(LinkPostContent);
