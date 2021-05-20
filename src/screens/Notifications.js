import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Icon} from 'react-native-elements';
import TimeAgo from '../components/TimeAgo';
import {push} from '../navigation/Ref';
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

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
const validRestOfTheTexts = [
  ' received an upvote on your post',
  ' received a downvote on your post',
  ' received an upvote on your comment',
  ' received a downvote on your comment',
  ' replied to your post',
  ' replied to your comment',
];
export default function Notifications(props) {
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

  const markNotificationReadHandler = (id, postId) => {
    dispatch(markNotificationRead(id));
    if (postId) {
      analytics().logEvent('postdetail_clickedfrom', {
        clicked_from: 'notification',
        screen: 'notifications',
      });
      push('PostDetail', {postId: postId});
    }
  };

  const handleLoadMore = () => {
    if (!isLoading && !isComplete) {
      dispatch(fetchAllNotifications());
    }
  };

  const renderRow = ({item}) => {
    const postId = item?.link?.split('/')[2];
    const username = item.text.split(' ')[0];
    const restOfTheText = item.text.replace(username, '');
    return (
      <TouchableOpacity
        onPress={() => markNotificationReadHandler(item._id, postId)}
        style={{
          backgroundColor: item.read ? '#fff' : '#ff450011',
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
          validRestOfTheTexts.includes(restOfTheText) ? (
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
              color: '#333',
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

  const markAllReadButton = (
    <Button
      raised
      type="solid"
      activeOpacity={0.5}
      titleStyle={{
        color: '#0099ff',
        fontWeight: '500',
        fontSize: 13,
      }}
      containerStyle={{
        alignItems: 'center',
        width: 130,
        alignSelf: 'center',
        borderRadius: 15,
        marginTop: 10,
        position: 'absolute',
        bottom: 10,
      }}
      buttonStyle={{
        alignItems: 'center',
        borderColor: '#222',
      }}
      title="Mark All Read"
      onPress={() => markAllNotificationsReadHandler()}
    />
  );

  const refreshButton = needsRefresh && (
    <Button
      raised
      type="solid"
      activeOpacity={0.5}
      titleStyle={{
        color: '#555',
        fontWeight: '500',
        fontSize: 12,
        marginRight: 10,
      }}
      containerStyle={{
        alignItems: 'center',
        width: '55%',
        alignSelf: 'center',
        borderRadius: 15,
        marginTop: 5,
        position: 'absolute',
        top: 5,
      }}
      buttonStyle={{
        alignItems: 'center',
        borderColor: '#222',
      }}
      icon={<Icon name="refresh" size={15} color="#187bcd" />}
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
      <Text style={{fontWeight: 'bold', color: '#555', fontSize: 16}}>
        {'   '}
        No Notifications Yet!{'  '}
      </Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
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
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#2a9df4" />
          <Text
            style={{
              padding: 50,
              fontSize: 15,
              fontWeight: 'bold',
              color: '#555',
            }}>
            {'  '}Loading...{'  '}
          </Text>
        </View>
      )}
    </View>
  );
}
