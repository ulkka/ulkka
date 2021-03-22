import React, {memo} from 'react';
import {View, Text} from 'react-native';

function TimeAgo(props) {
  const DisplayTime = (props) => {
    var currentTime = Date.now();
    var posted_at = new Date(props.time).getTime();
    var delta = Math.abs(currentTime - posted_at) / 1000;

    var daysAgo = Math.floor(delta / (60 * 60 * 24));
    var hoursAgo = Math.floor(delta / (60 * 60));
    var minutesAgo = Math.floor(delta / 60);
    var secondsAgo = Math.floor(delta);

    var weeksAgo = Math.floor(daysAgo / 7);
    var monthsAgo = Math.floor(daysAgo / 30);
    var yearsAgo = Math.floor(daysAgo / 365);

    var timeAgo =
      yearsAgo > 0
        ? yearsAgo + 'y'
        : monthsAgo > 0
        ? monthsAgo + 'mo'
        : weeksAgo > 0
        ? weeksAgo + 'w'
        : daysAgo > 0
        ? daysAgo + 'd'
        : hoursAgo > 0
        ? hoursAgo + 'h'
        : minutesAgo > 0
        ? minutesAgo + 'm'
        : secondsAgo + 's';

    return timeAgo;
  };

  return (
    <View>
      <Text style={{fontSize: props.size ? props.size : 11, color: '#555'}}>
        <DisplayTime time={props.time} />
      </Text>
    </View>
  );
}

export default memo(TimeAgo);
