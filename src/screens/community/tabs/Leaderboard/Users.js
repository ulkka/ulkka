import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';
import {Divider, Icon, useTheme} from 'react-native-elements';
import communityApi from '../../../../services/CommunityApi';
import UserAvatar from '../../../../components/UserAvatar';
import {push} from '../../../../navigation/Ref';
import FeedFooter from '../../../../components/Feed/FeedFooter';
import {getTimestampFromRange} from '../../../../components/helpers';

const UserRow = memo(({user, index, metric}) => {
  const {theme} = useTheme();

  const {displayname, _id: userId, count, voteCount} = user;
  return displayname ? (
    <TouchableOpacity
      onPress={() => push('UserDetail', {userId: userId})}
      style={styles.userRowContainer}>
      <View style={styles.leftView}>
        <View style={styles.userRowView}>
          <View style={styles.indexView}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 14,
                color: theme.colors.black5,
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              {index + 1}.
            </Text>
          </View>
          <UserAvatar seed={displayname} size={'small'} />
          <Text
            style={{
              fontSize: 12,
              paddingVertical: 8,
              paddingLeft: 5,
              paddingRight: 3,
              maxWidth: 95,
              color: theme.colors.black5,
              fontWeight: '700',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {displayname}
          </Text>
        </View>
        {index < 3 && (
          <View>
            <Icon
              size={18}
              name="lightning-bolt"
              type="material-community"
              color={index == 0 ? 'gold' : index == 1 ? 'silver' : '#CD7F32'}
            />
          </View>
        )}
      </View>
      <View>
        <Text
          style={{
            paddingRight: 5,
            fontWeight: '700',
            fontSize: 13,
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {metric == '' ? count : voteCount}
        </Text>
      </View>
    </TouchableOpacity>
  ) : (
    <View />
  );
});

export default memo(function Users(props) {
  const {theme} = useTheme();

  const {communityId, range, metric, dimension, listEmptyText} = props;
  const [metadata, setMetadata] = useState({page: 0, limit: 10, total: -1});
  const [members, setMembers] = useState([]);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getFieldFromMetricDimension = () => {
    return dimension + metric;
  };
  const from = getTimestampFromRange(range);
  const field = getFieldFromMetricDimension();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    if (!complete && !loading && !error) {
      const {page, limit} = metadata;
      setLoading(true);
      const response = await communityApi.community
        .leaderboard(communityId, field, from, page + 1, limit)
        .catch(error => {
          setError(true);
          console.error('error fetching community members', error);
        });

      const memberList = response?.data?.data;
      if (memberList?.length) {
        setMembers([...members, ...memberList]);

        const mdata = response?.data?.metadata[0];
        setMetadata(mdata);

        const {page, limit, total} = mdata;
        if (page * limit >= total) {
          setComplete(true);
        }
      }
      setLoading(false);
    }
  };

  const separator = () => {
    return (
      <Divider style={{backgroundColor: theme.colors.primary, height: 10}} />
    );
  };
  const handlerRenderItem = ({item, index}) => {
    return (
      <UserRow
        user={item}
        index={index}
        dimension={dimension}
        metric={metric}
      />
    );
  };
  const handleLoadMore = () => {
    if (!complete && !loading && !error) {
      fetchLeaderboard();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        marginTop: 10,
        paddingHorizontal: 10,
      }}>
      {members?.length || loading ? (
        <FlatList
          persistentScrollbar={true}
          listKey={'leaderboard' + dimension + metric}
          renderItem={handlerRenderItem}
          data={members}
          keyExtractor={(item, index) => item._id + index}
          windowSize={15}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          ItemSeparatorComponent={separator}
          ListFooterComponent={() => (
            <FeedFooter complete={complete} loading={loading} text={' '} />
          )}
        />
      ) : (
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            alignSelf: 'center',
            paddingTop: 10,
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {listEmptyText}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  indexView: {paddingRight: 5},
  userRowView: {flexDirection: 'row', alignItems: 'center'},
  userRowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
