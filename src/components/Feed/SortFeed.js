import React, {useState, memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Icon, Overlay, CheckBox, Button, useTheme} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {sortFeed} from '../../redux/actions/FeedActions';
import {
  getFeedSortMethod,
  getFeedTopSortFrom,
} from '../../redux/selectors/FeedSelectors';

export default memo(function SortFeed(props) {
  const dispatch = useDispatch();
  const {screen} = props;
  const {theme} = useTheme();
  const sortMethod = useSelector(state => getFeedSortMethod(state, screen));
  const topSortFrom = useSelector(state => getFeedTopSortFrom(state, screen));

  const [isVisible, setIsVisible] = useState(false);
  const [top, setTop] = useState(false);

  const getCurrentSortMethod = () => {
    switch (sortMethod) {
      case 'hot':
        return HotSortOption;
      case 'new':
        return NewSortOption;
      case 'top':
        return TopSortOptionTitle;
      default:
        return HotSortOption;
    }
  };

  //const noSortView = <View style={{height: 1, backgroundColor: theme.colors.primary}}></View>;

  const close = () => {
    setTop(false);
    setIsVisible(false);
  };

  const updateSortMethodHandler = (method, from) => {
    if (method == 'top') {
      setTop(true);
    } else {
      close();
      dispatch(sortFeed({type: screen, sort: method}));
    }
  };

  const topSortHandler = from => {
    close();
    dispatch(sortFeed({type: screen, sort: 'top', from: from}));
  };

  const SelectSort = () => {
    return (
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={{
          paddingHorizontal: 7,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        {getCurrentSortMethod()}
        <View style={{width: 7}}></View>
        <Icon
          name="caret-down"
          type="font-awesome"
          color={theme.colors.black6}
          size={16}
        />
      </TouchableOpacity>
    );
  };

  const NewSortOption = (
    <View style={styles.optionView}>
      <View style={styles.iconViewStyle}>
        <Icon
          name="clock"
          type="material-community"
          color={theme.colors.black6}
          size={19}
        />
      </View>
      <Text
        style={{
          paddingLeft: 10,
          fontWeight: 'bold',
          fontSize: 13,
          color: theme.colors.black5,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        New
      </Text>
    </View>
  );

  const HotSortOption = (
    <View style={styles.optionView}>
      <View style={styles.iconViewStyle}>
        <Icon
          name="fire"
          type="font-awesome-5"
          color={theme.colors.black6}
          size={18}
        />
      </View>
      <Text
        style={{
          paddingLeft: 10,
          fontWeight: 'bold',
          fontSize: 13,
          color: theme.colors.black5,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        Hot
      </Text>
    </View>
  );

  const getTopSortFromText = () => {
    const from = topSortFrom;
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

  const TopSortOptionTitle = (
    <View style={styles.optionView}>
      <View style={styles.iconViewStyle}>
        <Icon
          name="trophy"
          type="font-awesome-5"
          color={theme.colors.black6}
          size={16}
        />
      </View>
      <Text
        style={{
          paddingLeft: 10,
          fontWeight: '700',
          fontSize: 11,
          color: theme.colors.black5,
          textTransform: 'uppercase',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        Top Posts {getTopSortFromText()}
      </Text>
    </View>
  );

  const TopSortOption = (
    <View style={styles.optionView}>
      <View style={styles.iconViewStyle}>
        <Icon
          name="trophy"
          type="font-awesome-5"
          color={theme.colors.black6}
          size={16}
        />
      </View>
      <Text
        style={{
          paddingLeft: 10,
          fontWeight: 'bold',
          fontSize: 13,
          color: theme.colors.black5,
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        Top
      </Text>
    </View>
  );

  const separator = <View style={{height: 10}}></View>;

  const sortOptions = (
    <View style={{padding: 10}}>
      <TouchableOpacity onPress={() => updateSortMethodHandler('new')}>
        {NewSortOption}
      </TouchableOpacity>
      {separator}
      <TouchableOpacity onPress={() => updateSortMethodHandler('hot')}>
        {HotSortOption}
      </TouchableOpacity>
      {separator}
      <TouchableOpacity onPress={() => updateSortMethodHandler('top')}>
        {TopSortOption}
      </TouchableOpacity>
    </View>
  );

  const sortOptionsList = (
    <View>
      <View
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.grey3,
        }}>
        <Text
          style={{
            textTransform: 'uppercase',
            fontWeight: '700',
            color: theme.colors.black5,
          }}>
          Sort By
        </Text>
      </View>
      {sortOptions}
    </View>
  );

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
        checked={topSortFrom == 'today'}
        containerStyle={styles.checkboxContainer}
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
        checked={topSortFrom == 'week'}
        containerStyle={styles.checkboxContainer}
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
        checked={topSortFrom == 'month'}
        containerStyle={styles.checkboxContainer}
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
        checked={topSortFrom == 'alltime'}
        containerStyle={styles.checkboxContainer}
        size={20}
        checkedColor={theme.colors.black5}
        uncheckedColor="#888"
      />
    </View>
  );

  const topSortOptions = (
    <View style={{flex: 1, padding: 10}}>
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
            textTransform: 'uppercase',
            fontWeight: '700',
            color: theme.colors.black5,
          }}>
          Top Posts from
        </Text>
      </View>
      {topSortOptions}
    </View>
  );

  return (
    <View>
      <SelectSort />
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
          {top ? topSortOptionsList : sortOptionsList}
          <Button
            type="solid"
            activeOpacity={0.5}
            titleStyle={{
              color: theme.colors.black6,
              fontWeight: '500',
              fontSize: 12,
            }}
            containerStyle={{
              alignItems: 'center',
              alignSelf: 'center',
              marginVertical: 5,
            }}
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
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconViewStyle: {
    width: 20,
  },
  checkboxContainer: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
    marginLeft: 0,
    borderWidth: 0,
  },
});
