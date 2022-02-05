import React, {memo, useState, useEffect} from 'react';
import {View, Text, Platform, FlatList, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-elements';
import Sort from './Sort';
import Users from './Users';
import analytics from '@react-native-firebase/analytics';

function Leaderboard(props) {
  const {theme} = useTheme();

  const [metric, setMetric] = useState('');
  const [range, setRange] = useState('week');
  const {communityId} = props;

  useEffect(() => {
    analytics().logEvent('leaderboard_sort', {
      type: metric == '' ? 'count_' + range : 'vote_' + range,
    });
  }, [metric, range]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        paddingTop: props.contentContainerStyle.paddingTop,
      }}>
      <Sort
        metric={metric}
        setMetric={setMetric}
        range={range}
        setRange={setRange}
      />
      <View style={styles.listView}>
        <View
          style={{
            flex: 1,
            borderRightWidth: 1,
            borderColor: theme.colors.grey2,
          }}>
          <View
            style={{
              padding: 10,
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: theme.colors.grey2,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: theme.colors.black5,
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              Pembuat Post
            </Text>
          </View>
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
          />
        </View>
        <View
          style={{
            flex: 1,
            borderRightWidth: 1,
            borderColor: theme.colors.grey2,
          }}>
          <View
            style={{
              padding: 10,
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: theme.colors.grey2,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: theme.colors.black5,
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              Pembuat Komentar
            </Text>
          </View>
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
          />
        </View>
      </View>
    </View>
  );
}

export default memo(Leaderboard);

const styles = StyleSheet.create({
  listView: {flexDirection: 'row', flex: 1},
});
