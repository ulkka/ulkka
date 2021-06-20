import React, {memo, useState} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import {Icon, CheckBox, Overlay, Button} from 'react-native-elements';

export default memo(function Sort(props) {
  const {metric, setMetric, range, setRange} = props;
  const [isVisible, setIsVisible] = useState(false);

  const close = () => {
    setIsVisible(false);
  };

  const getTopSortTitleFromRange = () => {
    const from = range;
    switch (from) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'alltime':
        return 'All Time';
    }
  };

  const topSortHandler = (from) => {
    close();
    setRange(from);
  };

  const topCreators = (
    <TouchableOpacity style={styles.metricOptionView}>
      <CheckBox
        onPress={() => setMetric('')}
        center
        title="Top Creators"
        titleProps={{style: styles.checkboxTitle}}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={metric === ''}
        containerStyle={styles.checkBoxContainerStyle}
        size={14}
        checkedColor="#555"
        uncheckedColor="#888"
      />
    </TouchableOpacity>
  );

  const mostVoted = (
    <TouchableOpacity style={styles.metricOptionView}>
      <CheckBox
        onPress={() => setMetric('Vote')}
        center
        title="Most Voted"
        titleProps={{style: styles.checkboxTitle}}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={metric == 'Vote'}
        containerStyle={styles.checkBoxContainerStyle}
        size={14}
        checkedColor="#555"
        uncheckedColor="#888"
      />
    </TouchableOpacity>
  );

  const selectRange = (
    <TouchableOpacity
      onPress={() => setIsVisible(true)}
      style={styles.selectRangeView}>
      <Text style={styles.selectRangeText}>{getTopSortTitleFromRange()}</Text>
      <View style={styles.horizontalSeperator}></View>
      <Icon name="caret-down" type="font-awesome" color="#666" size={16} />
    </TouchableOpacity>
  );

  const separator = <View style={styles.verticalSeperator}></View>;

  const todayTopSort = (
    <View style={styles.optionView}>
      <CheckBox
        onPress={() => topSortHandler('today')}
        center
        title="Today"
        titleProps={{style: styles.optionText}}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={range == 'today'}
        containerStyle={styles.checkBoxContainerStyle}
        size={20}
        checkedColor="#555"
        uncheckedColor="#888"
      />
    </View>
  );

  const thisWeekTopSort = (
    <View style={styles.optionView}>
      <CheckBox
        onPress={() => topSortHandler('week')}
        center
        title="This Week"
        titleProps={{style: styles.optionText}}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={range == 'week'}
        containerStyle={styles.checkBoxContainerStyle}
        size={20}
        checkedColor="#555"
        uncheckedColor="#888"
      />
    </View>
  );

  const thisMonthTopSort = (
    <View style={styles.optionView}>
      <CheckBox
        onPress={() => topSortHandler('month')}
        center
        title="This Month"
        titleProps={{style: styles.optionText}}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={range == 'month'}
        containerStyle={styles.checkBoxContainerStyle}
        size={20}
        checkedColor="#555"
        uncheckedColor="#888"
      />
    </View>
  );

  const allTimeTopSort = (
    <View style={styles.optionView}>
      <CheckBox
        onPress={() => topSortHandler('alltime')}
        center
        title="All Time"
        titleProps={{style: styles.optionText}}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={range == 'alltime'}
        containerStyle={styles.checkBoxContainerStyle}
        size={20}
        checkedColor="#555"
        uncheckedColor="#888"
      />
    </View>
  );

  const topSortOptions = (
    <View style={styles.topSortOptionsView}>
      {todayTopSort}
      {separator}
      {thisWeekTopSort}
      {separator}
      {thisMonthTopSort}
      {separator}
      {allTimeTopSort}
    </View>
  );

  const topSortOptionsList = (
    <View>
      <View style={styles.titleView}>
        <Text style={styles.title}>Select Time Period</Text>
      </View>
      {topSortOptions}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sortOptionView}>{topCreators}</View>
      <View style={styles.sortOptionView}>{mostVoted}</View>
      <View style={styles.sortOptionView}>{selectRange}</View>

      <Overlay
        isVisible={isVisible}
        statusBarTranslucent={true}
        onBackdropPress={() => close()}
        overlayStyle={styles.overlayStyle}
        backdropStyle={styles.backdropStyle}>
        <View>
          {topSortOptionsList}
          <Button
            raised
            type="solid"
            activeOpacity={0.5}
            titleStyle={styles.buttonTitleStyle}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={styles.buttonStyle}
            title="Close"
            onPress={() => close()}
          />
        </View>
      </Overlay>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(96, 96, 96, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  overlayStyle: {
    position: 'absolute',
    bottom: 0,
    width: '97%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  backdropStyle: {
    backgroundColor: '#000',
    opacity: 0.2,
  },
  titleView: {padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd'},
  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#555',
  },
  optionView: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 13,
    color: '#555',
    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
  },
  sortOptionView: {flex: 1, alignItems: 'center'},
  buttonStyle: {
    borderRadius: 25,
    paddingHorizontal: '45%',
    paddingVertical: 8,
    alignItems: 'center',
    borderColor: '#222',
    backgroundColor: '#eee',
  },
  buttonTitleStyle: {
    color: '#777',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 5,
  },
  buttonContainerStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
  },
  topSortOptionsView: {padding: 10},
  checkBoxContainerStyle: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    marginLeft: 0,
    borderWidth: 0,
    alignItems: 'flex-start',
  },
  selectRangeText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#555',
    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
  },
  horizontalSeperator: {width: 10},
  verticalSeperator: {
    height: 10,
  },
  selectRangeView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  checkboxTitle: {
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#555',
    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
  },
  metricOptionView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
