import React, {memo, useEffect} from 'react';
import {View, Text, Platform, ImageBackground} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import Feed from '../../../components/Feed/Feed';
import CreatePostButtonOverlay from '../../../components/Post/CreatePostButtonOverlay';
import {useSelector} from 'react-redux';
import {getIsCurrentUserPartOfAnyCommunity} from '../../../redux/reducers/CommunitySlice';

function Home(props) {
  const userHasJoinedCommunities = useSelector(
    getIsCurrentUserPartOfAnyCommunity,
  );
  console.log('props.in home feed', props);
  const homeFeedView = (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Feed screen="home" {...props} />
      <CreatePostButtonOverlay {...props} />
    </View>
  );

  const emptyHomeFeedView = (
    <View
      style={{
        paddingTop: props.contentContainerStyle.paddingTop,
        flex: 1,
        // backgroundColor: '#fff',
      }}>
      <ImageBackground
        // blurRadius={1}
        resizeMode="repeat"
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
        source={require('../../../../assets/doodlebg.jpg')}>
        <View
          style={{
            flex: 3,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            maxWidth: '50%',
          }}>
          <Text
            style={{
              fontSize: 27,
              fontWeight: 'bold',
              color: '#222',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            സ്വാഗതം!
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Icon
                name="arrow-up"
                type="font-awesome"
                color="#ff3300"
                size={28}
              />
              <Icon
                name="arrow-down"
                type="font-awesome"
                color="#ff3300"
                size={28}
              />
            </View>
            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#222',
                lineHeight: 20,
                paddingLeft: 10,
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              Vote on posts to assist communities in bringing the best content
              to the top
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="group" type="font-awesome" color="#ff3300" size={30} />
            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                paddingLeft: 10,
                fontWeight: 'bold',
                color: '#222',
                lineHeight: 20,
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              Join communities to keep this home feed up to date and filled with
              fresh content
            </Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <Button
            title="Join Communities"
            buttonStyle={{
              backgroundColor: '#2a9df4',
              borderRadius: 15,
              paddingHorizontal: 20,
            }}
            titleStyle={{color: '#fff'}}
            onPress={() => props.jumpTo('popular')}
          />
        </View>
      </ImageBackground>
    </View>
  );
  return userHasJoinedCommunities ? homeFeedView : emptyHomeFeedView;
}

export default memo(Home);
