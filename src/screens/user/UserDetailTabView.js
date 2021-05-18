import React, {useState, useRef} from 'react';
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
import Comments from './tabs/Comments';
import {makeId} from '../../components/Post/helpers';
import AccountDetail from './AccountDetail';
import {
  getRegisteredUser,
  getBlockedUsers,
} from '../../redux/reducers/AuthSlice';
import {useSelector, useDispatch} from 'react-redux';
import {goBack} from '../../navigation/Ref';

const COLLAPSED_HEIGHT = 40;

export default function UserDetailTabView(props) {
  const initialLayout = useWindowDimensions();
  const userId = props.route.params.userId;
  const {navigation} = props;

  const blockedUsers = useSelector(getBlockedUsers);
  const isUserBlocked = blockedUsers?.includes(userId);

  const [screenName, setScreenName] = useState(
    'UserDetail-' + userId + '-' + makeId(5),
  );

  console.log('userId in tab view', userId);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'posts', title: 'Posts'},
    {key: 'comments', title: 'Comments'},
  ]);

  const [headerHeight, setHeaderHeight] = useState(150);
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
        <AccountDetail
          userId={userId}
          navigation={navigation}
          titleShown={titleShown}
        />
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
          contentContainerStyle={{padding: 0, borderWidth: 1}}
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
            userId={userId}
            screenName={screenName}
          />
        );
      case 'comments':
        return (
          <Comments
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
            userId={userId}
          />
        );
      default:
        return null;
    }
  };

  const BlockedUserView = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#fafafa',
      }}>
      <Text style={{fontWeight: 'bold', fontSize: 20, color: '#555'}}>
        {'  '}
        User not available{'  '}
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

  return isUserBlocked ? BlockedUserView : UserTabView;
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
