import React from 'react';
import {View, Text, Platform, ImageBackground} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import ShareCommunity from './ShareCommunity';
import AutolinkText from '../../components/AutolinkText';
import {useSelector} from 'react-redux';
import {getCommunityTitle} from '../../redux/reducers/CommunitySlice';

export default function GrowCommunity(props) {
  const {theme} = useTheme();

  const {communityId} = props.route.params;
  const communityTitle = useSelector(state =>
    getCommunityTitle(state, communityId),
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'space-evenly',
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
        source={
          theme.dark
            ? require('../../../assets/doodlebg_dark.jpg')
            : require('../../../assets/doodlebg.jpg')
        }>
        <View>
          <Icon name="rocket" type="font-awesome" size={120} color="red" />
        </View>
        <View style={{padding: 20}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: theme.colors.black4,

              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            1) Undang orang untuk bergabung dengan komunitasmu dari profil
            mereka di Omong.
          </Text>
          <View style={{height: 30}}></View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: theme.colors.black4,
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            2) Sebar kepada orang lain tentang komunitasmu dengan membagikan
            tautan undangan masuk komunitas di media sosial favoritmu
          </Text>
          <View
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 10,
              alignSelf: 'flex-start',
              marginTop: 10,
              borderWidth: 1,
              borderColor: theme.colors.green,
            }}>
            <ShareCommunity
              communityId={communityId}
              text={'Bagian Tautan untuk Bergabung'}
              flexDirection={'row'}
              mode="light"
              shareTextStyle={{
                // fontWeight: 'bold',
                fontSize: 16,
                paddingLeft: 10,
                color: theme.colors.green,
              }}
            />
          </View>
          <View style={{height: 30}}></View>
          <AutolinkText
            text={
              '3) Gunakan ' +
              communityTitle +
              ' di komentar di post yang relevan untuk membantu orang lain menemukan komunitasmu'
            }
            source="growCommunity"
            enableShowMore={false}
            textStyle={{
              fontSize: 16,
              fontWeight: 'bold',
              color: theme.colors.black4,
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}
          />
          <View style={{height: 30}}></View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: theme.colors.black4,
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            4) Kamu juga dapat meningkatkan peringkat komunitasmu untuk dapat
            muncul di rekomendasi komunitas populer dengan membuat konten dan
            berdiskusi di dalamnya secara rutin
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
