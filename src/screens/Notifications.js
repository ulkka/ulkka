import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Icon, useTheme} from 'react-native-elements';
import TimeAgo from '../components/TimeAgo';
import {
  fetchAllNotifications,
  resetNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  selectAllNotifications,
  isNotificationsComplete,
  isNotificationsLoading,
  getNeedsRefresh,
} from '../redux/reducers/NotificationSlice';
import UserAvatar from '../components/UserAvatar';
import PushNotification from 'react-native-push-notification';
import analytics from '@react-native-firebase/analytics';
import {
  navigateToLink,
  getScreenFromLink,
  getLinkFromRemoteMessage,
} from '../components/helpers';
import {useTranslation} from 'react-i18next';

const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
const validRestOfTheTexts = [
  ' received an upvote on your post',
  ' received a downvote on your post',
  ' received an upvote on your comment',
  ' received a downvote on your comment',
  ' replied to your post',
  ' replied to your comment',
  ' invited you to join',
  ' was dismissed as admin of',
  ' was promoted as an admin for',
  ' posted in',
  ' joined',
];
export default function Notifications(props) {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);
  const isLoading = useSelector(isNotificationsLoading);
  const isComplete = useSelector(isNotificationsComplete);
  const needsRefresh = useSelector(getNeedsRefresh);

  useEffect(() => {
    PushNotification.removeAllDeliveredNotifications();
    initialiseNotifications();

    return () => {
      dispatch(markAllNotificationsRead());
      dispatch(resetNotifications());
    };
  }, []);

  const initialiseNotifications = async () => {
    await dispatch(resetNotifications());
    await dispatch(fetchAllNotifications());
  };

  const markAllNotificationsReadHandler = async () => {
    dispatch(markAllNotificationsRead());
  };

  const markNotificationReadHandler = item => {
    const {_id: id, link} = item;
    id && dispatch(markNotificationRead(id));

    const entityType = getScreenFromLink(link);
    if (entityType == 'PostDetail') {
      analytics().logEvent('postdetail_clickedfrom', {
        clicked_from: 'notification',
        screen: 'notifications',
      });
    } else if (entityType == 'CommunityNavigation') {
      analytics().logEvent('communitydetail_clickedfrom', {
        clicked_from: 'notification',
        screen: 'notifications',
      });
    }
    navigateToLink(getLinkFromRemoteMessage({data: item}));
  };

  const handleLoadMore = () => {
    if (!isLoading && !isComplete) {
      dispatch(fetchAllNotifications());
    }
  };

  const renderRow = ({item}) => {
    const username = item.text.split(' ')[0];
    const restOfTheText = item.text.replace(username, '');
    return (
      <TouchableOpacity
        onPress={() => markNotificationReadHandler(item)}
        style={{
          backgroundColor: item.read ? theme.colors.primary : '#ff450011',
          padding: 10,
          height: 70,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', maxWidth: '80%'}}>
          {username.length >= 4 &&
          validRestOfTheTexts.find(text => restOfTheText.includes(text)) ? (
            <UserAvatar seed={username} size="medium" />
          ) : (
            <Image
              resizeMode={'contain'}
              source={require('../../assets/ulkka_title_transparent.png')}
              style={{height: 20, width: 20, marginHorizontal: 5}}
            />
          )}
          <Text
            style={{
              color: theme.colors.black3,
              paddingLeft: 5,
              fontSize: 13,
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {username.length >= 4 &&
            validRestOfTheTexts.includes(restOfTheText) ? (
              <B>{username}</B>
            ) : (
              username
            )}
            {restOfTheText}
          </Text>
        </View>
        <TimeAgo time={item.created_at} />
      </TouchableOpacity>
    );
  };

  const refreshButton = needsRefresh && (
    <Button
      type="solid"
      activeOpacity={0.5}
      titleStyle={{
        color: theme.colors.black5,
        fontWeight: '500',
        fontSize: 12,
        marginRight: 10,
      }}
      containerStyle={{
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 5,
        position: 'absolute',
        top: 5,
        borderRadius: 15,
        alignItems: 'center',
        borderColor: theme.colors.grey4,
        borderWidth: 1,
      }}
      icon={<Icon name="refresh" size={15} color={theme.colors.blue} />}
      iconRight
      title="You have new notifications"
      onPress={() => initialiseNotifications()}
    />
  );

  const ListEmptyComponent = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <Text
        style={{fontWeight: 'bold', color: theme.colors.black5, fontSize: 16}}>
        {'   '}
        {t('No Notifications Yet')}
        {'  '}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
      }}>
      {notifications?.length ? (
        <View style={{flex: 1}}>
          <FlatList
            listKey="notificationsList"
            renderItem={renderRow}
            data={notifications}
            removeClippedSubviews={Platform.OS != 'ios'} // Pd: Don't enable this on iOS where this is buggy and views don't re-appear. user comment wont show scroll started
            keyExtractor={(item, index) => item._id}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={500}
            windowSize={11}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.9}
            ListFooterComponent={<View style={{height: 75}}></View>}
          />
          {refreshButton}
        </View>
      ) : isComplete ? (
        ListEmptyComponent
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={theme.colors.blue} />
          <Text
            style={{
              padding: 50,
              fontSize: 15,
              fontWeight: 'bold',
              color: theme.colors.black5,
            }}>
            {'  '}Loading...{'  '}
          </Text>
        </View>
      )}
    </View>
  );
}
