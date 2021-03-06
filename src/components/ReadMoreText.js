import React from 'react';
import {View, Text} from 'react-native';
import ReadMore from 'react-native-read-more-text';

const ReadMoreText = (props) => {
  const _renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{color: '#187bcd', marginTop: 5}} onPress={handlePress}>
        Read more
      </Text>
    );
  };

  const _renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{color: '#2a9df4', marginTop: 5}} onPress={handlePress}>
        Show less
      </Text>
    );
  };

  return (
    <View>
      <ReadMore
        numberOfLines={props.numberOfLines}
        renderTruncatedFooter={_renderTruncatedFooter}
        renderRevealedFooter={_renderRevealedFooter}>
        {props.children}
      </ReadMore>
    </View>
  );
};

export default ReadMoreText;
