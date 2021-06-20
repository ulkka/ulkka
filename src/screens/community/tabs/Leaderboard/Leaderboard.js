import React, {memo, useState} from 'react';
import {View, Text, Platform, FlatList, StyleSheet} from 'react-native';
import Sort from './Sort';
import Users from './tabs/Users';

function Leaderboard(props) {
  const [metric, setMetric] = useState('');
  const [range, setRange] = useState('week');
  const {communityId} = props;

  return (
    <View
      style={{
        ...styles.container,
        paddingTop: props.contentContainerStyle.paddingTop,
      }}>
      <Sort
        metric={metric}
        setMetric={setMetric}
        range={range}
        setRange={setRange}
      />
      <View style={styles.listView}>
        <View style={styles.singleListView}>
          <FlatList
            listKey="leaderboardposters"
            keyExtractor={(item, index) => item + index}
            windowSize={15}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            ListFooterComponent={memo(() => (
              <Users
                communityId={communityId}
                range={range}
                metric={metric}
                dimension={'post'}
                listEmptyText={'No posts yet'}
              />
            ))}
            ListHeaderComponent={memo(() => {
              return (
                <View style={styles.listHeaderView}>
                  <Text style={styles.listTitle}>Posters</Text>
                </View>
              );
            })}
          />
        </View>
        <View style={styles.singleListView}>
          <FlatList
            listKey="leaderboardcommenters"
            keyExtractor={(item, index) => item + index}
            windowSize={15}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            ListFooterComponent={memo(() => (
              <Users
                communityId={communityId}
                range={range}
                metric={metric}
                dimension={'comment'}
                listEmptyText={'No comments yet'}
              />
            ))}
            ListHeaderComponent={memo(() => {
              return (
                <View style={styles.listHeaderView}>
                  <Text style={styles.listTitle}>Commenters</Text>
                </View>
              );
            })}
          />
        </View>
      </View>
    </View>
  );
}

export default memo(Leaderboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listView: {flexDirection: 'row', flex: 1},
  singleListView: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  listHeaderView: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  listTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
  },
});
