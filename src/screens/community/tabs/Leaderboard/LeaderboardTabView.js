import React, {useState, memo} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import Posts from './tabs/Users';
import Comments from './tabs/Comments';

const COLLAPSED_HEIGHT = 40;

export default memo(function LeaderboardTabView(props) {
  const initialLayout = useWindowDimensions();

  const {communityId, sort, from} = props;

  const routesArray = [
    {key: 'posters', title: 'Posters'},
    {key: 'commenters', title: 'Commenters'},
  ];

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState(routesArray);

  const handleIndexChange = (index) => {
    setIndex(index);
  };
  const renderTabBar = (props) => {
    return (
      <Animated.View>
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
          contentContainerStyle={{
            padding: 0,
          }}
          tabStyle={{
            padding: 5,
            height: COLLAPSED_HEIGHT,
            justifyContent: 'flex-start',
          }}
          indicatorStyle={{
            backgroundColor: 'powderblue',
          }}
        />
      </Animated.View>
    );
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'posters':
        return <Posts communityId={communityId} />;

      case 'commenters':
        return <Comments communityId={communityId} />;
      default:
        return null;
    }
  };

  const LeaderboardTabView = (
    <TabView
      style={styles.container}
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={handleIndexChange}
      initialLayout={initialLayout}
      swipeEnabled={false}
    />
  );

  return LeaderboardTabView;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .32)',
  },
  tabbar: {
    height: COLLAPSED_HEIGHT,
    backgroundColor: '#f5f5f5',
    elevation: 0,
    shadowOpacity: 0,
  },
});
