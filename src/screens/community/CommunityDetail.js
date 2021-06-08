import React, {useEffect, memo, useRef} from 'react';
import {View, Text, Platform, Animated, ActivityIndicator} from 'react-native';
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
import CreatePostOnCommunity from './CreatePostOnCommunity';
import AutolinkText from '../../components/AutolinkText';

const CommunityHeaderRight = memo(({communityId}) => {
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', paddingRight: 15}}>
      <CreatePostOnCommunity communityId={communityId} />
      <View style={{width: 30}}></View>
      <ShareCommunity
        communityId={communityId}
        text="Invite"
        iconSize={16}
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
  console.log('props in community detail', props);

  useEffect(() => {
    if (communityTitle) {
      navigation.setOptions({
        headerTitle: () => (
          <Animated.View style={[{opacity: opacity}]}>
            <Text
              style={{
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

  console.log('communityId in community detail', communityId);

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
      <ActivityIndicator
        size="small"
        color="#4285f4"
        style={{alignSelf: 'flex-start', paddingLeft: 5, paddingTop: 15}}
      />
    );

  const descriptionField = communityDescription ? (
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
    <ActivityIndicator
      size="small"
      color="#4285f4"
      style={{alignSelf: 'flex-start', paddingLeft: 5, paddingTop: 10}}
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
