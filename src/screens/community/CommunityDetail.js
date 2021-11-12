import React, {useEffect, memo, useRef} from 'react';
import {View, Text, Platform, Animated, Image} from 'react-native';
import {useTheme} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchCommunityById,
  getCommunityTitle,
  getCommunityDescription,
  getCommunityMemberCount,
} from '../../redux/reducers/CommunitySlice';
import CommunityAvatar from '../../components/CommunityAvatar';
import CommunityOptions from './CommunityOptions';
import {getColorFromTitle, kFormatter} from '../../components/helpers';
import ShareCommunity from './ShareCommunity';
import AutolinkText from '../../components/AutolinkText';
import FavoriteCommunity from './FavoriteCommunity';
import {getRegistrationStatus} from '../../redux/reducers/AuthSlice';
import {theme} from '../../redux/reducers/ThemeSlice';

const CommunityHeaderRight = memo(({communityId}) => {
  const isRegistered = useSelector(getRegistrationStatus);
  const {theme} = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        paddingBottom: 5,
      }}>
      {!!isRegistered && (
        <FavoriteCommunity
          communityId={communityId}
          // text="Favorite"
          shareTextStyle={{fontSize: 11}}
        />
      )}
      <View style={{width: 15}}></View>
      <ShareCommunity
        communityId={communityId}
        //   text="Invite"
        iconSize={14}
        shareTextStyle={{fontSize: 11, color: theme.colors.black3}}
      />
    </View>
  );
});

const CommunityDetail = memo(props => {
  const {theme} = useTheme();

  const dispatch = useDispatch();

  const {communityId, titleShown, navigation} = props;

  const communityTitle = useSelector(state =>
    getCommunityTitle(state, communityId),
  );
  const communityDescription = useSelector(state =>
    getCommunityDescription(state, communityId),
  );

  const communityMemberCount = useSelector(state =>
    getCommunityMemberCount(state, communityId),
  );

  useEffect(() => {
    dispatch(fetchCommunityById(communityId));
  }, []);

  const opacity = useRef(new Animated.Value(0)).current;
  console.log(communityTitle, getColorFromTitle(communityTitle));
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        //backgroundColor: getColorFromTitle(communityTitle),
        backgroundColor: '#fdd20e',
        // height: 150,
      },
      headerRight: () => <CommunityHeaderRight communityId={communityId} />,
    });
  }, []);

  useEffect(() => {
    if (communityTitle) {
      navigation.setOptions({
        headerTitle: () => (
          <Animated.View style={[{opacity: opacity}]}>
            <Text
              numberOfLines={1}
              style={{
                maxWidth: 200,
                marginRight: 40,
                fontSize: 15,
                color: '#eee',
                fontWeight: 'bold',
                textShadowColor: '#555',
                textShadowOffset: {width: 1, height: 2},
                textShadowRadius: 4,
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              {communityTitle}
            </Text>
          </Animated.View>
        ),
        headerTitleAlign: 'center',
      });
    }
  }, [communityTitle]);

  useEffect(() => {
    if (titleShown) {
      Animated.timing(opacity, {
        duration: 150, // some number in milliseconds
        toValue: 1, // or whatever final opacity you'd like
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        duration: 250, // some number in milliseconds
        toValue: 0, // or whatever final opacity you'd like
        useNativeDriver: true,
      }).start();
    }
  }, [titleShown]);

  const avatar = (
    <CommunityAvatar
      communityName={communityTitle}
      communityId={communityId}
      size="large"
    />
  );

  const communityTitleField = (
    <Text
      numberOfLines={1}
      style={{
        maxWidth: 200,
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.black4,
        paddingLeft: 10,
        ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
      }}>
      {communityTitle}
    </Text>
  );

  const communityAvatarAndDisplayName = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {avatar}
      {communityTitleField}
    </View>
  );

  const memberCountField =
    communityMemberCount !== undefined ? (
      <Text
        style={{
          paddingTop: 15,
          fontSize: 12,
          color: theme.colors.black5,
          paddingLeft: 5,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {kFormatter(communityMemberCount)}{' '}
        {communityMemberCount == 1 ? 'member' : 'members'}
      </Text>
    ) : (
      <Image
        source={require('../../../assets/loading.gif')}
        style={{height: 20, width: 20, paddingLeft: 5, paddingTop: 15}}
      />
    );

  const descriptionField =
    communityDescription || communityDescription === '' ? (
      <View style={{paddingTop: 10, paddingLeft: 5}}>
        <AutolinkText
          disableMention={true}
          text={communityDescription}
          enableShowMore={true}
          source={'community_description'}
          textStyle={{
            fontSize: 12,
            color: theme.colors.black1,
          }}
        />
      </View>
    ) : (
      <Image
        source={require('../../../assets/loading.gif')}
        style={{
          height: 20,
          width: 20,
          paddingLeft: 5,
          paddingTop: 15,
          alignSelf: 'flex-start',
        }}
      />
    );

  return (
    <View
      style={{
        backgroundColor: theme.colors.grey0,
        borderColor: theme.colors.grey2,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {communityAvatarAndDisplayName}
        <CommunityOptions communityId={communityId} />
      </View>
      {memberCountField}
      {descriptionField}
    </View>
  );
});

export default CommunityDetail;
