import React, {memo} from 'react';
import {View, Text, Platform, ImageBackground} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import Feed from '../../../components/Feed/Feed';
import CreatePostButtonOverlay from '../../../components/Post/CreatePostButtonOverlay';
import {useSelector} from 'react-redux';
import {getIsCurrentUserPartOfAnyCommunity} from '../../../redux/reducers/CommunitySlice';
import TopCommunities from '../../../components/TopCommunities';

function Home(props) {
  const userHasJoinedCommunities = useSelector(
    getIsCurrentUserPartOfAnyCommunity,
  );
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
          //  flex: 1,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
        source={require('../../../../assets/doodlebg.jpg')}>
        <View style={{flex: 2, justifyContent: 'space-between'}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              maxWidth: '60%',
            }}>
            <Text
              style={{
                fontSize: 28,
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
                  paddingLeft: 15,
                  ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                }}>
                Vote on posts to assist communities in bringing the best content
                to the top
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="group"
                type="font-awesome"
                color="#ff3300"
                size={33}
              />
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'center',
                  paddingLeft: 15,
                  fontWeight: 'bold',
                  color: '#222',
                  lineHeight: 20,
                  ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                }}>
                Join communities to keep this home feed up to date and filled
                with fresh content
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="heart"
                type="font-awesome"
                color="#ff3300"
                size={36}
              />
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'center',
                  paddingLeft: 15,
                  fontWeight: 'bold',
                  color: '#222',
                  lineHeight: 20,
                  ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                }}>
                Create awesome posts and comments to make your community happy
                and win more hearts
              </Text>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <TopCommunities />
        </View>
      </ImageBackground>
    </View>
  );
  return userHasJoinedCommunities ? homeFeedView : emptyHomeFeedView;
}

export default memo(Home);
