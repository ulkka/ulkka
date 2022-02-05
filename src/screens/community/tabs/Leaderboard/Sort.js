import React, {memo, useState} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import {Icon, CheckBox, Overlay, Button, useTheme} from 'react-native-elements';

export default memo(function Sort(props) {
  const {theme} = useTheme();
  const {metric, setMetric, range, setRange} = props;
  const [isVisible, setIsVisible] = useState(false);

  const close = () => {
    setIsVisible(false);
  };

  const getTopSortTitleFromRange = () => {
    const from = range;
    switch (from) {
      case 'today':
        return 'Hari ini';
      case 'week':
        return 'Minggu ini';
      case 'month':
        return 'Bulan ini';
      case 'alltime':
        return 'Sepanjang waktu';
    }
  };

  const topSortHandler = from => {
    close();
    setRange(from);
  };

  const topCreators = (
    <TouchableOpacity style={styles.metricOptionView}>
      <CheckBox
        onPress={() => setMetric('')}
        center
        title="Top Creators"
        titleProps={{
          style: {
            paddingLeft: 10,
            fontWeight: 'bold',
            fontSize: 12,
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          },
        }}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={metric === ''}
        containerStyle={styles.checkBoxContainerStyle}
        size={14}
        checkedColor={theme.colors.black5}
        uncheckedColor="#888"
      />
    </TouchableOpacity>
  );

  const mostVoted = (
    <TouchableOpacity style={styles.metricOptionView}>
      <CheckBox
        onPress={() => setMetric('Vote')}
        center
        title="Paling Banyak Divote"
        titleProps={{
          style: {
            paddingLeft: 10,
            fontWeight: 'bold',
            fontSize: 12,
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          },
        }}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={metric == 'Vote'}
        containerStyle={styles.checkBoxContainerStyle}
        size={14}
        checkedColor={theme.colors.black5}
        uncheckedColor="#888"
      />
    </TouchableOpacity>
  );

  const selectRange = (
    <TouchableOpacity
      onPress={() => setIsVisible(true)}
      style={styles.selectRangeView}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 12,
          color: theme.colors.black5,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        {getTopSortTitleFromRange()}
      </Text>
      <View style={styles.horizontalSeperator}></View>
      <Icon
        name="caret-down"
        type="font-awesome"
        color={theme.colors.black6}
        size={16}
      />
    </TouchableOpacity>
  );

  const separator = <View style={styles.verticalSeperator}></View>;

  const todayTopSort = (
    <View style={styles.optionView}>
      <CheckBox
        onPress={() => topSortHandler('today')}
        center
        title="Today"
        titleProps={{
          style: {
            paddingLeft: 10,
            fontWeight: 'bold',
            fontSize: 13,
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          },
        }}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={range == 'today'}
        containerStyle={styles.checkBoxContainerStyle}
        size={20}
        checkedColor={theme.colors.black5}
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
        titleProps={{
          style: {
            paddingLeft: 10,
            fontWeight: 'bold',
            fontSize: 13,
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          },
        }}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={range == 'week'}
        containerStyle={styles.checkBoxContainerStyle}
        size={20}
        checkedColor={theme.colors.black5}
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
        titleProps={{
          style: {
            paddingLeft: 10,
            fontWeight: 'bold',
            fontSize: 13,
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          },
        }}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={range == 'month'}
        containerStyle={styles.checkBoxContainerStyle}
        size={20}
        checkedColor={theme.colors.black5}
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
        titleProps={{
          style: {
            paddingLeft: 10,
            fontWeight: 'bold',
            fontSize: 13,
            color: theme.colors.black5,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          },
        }}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={range == 'alltime'}
        containerStyle={styles.checkBoxContainerStyle}
        size={20}
        checkedColor={theme.colors.black5}
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
      <View
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.grey3,
        }}>
        <Text
          style={{
            fontSize: 13,
            textTransform: 'uppercase',
            fontWeight: '700',
            color: theme.colors.black5,
          }}>
          Pilih jangka waktu
        </Text>
      </View>
      {topSortOptions}
    </View>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.grey2,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
      }}>
      <View style={styles.sortOptionView}>{topCreators}</View>
      <View style={styles.sortOptionView}>{mostVoted}</View>
      <View style={styles.sortOptionView}>{selectRange}</View>

      <Overlay
        isVisible={isVisible}
        statusBarTranslucent={true}
        onBackdropPress={() => close()}
        overlayStyle={{
          position: 'absolute',
          bottom: 0,
          width: '97%',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: theme.colors.grey1,
        }}
        backdropStyle={{
          backgroundColor: theme.colors.black0,
          opacity: 0.2,
        }}>
        <View>
          {topSortOptionsList}
          <Button
            type="solid"
            activeOpacity={0.5}
            titleStyle={{
              color: theme.colors.black5,
              fontWeight: '500',
              fontSize: 12,
            }}
            containerStyle={styles.buttonContainerStyle}
            buttonStyle={{
              borderWidth: 1,
              borderRadius: 25,
              paddingHorizontal: '45%',
              paddingVertical: 8,
              alignItems: 'center',
              borderColor: theme.colors.grey5,
              backgroundColor: theme.colors.grey3,
            }}
            title="Close"
            onPress={() => close()}
          />
        </View>
      </Overlay>
    </View>
  );
});

const styles = StyleSheet.create({
  overlayStyle: {
    position: 'absolute',
    bottom: 0,
    width: '97%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  optionView: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sortOptionView: {flex: 1, alignItems: 'center'},

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

  horizontalSeperator: {width: 10},
  verticalSeperator: {
    height: 10,
  },
  selectRangeView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  metricOptionView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
