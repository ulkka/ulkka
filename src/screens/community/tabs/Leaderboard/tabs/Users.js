import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import communityApi from '../../../../../services/CommunityApi';
import UserAvatar from '../../../../../components/UserAvatar';
import {push} from '../../../../../navigation/Ref';
import FeedFooter from '../../../../../components/Feed/FeedFooter';
import {getTimestampFromRange} from '../../../../../components/helpers';

const UserRow = memo(({user, index}) => {
  const {displayname, _id: userId} = user;

  return displayname ? (
    <TouchableOpacity
      onPress={() => push('UserDetail', {userId: userId})}
      style={styles.userRowContainer}>
      <View style={styles.userRowView}>
        <View style={styles.indexView}>
          <Text style={styles.indexText}>{index + 1}.</Text>
        </View>
        <UserAvatar seed={displayname} size={'small'} />
        <Text style={styles.displaynameText}>{displayname}</Text>
      </View>
      {index < 3 && (
        <View>
          <Icon
            size={13}
            name="lightning-bolt"
            type="material-community"
            color={index == 0 ? 'gold' : index == 1 ? 'silver' : '#CD7F32'}
          />
        </View>
      )}
    </TouchableOpacity>
  ) : (
    <View></View>
  );
});

export default memo(function Users(props) {
  const {communityId, range, metric, dimension, listEmptyText} = props;
  console.log('props in leaderboard users', props);
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
        .catch((error) => {
          setError(true);
          console.log('error fetching community members', error);
        });

      const memberList = response?.data?.data;
      console.log('response in leaderboard users', memberList);
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
    return <Divider style={styles.separator} />;
  };
  const handlerRenderItem = ({item, index}) => {
    return <UserRow user={item} communityId={communityId} index={index} />;
  };
  const handleLoadMore = () => {
    if (!complete && !loading && !error) {
      fetchLeaderboard();
    }
  };

  return (
    <View style={styles.container}>
      {members?.length || loading ? (
        <FlatList
          persistentScrollbar={true}
          listKey="communityMembers"
          renderItem={handlerRenderItem}
          data={members}
          keyExtractor={(item, index) => item + index}
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
        <Text style={styles.emptyListText}>{listEmptyText}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  separator: {backgroundColor: '#fff', height: 10},
  emptyListText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingTop: '50%',
    color: '#555',
    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
  },
  displaynameText: {
    fontSize: 14,
    padding: 8,
    color: '#555',
    fontWeight: '700',
    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
  },
  indexText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
  },
  indexView: {paddingRight: 10},
  userRowView: {flexDirection: 'row', alignItems: 'center'},
  userRowContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
