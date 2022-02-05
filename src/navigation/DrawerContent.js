import React, {memo, useState} from 'react';
import {View, Text, TouchableOpacity, Platform, FlatList} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {push, navigate, showAuthScreen} from '../navigation/Ref';
import {
  getRegisteredUser,
  getRegistrationStatus,
} from '../redux/reducers/AuthSlice';
import {Icon, Button, useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import UserAvatar from '../components/UserAvatar';
import {kFormatter} from '../components/helpers';
import UserCommunities from '../screens/user/tabs/UserCommunities';
import FavoriteCommunities from '../screens/user/tabs/FavoriteCommunities';
import ThemeSelector from '../components/ThemeSelector';
import LanguageSelector from '../components/LanguageSelector';
import {t} from 'i18next';

const UserSection = memo(() => {
  const {theme} = useTheme();

  const registeredUser = useSelector(getRegisteredUser);
  const isRegistered = useSelector(getRegistrationStatus);
  const {displayname, postKarma, commentKarma} = registeredUser;

  return isRegistered ? (
    <View
      style={{
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.black3,
        borderRadius: 250,
        height: 200,
        width: 200,
        marginBottom: 20,
        alignSelf: 'center',
      }}>
      <UserAvatar seed={displayname} size="superlarge" />
      <View style={{height: 10}}></View>
      <View>
        <Text
          numberOfLines={1}
          style={{
            color: theme.colors.primary,
            padding: 3,
            fontSize: 16,
            fontWeight: 'bold',

            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {registeredUser.displayname}
        </Text>
      </View>
      <View style={{height: 10}}></View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 19,
            color: theme.colors.primary,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {kFormatter(postKarma + commentKarma)}
        </Text>
        <View style={{width: 10}}></View>
        <Icon name={'heart'} color={'red'} type="font-awesome" size={19} />
      </View>
    </View>
  ) : (
    <View />
  );
});

const NavSection = memo(({navigation}) => {
  const {theme} = useTheme();

  const registeredUser = useSelector(getRegisteredUser);
  const isRegistered = useSelector(getRegistrationStatus);
  const {_id} = registeredUser;

  return isRegistered ? (
    <View
      style={
        {
          // paddingBottom: 8,
        }
      }>
      <TouchableOpacity
        style={{
          paddingHorizontal: 17,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.closeDrawer();
          push('UserDetail', {userId: _id});
        }}>
        <Icon
          name="user"
          type="font-awesome"
          color={theme.colors.black4}
          size={23}
        />
        <View style={{width: 10}}></View>
        <Text
          style={{
            color: theme.colors.black4,
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
        <Icon
          name="hashtag"
          type="font-awesome"
          color={theme.colors.black4}
          size={18}
        />
        <View style={{width: 10}}></View>
        <Text
          style={{
            color: theme.colors.black4,
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

const CommunitiesList = memo(({ListIcon, title, ListComponent}) => {
  const {theme} = useTheme();

  const isRegistered = useSelector(getRegistrationStatus);
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  const titleView = (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => toggleExpand()}
      style={{
        padding: 8,
        paddingHorizontal: 17,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.grey2,
        justifyContent: 'space-between',
        height: 35,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ListIcon />
        <View style={{width: 10}}></View>
        <Text
          style={{
            color: theme.colors.black5,
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {title}
        </Text>
      </View>
      <View>
        <Icon name={expanded ? 'expand-less' : 'expand-more'} color="#777" />
      </View>
    </TouchableOpacity>
  );

  return isRegistered ? (
    <View style={{flex: 1}}>
      {titleView}
      {expanded && <ListComponent />}
    </View>
  ) : (
    <View />
  );
});

const ListView = ({navigation}) => {
  const {theme} = useTheme();

  const isRegistered = useSelector(getRegistrationStatus);
  return isRegistered ? (
    <View
      style={{
        backgroundColor: theme.colors.primary,
      }}>
      <UserSection />
      <NavSection navigation={navigation} />
      <ThemeSelector />
      <LanguageSelector />
      <CommunitiesList
        navigation={navigation}
        ListComponent={() => <FavoriteCommunities />}
        title="Favorites"
        ListIcon={() => (
          <Icon
            name="star"
            type="font-awesome"
            color="#ffd000"
            size={Platform.OS == 'ios' ? 20 : 17}
          />
        )}
      />
      <View style={{height: 5, backgroundColor: theme.colors.grey1}}></View>
      <CommunitiesList
        navigation={navigation}
        ListComponent={() => <UserCommunities />}
        title="My Communities"
        ListIcon={() => (
          <Icon
            name="group"
            type="font-awesome"
            color="#289df4"
            size={Platform.OS == 'ios' ? 20 : 17}
          />
        )}
      />
    </View>
  ) : (
    <View
      style={{
        paddingBottom: 5,
        backgroundColor: theme.colors.primary,
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
            backgroundColor: theme.colors.black2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name="user"
            type="font-awesome"
            color={theme.colors.blue}
            size={100}
          />
        </View>
        <View style={{height: 30}}></View>
        <Button
          title={t('Login/Register')}
          buttonStyle={{
            borderRadius: 15,
            backgroundColor: theme.colors.blue,
            paddingVertical: 7,
            paddingHorizontal: 40,
            alignItems: 'center',
          }}
          titleStyle={{
            color: theme.colors.primary,
            fontSize: 14,
            ...(Platform.OS == 'ios' && {fontWeight: 'bold'}),
          }}
          // icon={<Icon name="plus" size={17} color={theme.colors.primary} type="font-awesome" />}
          onPress={() => showAuthScreen()}
        />
        <View style={{height: 40}}></View>
        <View
          style={{
            flex: 1,
            //  alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
          <ThemeSelector />
          <LanguageSelector />
        </View>
      </TouchableOpacity>
    </View>
  );
};

function DrawerContent({descriptors, navigation, state, progress}) {
  return (
    <View style={{flex: 1}}>
      <FlatList
        listKey="drawer"
        ListFooterComponent={() => <ListView navigation={navigation} />}
        contentContainerStyle={{
          paddingTop: getStatusBarHeight(true) + 10,
        }}
      />
    </View>
  );
}

export default DrawerContent;
