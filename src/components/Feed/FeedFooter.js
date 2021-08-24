import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from 'react-native-elements';

function FeedFooterComponent(props) {
  const {complete, loading, text} = props;
  const {theme} = useTheme();
  if (complete) {
    return (
      <View style={styles.listEmptyView}>
        <Text
          style={{
            flex: 1,
            padding: 9,
            justifyContent: 'center',
            fontWeight: 'bold',
            color: theme.colors.black4,
          }}>
          {'  '}
          {text ? text : 'This feed is over'}
          {'  '}
        </Text>
      </View>
    );
  } else {
    return loading ? (
      <View style={styles.loadingView}>
        {
          // Activity indicator was causing scroll to flicker, check that if you put it back
          <ActivityIndicator size="large" color={theme.colors.blue} />
        }
      </View>
    ) : (
      <View></View>
    );
  }
}
const styles = StyleSheet.create({
  listEmptyView: {
    height: 120,
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },

  loadingView: {
    flex: 1,
    height: 120,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default FeedFooterComponent;
