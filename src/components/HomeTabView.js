import React, {useState, useRef, useEffect} from 'react';
import {Platform} from 'react-native';
import {View, StyleSheet, Animated, useWindowDimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view'; // Version can be specified in package.json
import Home from '../screens/home/tabs/Home';
import Popular from '../screens/home/tabs/Popular';

const HEADER_HEIGHT = 35;
const COLLAPSED_HEIGHT = 0;
const SCROLLABLE_HEIGHT = HEADER_HEIGHT - COLLAPSED_HEIGHT;

export default function HomeCollapsibleTabView(props) {
  const initialLayout = useWindowDimensions();

  const [offset, setOffset] = useState(0);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'home', title: 'Home'},
    {key: 'popular', title: 'Popular'},
  ]);

  const scrolling = useRef(new Animated.Value(0)).current;

  const translation = scrolling.interpolate({
    inputRange: [offset, offset + HEADER_HEIGHT - COLLAPSED_HEIGHT],
    outputRange: [0, COLLAPSED_HEIGHT - HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  var scrollingValue = 0;
  scrolling.addListener(({value}) => {
    if (value < scrollingValue) {
      if (!offset) {
        setOffset(scrollingValue);
      }
    } else if (value > scrollingValue) {
      if (offset) {
        if (value - offset > SCROLLABLE_HEIGHT) {
          setOffset(0);
        }
      }
    }
    scrollingValue = value;
  });

  const handleIndexChange = (index) => {
    scrolling.setValue(0);
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
          contentContainerStyle={{padding: 0, borderWidth: 1}}
          tabStyle={{
            padding: 0,
            height: HEADER_HEIGHT,
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
      case 'home':
        return (
          <Home
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrolling,
                    },
                  },
                },
              ],
              {useNativeDriver: true},
            )}
            contentContainerStyle={{paddingTop: HEADER_HEIGHT}}
          />
        );
      case 'popular':
        return (
          <Popular
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrolling,
                    },
                  },
                },
              ],
              {useNativeDriver: true},
            )}
            contentContainerStyle={{paddingTop: HEADER_HEIGHT}}
          />
        );
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
      lazy={({route}) => route.key === 'popular'}
    />
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
    height: HEADER_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  tabbar: {
    height: HEADER_HEIGHT,
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
});
