import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view'; // Version can be specified in package.json
import Home from './tabs/Home';
import Popular from './tabs/Popular';
import analytics from '@react-native-firebase/analytics';
import HeaderBar from '../../components/Header';

const HEADER_HEIGHT = 35;
const COLLAPSED_HEIGHT = 0;
const SCROLLABLE_HEIGHT = HEADER_HEIGHT - COLLAPSED_HEIGHT;

export default function HomeCollapsibleTabView(props) {
  const initialLayout = useWindowDimensions();

  const [tabShown, setTabShown] = useState(true);

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    {key: 'home', title: 'Home', name: 'Home'},
    {key: 'popular', title: 'Popular', name: 'Popular'},
  ]);

  const translation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translation, {
      toValue: tabShown ? 0 : -SCROLLABLE_HEIGHT,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [tabShown]);

  const handleIndexChange = (index) => {
    analytics().logScreenView({
      screen_name: 'Home-' + routes[index].title,
      screen_class: 'Home-' + routes[index].title,
    });
    setTabShown(true);
    setIndex(index);
  };

  const renderTabBar = (props) => {
    return (
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{translateY: translation}],
          },
        ]}>
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
          contentContainerStyle={{padding: 0}}
          tabStyle={{
            padding: 0,
            height: SCROLLABLE_HEIGHT,
            justifyContent: 'flex-start',
          }}
          indicatorStyle={{
            height: 3,
            backgroundColor: 'powderblue',
          }}
        />
      </Animated.View>
    );
  };

  const handleOnScrollEndDrag = (event) => {
    const scrolling = event.nativeEvent.contentOffset.y;
    const Yvelocity = event.nativeEvent.velocity.y;
    var direction =
      Platform.OS == 'android'
        ? Yvelocity > 5
          ? 'up'
          : 'down'
        : Yvelocity < -3
        ? 'up'
        : 'down';
    if (
      (scrolling < 300 && !tabShown) ||
      (direction == 'up' && scrolling > 300 && !tabShown)
    ) {
      setTabShown(true);
    } else if (direction == 'down' && scrolling >= 300 && tabShown) {
      setTabShown(false);
    }
  };

  const handleOnMomentumScrollEnd = (event) => {
    const scrolling = event.nativeEvent.contentOffset.y;
    if (scrolling < 300 && !tabShown) {
      setTabShown(true);
    }
  };

  const handleShowTabBar = () => {
    setTabShown(true);
  };

  const renderScene = ({route, jumpTo}) => {
    switch (route.key) {
      case 'home':
        return (
          <Home
            scrollEventThrottle={16}
            onScrollEndDrag={handleOnScrollEndDrag}
            onMomentumScrollEnd={handleOnMomentumScrollEnd}
            showTabBar={handleShowTabBar}
            contentContainerStyle={{paddingTop: HEADER_HEIGHT}}
            jumpTo={jumpTo}
            screen="home"
            {...props}
          />
        );
      case 'popular':
        return (
          <Popular
            scrollEventThrottle={16}
            onScrollEndDrag={handleOnScrollEndDrag}
            onMomentumScrollEnd={handleOnMomentumScrollEnd}
            showTabBar={handleShowTabBar}
            screen={'popular'}
            contentContainerStyle={{paddingTop: HEADER_HEIGHT}}
            {...props}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={{flex: 1}}>
      <HeaderBar navigation={props.navigation} />
      <TabView
        style={styles.container}
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
        initialLayout={initialLayout}
        lazy={({route}) =>
          route.key === 'popular' || route.key === 'communities'
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .32)',
  },
  cover: {
    height: SCROLLABLE_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  tabbar: {
    height: SCROLLABLE_HEIGHT,
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
});
