import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {push, navigate, showAuthScreen} from '../navigation/Ref';
import {
  getRegisteredUser,
  getRegistrationStatus,
} from '../redux/reducers/AuthSlice';
import {Icon, Button} from 'react-native-elements';
import {useSelector} from 'react-redux';
import UserAvatar from '../components/UserAvatar';
import {kFormatter} from '../components/helpers';
import UserCommunities from '../screens/user/tabs/UserCommunities';

const UserSection = memo(() => {
  const registeredUser = useSelector(getRegisteredUser);
  const isRegistered = useSelector(getRegistrationStatus);
  const {displayname, postKarma, commentKarma} = registeredUser;

  return isRegistered ? (
    <View
      style={{
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 250,
        height: 200,
        width: 200,
        marginBottom: 20,
        alignSelf: 'center',
      }}>
      <UserAvatar seed={displayname} size="superlarge" />
      <View style={{height: 20}}></View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 22,
            color: '#fff',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {kFormatter(postKarma + commentKarma)}
        </Text>
        <View style={{width: 10}}></View>
        <Icon name={'heart'} color={'red'} type="font-awesome" size={22} />
      </View>
    </View>
  ) : (
    <View />
  );
});

const NavSection = memo(({navigation}) => {
  const registeredUser = useSelector(getRegisteredUser);
  const isRegistered = useSelector(getRegistrationStatus);
  const {_id} = registeredUser;

  return isRegistered ? (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 15,
      }}>
      <TouchableOpacity
        style={{
          paddingHorizontal: 17,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.closeDrawer();
          push('UserDetail', {userId: _id});
        }}>
        <Icon name="user" type="font-awesome" color={'#444'} size={23} />
        <View style={{width: 10}}></View>
        <Text
          style={{
            color: '#444',
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          My Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          paddingHorizontal: 17,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.closeDrawer();
          navigate('Create Community');
        }}>
        <Icon name="hashtag" type="font-awesome" color="#444" size={18} />
        <View style={{width: 10}}></View>
        <Text
          style={{
            color: '#444',
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Create Community
        </Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View />
  );
});

const MyCommunities = memo(({navigation}) => {
  const isRegistered = useSelector(getRegistrationStatus);
  const title = (
    <View
      style={{
        padding: 8,
        paddingHorizontal: 17,
        width: '100%',
        // alignItems: 'center',
        backgroundColor: '#eee',
      }}>
      <Text
        style={{
          color: '#555',
          fontWeight: 'bold',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        My Communities
      </Text>
    </View>
  );
  return isRegistered ? (
    <View style={{flex: 1}}>
      {title}
      <UserCommunities />
    </View>
  ) : (
    <View />
  );
});

const ListView = ({navigation}) => {
  const isRegistered = useSelector(getRegistrationStatus);
  return isRegistered ? (
    <View>
      <UserSection />
      <NavSection navigation={navigation} />
      <MyCommunities navigation={navigation} />
    </View>
  ) : (
    <View
      style={{
        paddingBottom: 5,
      }}>
      <TouchableOpacity
        style={{
          paddingHorizontal: 17,
          paddingVertical: 12,
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.closeDrawer();
          showAuthScreen();
        }}>
        <View
          style={{
            height: 200,
            width: 200,
            borderRadius: 200,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="user" type="font-awesome" color={'#289df4'} size={100} />
        </View>
        <View style={{height: 30}}></View>
        <Button
          raised
          title="Login / Register"
          buttonStyle={{
            borderRadius: 15,
            backgroundColor: '#2a9df4',
            paddingVertical: 7,
            paddingHorizontal: 40,
            alignItems: 'center',
          }}
          titleStyle={{
            color: '#fff',
            fontSize: 14,
            ...(Platform.OS == 'ios' && {fontWeight: 'bold'}),
          }}
          // icon={<Icon name="plus" size={17} color="#fff" type="font-awesome" />}
          onPress={() => showAuthScreen()}
        />
      </TouchableOpacity>
    </View>
  );
};

function DrawerContent({descriptors, navigation, state, progress}) {
  return (
    <View style={{flex: 1}}>
      <FlatList
        ListFooterComponent={() => <ListView navigation={navigation} />}
        contentContainerStyle={{paddingTop: getStatusBarHeight(true) + 10}}
      />
    </View>
  );
}

export default DrawerContent;
