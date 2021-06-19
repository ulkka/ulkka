import React, {useState, useRef, useEffect, memo} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Platform,
  Text,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {Button} from 'react-native-elements';
import Posts from './tabs/Posts';
import {makeId} from '../../components/Post/helpers';
import CommunityDetail from './CommunityDetail';
import About from './tabs/About';
import Leaderboard from './tabs/Leaderboard/Leaderboard';
import {getIsCommunityRemoved} from '../../redux/reducers/CommunitySlice';
import {useSelector} from 'react-redux';
import {goBack} from '../../navigation/Ref';

const COLLAPSED_HEIGHT = 40;

export default function CommunityDetailTabView(props) {
  const initialLayout = useWindowDimensions();
  const {communityId} = props.route.params;
  const {navigation} = props;

  const isCommunityRemoved = useSelector(getIsCommunityRemoved);

  const [screenName, setScreenName] = useState(
    'CommunityDetail-' + communityId + '-' + makeId(5),
  );

  const routesArray = [
    {key: 'posts', title: 'Posts'},
    {key: 'leaderboard', title: 'Leaderboard'},
    {key: 'about', title: 'About'},
  ];

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState(routesArray);

  const [headerHeight, setHeaderHeight] = useState(100);
  const [titleShown, setTitleShown] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrolling = useRef(new Animated.Value(0)).current;

  scrolling.addListener(({value}) => {
    if (value > headerHeight - COLLAPSED_HEIGHT && !titleShown) {
      setTitleShown(true);
    }
    if (value < headerHeight - COLLAPSED_HEIGHT && titleShown) {
      setTitleShown(false);
    }
  });

  const translation = scrolling.interpolate({
    inputRange: [0, headerHeight - COLLAPSED_HEIGHT],
    outputRange: [0, COLLAPSED_HEIGHT - headerHeight],
    extrapolate: 'clamp',
  });

  const handleIndexChange = (index) => {
    scrolling.setValue(0);
    setIndex(index);
  };
  const renderTabBar = (props) => {
    return (
      <Animated.View
        onLayout={(event) => {
          const height = event.nativeEvent.layout.height;
          setHeaderHeight(height);
        }}
        style={[
          styles.header,
          {
            transform: [{translateY: translation}],
          },
        ]}>
        <View style={styles.overlay} />
        {
          <CommunityDetail
            communityId={communityId}
            navigation={navigation}
            titleShown={titleShown}
          />
        }
        <TabBar
          {...props}
          onTabPress={({preventDefault}) => isScrolling && preventDefault()}
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
      case 'posts':
        return (
          <Posts
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
            onMomentumScrollBegin={() => setIsScrolling(true)}
            onMomentumScrollEnd={() => setIsScrolling(false)}
            contentContainerStyle={{
              paddingTop: headerHeight,
            }}
            communityId={communityId}
            screenName={screenName}
          />
        );
      case 'leaderboard':
        return (
          <Leaderboard
            scrollEventThrottle={8}
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
            onMomentumScrollBegin={() => setIsScrolling(true)}
            onMomentumScrollEnd={() => setIsScrolling(false)}
            contentContainerStyle={{
              paddingTop: headerHeight,
            }}
            communityId={communityId}
          />
        );
      case 'about':
        return (
          <About
            scrollEventThrottle={8}
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
            onMomentumScrollBegin={() => setIsScrolling(true)}
            onMomentumScrollEnd={() => setIsScrolling(false)}
            contentContainerStyle={{
              paddingTop: headerHeight,
            }}
            communityId={communityId}
          />
        );
      default:
        return null;
    }
  };
  const RemovedCommunityView = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#fafafa',
      }}>
      <Text style={{fontWeight: 'bold', fontSize: 20, color: '#555'}}>
        {'  '}
        Community not available{'  '}
      </Text>
      <Button
        title="Go Back"
        type="outline"
        raised
        titleStyle={{fontSize: 15, color: '#2a9df4', padding: 4}}
        onPress={() => goBack()}
      />
    </View>
  );

  const CommunityTabView = (
    <TabView
      style={styles.container}
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={handleIndexChange}
      initialLayout={initialLayout}
      swipeEnabled={Platform.OS == 'android'}
    />
  );

  return isCommunityRemoved ? RemovedCommunityView : CommunityTabView;
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
