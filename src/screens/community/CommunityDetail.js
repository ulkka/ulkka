import React, {useEffect, memo, useRef} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import {Icon, Divider} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {getRegisteredUser} from '../../redux/reducers/AuthSlice';
import {
  fetchCommunityById,
  getCommunityTitle,
  getCommunityDescription,
} from '../../redux/reducers/CommunitySlice';
import Hyperlink from 'react-native-hyperlink';
import CommunityAvatar from '../../components/CommunityAvatar';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const CommunityDetail = memo((props) => {
  const dispatch = useDispatch();

  const {communityId, titleShown} = props;

  const communityTitle = useSelector((state) =>
    getCommunityTitle(state, communityId),
  );

  const communityDescription = useSelector((state) =>
    getCommunityDescription(state, communityId),
  );

  useEffect(() => {
    dispatch(fetchCommunityById(communityId));
  }, []);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (communityTitle) {
      props.navigation.setOptions({
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
        duration: 250, // some number in milliseconds
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

  const registeredUser = useSelector(getRegisteredUser);
  const registeredUserId = registeredUser?._id;

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
        fontSize: 17,
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

  const descriptionField = (
    <Hyperlink
      linkDefault={false}
      linkStyle={{color: '#2980b9'}}
      onPress={(url, text) => navigateToURL(url, 'bio')}>
      <Text
        style={{
          paddingTop: 15,
          paddingLeft: 5,
          fontSize: 12,
          color: '#111',
        }}>
        {communityDescription}
      </Text>
    </Hyperlink>
  );

  const accountSettings = (
    <TouchableOpacity
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      style={{paddingRight: 10, flexDirection: 'row', alignItems: 'center'}}
      //     onPress={() => dispatch(showOptionSheet({ type: 'user', id: userId }))}
    >
      <Icon name="gear" type="font-awesome" size={24} color={'#666'} />
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        backgroundColor: '#fff',
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
        {accountSettings}
      </View>
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
