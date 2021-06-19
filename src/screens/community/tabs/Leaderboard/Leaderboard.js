import React, {memo} from 'react';
import {View} from 'react-native';
import Sort from './Sort';
import LeaderboardTabView from './LeaderboardTabView';

export default memo(function Leaderboard(props) {
  const {communityId} = props;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: props.contentContainerStyle.paddingTop,
      }}>
      <Sort />
      <LeaderboardTabView communityId={communityId} />
    </View>
  );
});
