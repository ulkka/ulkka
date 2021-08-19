import React, {memo, useState, useEffect} from 'react';
import {View, Text, Platform, ImageBackground} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getIsCurrentUserPartOfAnyCommunity} from '../../../redux/reducers/CommunitySlice';
import TopCommunities from '../../../components/TopCommunities';
import {getRegistrationStatus} from '../../../redux/reducers/AuthSlice';
import {showAuthScreen} from '../../../navigation/Ref';

const EmptyHomeFeedView = props => {
  const [showRefresh, setShowRefresh] = useState(false);
  const userHasJoinedCommunities = useSelector(
    getIsCurrentUserPartOfAnyCommunity,
  );

  const {prevUserHasJoinedCommunities, setPrevUserHasJoinedCommunities} = props;

  useEffect(() => {
    if (!prevUserHasJoinedCommunities && userHasJoinedCommunities) {
      setShowRefresh(true);
    }
  }, [userHasJoinedCommunities]);

  const isRegistered = useSelector(getRegistrationStatus);

  const refreshButton = (
    <Button
      raised
      type="solid"
      activeOpacity={0.5}
      titleStyle={{
        color: '#fff',
        fontWeight: '500',
        fontSize: 13,
        marginLeft: 5,
      }}
      containerStyle={{
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 5,
        position: 'absolute',
        top: 5,
      }}
      buttonStyle={{
        borderRadius: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderColor: '#222',
        backgroundColor: '#289df4',
      }}
      icon={<Icon name="refresh" size={15} color="#fff" />}
      title="Refresh"
      onPress={() => setPrevUserHasJoinedCommunities(true)}
    />
  );

  return (
    <View
      style={{
        paddingTop: props.contentContainerStyle.paddingTop,
        flex: 1,
      }}>
      <ImageBackground
        blurRadius={0.5}
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
              Welcome !
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
                    fontSize: 16,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#222',
                    lineHeight: 20,
                    paddingLeft: 15,
                    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                  }}>
                  {
                    'Vote on posts to assist communities in bringing the best content to the top'
                    //'വോട്ട് ചെയ്ത് നല്ല പോസ്റ്റുകൾ മുകളിലേക്കെത്തിക്കുവാൻ കമ്മ്യൂണിറ്റികളെ സഹായിക്കുക'
                  }
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
                    fontSize: 16,
                    textAlign: 'center',
                    paddingLeft: 15,
                    fontWeight: 'bold',
                    color: '#222',
                    lineHeight: 20,
                    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                  }}>
                  {
                    'Join communities to keep this home feed up to date and filled with fresh content'
                    //'ഫ്രഷ് പോസ്റ്റുകൾ കൊണ്ട് ഈ ഹോം ഫീഡ് നിറയ്ക്കാൻ കമ്മ്യൂണിറ്റികളിൽ ജോയിൻ ചെയ്യുക'
                  }
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
                    fontSize: 16,
                    textAlign: 'center',
                    paddingLeft: 15,
                    fontWeight: 'bold',
                    color: '#222',
                    lineHeight: 20,
                    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
                  }}>
                  {
                    'Create awesome posts and comments to make your community happy and win more hearts'
                    // 'അടിപൊളി പോസ്റ്റും കമന്റും ചെയ്തു കൂടുതൽ Hearts നേടുക '
                  }
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
        {showRefresh && refreshButton}
      </ImageBackground>
    </View>
  );
};

export default memo(EmptyHomeFeedView);
