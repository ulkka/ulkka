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
import {Button, useTheme} from 'react-native-elements';
import Posts from './tabs/Posts';
import Comments from './tabs/Comments';
import {makeId} from '../../components/Post/helpers';
import AccountDetail from './AccountDetail';
import {getBlockedUsers} from '../../redux/reducers/AuthSlice';
import {useSelector} from 'react-redux';
import {goBack} from '../../navigation/Ref';
import analytics from '@react-native-firebase/analytics';

const COLLAPSED_HEIGHT = 40;

export default function UserDetailTabView(props) {
  const {theme} = useTheme();

  const initialLayout = useWindowDimensions();
  const {userId} = props.route.params;
  const navigation = props.navigation;

  const blockedUsers = useSelector(getBlockedUsers);
  const isUserBlocked = blockedUsers?.includes(userId);

  const [screenName, setScreenName] = useState(
    'UserDetail-' + userId + '-' + makeId(5),
  );

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

  const handleIndexChange = index => {
    analytics().logScreenView({
      screen_name: 'UserDetail-' + routes[index].title,
      screen_class: 'UserDetail-' + routes[index].title,
    });
    scrolling.setValue(0);
    setIndex(index);
  };

  const renderTabBar = props => {
    return (
      <Animated.View
        onLayout={event => {
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
            height: COLLAPSED_HEIGHT,
            justifyContent: 'flex-start',
          }}
          indicatorStyle={{
            backgroundColor: theme.colors.blue,
          }}
        />
      </Animated.View>
    );
  };

  const CommentScene = (
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

  const PostScene = (
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

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'posts':
        return PostScene;
      case 'comments':
        return CommentScene;
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
        backgroundColor: theme.colors.grey0,
      }}>
      <Text
        style={{fontWeight: 'bold', fontSize: 20, color: theme.colors.black5}}>
        {'  '}
        User not available{'  '}
      </Text>
      <Button
        title="Go Back"
        type="outline"
        buttonStyle={{
          borderRadius: 20,
          borderWidth: 1,
          borderColor: theme.colors.grey5,
        }}
        titleStyle={{
          fontSize: 15,
          color: theme.colors.blue,
          padding: 4,
          fontWeight: 'bold',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}
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
      swipeEnabled={Platform.OS == 'android'}
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
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
