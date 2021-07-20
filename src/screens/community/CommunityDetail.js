import React, {useEffect, memo, useRef} from 'react';
import {View, Text, Platform, Animated, Image} from 'react-native';
import {Divider} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchCommunityById,
  getCommunityTitle,
  getCommunityDescription,
  getCommunityMemberCount,
} from '../../redux/reducers/CommunitySlice';
import CommunityAvatar from '../../components/CommunityAvatar';
import CommunityOptions from './CommunityOptions';
import {kFormatter} from '../../components/helpers';
import ShareCommunity from './ShareCommunity';
import AutolinkText from '../../components/AutolinkText';
import FavoriteCommunity from './FavoriteCommunity';
import {getRegistrationStatus} from '../../redux/reducers/AuthSlice';

const CommunityHeaderRight = memo(({communityId}) => {
  const isRegistered = useSelector(getRegistrationStatus);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15,
      }}>
      {!!isRegistered && (
        <FavoriteCommunity
          communityId={communityId}
          text="Favorite"
          shareTextStyle={{fontSize: 11}}
        />
      )}
      <View style={{width: 20}}></View>
      <ShareCommunity
        communityId={communityId}
        text="Invite"
        iconSize={19}
        shareTextStyle={{fontSize: 11}}
      />
    </View>
  );
});

const CommunityDetail = memo((props) => {
  const dispatch = useDispatch();

  const {communityId, titleShown, navigation} = props;

  const communityTitle = useSelector((state) =>
    getCommunityTitle(state, communityId),
  );
  const communityDescription = useSelector((state) =>
    getCommunityDescription(state, communityId),
  );

  const communityMemberCount = useSelector((state) =>
    getCommunityMemberCount(state, communityId),
  );

  useEffect(() => {
    dispatch(fetchCommunityById(communityId));
  }, []);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
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
                fontSize: 16,
                color: '#444',
                fontWeight: 'bold',
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
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
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
          color: '#555',
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
          text={communityDescription}
          enableShowMore={true}
          source={'community_description'}
          textStyle={{
            fontSize: 12,
            color: '#111',
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
        backgroundColor: '#fafafa',
        borderColor: '#eee',
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
      <View
        style={{
          paddingHorizontal: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Divider width={28} height={0}></Divider>
      </View>
    </View>
  );
});

export default CommunityDetail;
