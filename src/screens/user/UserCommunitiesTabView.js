import React, {useState} from 'react';
import {View, StyleSheet, useWindowDimensions, Platform} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import UserCommunities from './UserCommunities';

const COLLAPSED_HEIGHT = 40;

export default function UserDetailTabView(props) {
  const initialLayout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'following', title: 'Following'},
    {key: 'moderating', title: 'Moderating'},
  ]);

  const handleIndexChange = (index) => {
    setIndex(index);
  };

  const renderTabBar = (props) => {
    return (
      <View style={[styles.header]}>
        <View style={styles.overlay} />

        <TabBar
          {...props}
          pressColor="#fff"
          style={styles.tabbar}
          getLabelText={({route}) => route.title}
          activeColor="#333"
          inactiveColor="grey"
          labelStyle={{
            fontWeight: 'bold',
            fontSize: 14,
            textTransform: 'none',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}
          contentContainerStyle={{padding: 0, borderWidth: 1}}
          tabStyle={{
            padding: 5,
            height: 40,
            justifyContent: 'flex-start',
          }}
          indicatorStyle={{
            backgroundColor: 'powderblue',
          }}
        />
      </View>
    );
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'following':
        return <UserCommunities type="following" />;
      case 'moderating':
        return <UserCommunities type="moderating" />;
      default:
        return null;
    }
  };

  const UserTabView = (
    <TabView
      style={styles.container}
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={handleIndexChange}
      initialLayout={initialLayout}
      lazy={({route}) => route.key === 'comments'}
    />
  );

  return UserTabView;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .32)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  tabbar: {
    height: COLLAPSED_HEIGHT,
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
});
