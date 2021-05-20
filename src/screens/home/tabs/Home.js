import React, {memo} from 'react';
import {View, Text, Platform, ImageBackground} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import Feed from '../../../components/Feed/Feed';
import {useSelector} from 'react-redux';
import {getIsCurrentUserPartOfAnyCommunity} from '../../../redux/reducers/CommunitySlice';
import TopCommunities from '../../../components/TopCommunities';
import {getRegistrationStatus} from '../../../redux/reducers/AuthSlice';
import {showAuthScreen} from '../../../navigation/Ref';

function Home(props) {
  const userHasJoinedCommunities = useSelector(
    getIsCurrentUserPartOfAnyCommunity,
  );
  const isRegistered = useSelector(getRegistrationStatus);

  const homeFeedView = (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Feed screen="home" {...props} />
    </View>
  );

  const emptyHomeFeedView = (
    <View
      style={{
        paddingTop: props.contentContainerStyle.paddingTop,
        flex: 1,
      }}>
      <ImageBackground
        //  blurRadius={1}
        resizeMode="repeat"
        style={{
          //  flex: 1,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
        source={require('../../../../assets/doodlebg.jpg')}>
        <View
          style={{
            flex: 2,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '100%',
            }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                color: '#424242',
                ...(Platform.OS == 'ios' && {letterSpacing: 1}),
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              സ്വാഗതം!
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
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
              <View
                style={{
                  flex: 3,
                }}>
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
                  Vote on posts to assist communities in bringing the best
                  content to the top
                </Text>
              </View>
              <View style={{flex: 1}}></View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Icon
                  name="group"
                  type="font-awesome"
                  color="#ff3300"
                  size={33}
                />
              </View>
              <View
                style={{
                  flex: 3,
                }}>
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
              <View style={{flex: 1}}></View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Icon
                  name="heart"
                  type="font-awesome"
                  color="#ff3300"
                  size={36}
                />
              </View>
              <View style={{flex: 3}}>
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
              <View style={{flex: 1}}></View>
            </View>
          </View>
        </View>

        <View style={{flex: 1}}>
          {!!isRegistered ? (
            <TopCommunities />
          ) : (
            <View style={{flex: 1, alignItems: 'center'}}>
              <Button
                raised
                title="Sign up / Login"
                buttonStyle={{
                  width: 180,
                  borderRadius: 15,
                  backgroundColor: '#2a9df4',
                  paddingVertical: 10,
                }}
                titleStyle={{
                  color: '#fff',
                  fontSize: 14,
                  ...(Platform.OS == 'ios' && {fontWeight: 'bold'}),
                }}
                onPress={() => showAuthScreen()}
              />
              <View style={{height: 20}}></View>
              <Button
                raised
                title="See Popular Posts"
                buttonStyle={{
                  width: 180,
                  borderRadius: 15,
                  backgroundColor: '#2a9df4',
                  paddingVertical: 10,
                }}
                titleStyle={{
                  color: '#fff',
                  fontSize: 14,
                  ...(Platform.OS == 'ios' && {fontWeight: 'bold'}),
                }}
                onPress={() => props.jumpTo('popular')}
              />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
  return userHasJoinedCommunities ? homeFeedView : emptyHomeFeedView;
}

export default memo(Home);
