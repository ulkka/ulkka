import React, {useState, useContext} from 'react';
import {View, StyleSheet, useWindowDimensions, Platform} from 'react-native';
import {ThemeContext} from 'react-native-elements';
import {TabView, TabBar} from 'react-native-tab-view';
import SearchCommunityResults from './SearchCommunityResults';
import SearchUserResults from './SearchUserResults';

const COLLAPSED_HEIGHT = 40;

export default function ServerSearchTabNavigation(props) {
  const {theme} = useContext(ThemeContext);

  const initialLayout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'communities', title: 'Communities'},
    {key: 'users', title: 'Users'},
  ]);

  const handleIndexChange = index => {
    setIndex(index);
  };

  const renderTabBar = props => {
    return (
      <View style={[styles.header]}>
        <View style={styles.overlay} />

        <TabBar
          {...props}
          pressColor={theme.colors.primary}
          style={{
            height: COLLAPSED_HEIGHT,
            backgroundColor: theme.colors.primary,
            elevation: 0,
            shadowOpacity: 0,
          }}
          getLabelText={({route}) => route.title}
          activeColor={theme.colors.black3}
          inactiveColor="grey"
          labelStyle={{
            fontWeight: 'bold',
            fontSize: 14,
            textTransform: 'none',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}
          contentContainerStyle={{padding: 0}}
          tabStyle={{
            padding: 5,
            height: 40,
            justifyContent: 'flex-start',
          }}
          indicatorStyle={{
            backgroundColor: theme.colors.blue,
          }}
        />
      </View>
    );
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'communities':
        return <SearchCommunityResults />;
      case 'users':
        return <SearchUserResults />;
      default:
        return null;
    }
  };

  return (
    <TabView
      style={styles.container}
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={handleIndexChange}
      initialLayout={initialLayout}
      swipeEnabled={Platform.OS == 'android'}
      lazy={({route}) => route.key === 'users'}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
