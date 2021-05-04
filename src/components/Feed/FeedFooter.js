import React, {memo} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

function FeedFooterComponent(props) {
  const {complete, loading, text} = props;
  if (complete) {
    return (
      <View style={styles.listEmptyView}>
        <Text style={styles.listEmptyText}>
          {'  '}
          {text ? text : 'This feed is over'}
          {'  '}
        </Text>
      </View>
    );
  } else {
    return (
      loading && (
        <View style={styles.loadingView}>
          {
            // Activity indicator was causing scroll to flicker, check that if you put it back
            <Image
              source={require('../../../assets/loading.gif')}
              style={{height: 40, width: 40}}
            />
          }
        </View>
      )
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
  listEmptyText: {
    flex: 1,
    padding: 9,
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#444',
  },
  loadingView: {
    flex: 1,
    height: 120,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default memo(FeedFooterComponent);
