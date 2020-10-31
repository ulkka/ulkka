import React, {memo} from 'react';
import {SafeAreaView, ActivityIndicator, Text, StyleSheet} from 'react-native';

function FeedFooterComponent(props) {
  if (props.complete) {
    return (
      <SafeAreaView style={styles.listEmptyView}>
        <Text style={styles.listEmptyText}>Sorry, this feed is over.</Text>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.loadingView}>
        <ActivityIndicator size="large" color="#4285f4" />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  listEmptyView: {
    height: 40,
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  listEmptyText: {
    width: '50%',
    flex: 1,
    padding: 9,
    justifyContent: 'center',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  loadingView: {
    marginTop: 10,
    height: 80,
  },
});
export default memo(FeedFooterComponent);
