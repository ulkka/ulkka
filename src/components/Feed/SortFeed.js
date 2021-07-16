import React, {useState, memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Icon, Overlay, CheckBox, Button} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {sortFeed} from '../../redux/actions/FeedActions';
import {
  getFeedSortMethod,
  getFeedTopSortFrom,
} from '../../redux/selectors/FeedSelectors';

export default memo(function SortFeed(props) {
  const dispatch = useDispatch();
  const {screen} = props;

  const sortMethod = useSelector((state) => getFeedSortMethod(state, screen));
  const topSortFrom = useSelector((state) => getFeedTopSortFrom(state, screen));

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

  //const noSortView = <View style={{height: 1, backgroundColor: '#fff'}}></View>;

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

  const topSortHandler = (from) => {
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
        <Icon name="caret-down" type="font-awesome" color="#666" size={16} />
      </TouchableOpacity>
    );
  };

  const NewSortOption = (
    <View style={styles.optionView}>
      <View style={styles.iconViewStyle}>
        <Icon name="clock" type="material-community" color="#666" size={19} />
      </View>
      <Text style={styles.optionText}>New</Text>
    </View>
  );

  const HotSortOption = (
    <View style={styles.optionView}>
      <View style={styles.iconViewStyle}>
        <Icon name="fire" type="font-awesome-5" color="#666" size={18} />
      </View>
      <Text style={styles.optionText}>Hot</Text>
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
        <Icon name="trophy" type="font-awesome-5" color="#666" size={16} />
      </View>
      <Text style={styles.topOptionText}>Top Posts {getTopSortFromText()}</Text>
    </View>
  );

  const TopSortOption = (
    <View style={styles.optionView}>
      <View style={styles.iconViewStyle}>
        <Icon name="trophy" type="font-awesome-5" color="#666" size={16} />
      </View>
      <Text style={styles.optionText}>Top</Text>
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
      <View style={styles.titleView}>
        <Text style={styles.title}>Sort By</Text>
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
        titleProps={{style: styles.optionText}}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={topSortFrom == 'today'}
        containerStyle={styles.checkboxContainer}
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
        checked={topSortFrom == 'week'}
        containerStyle={styles.checkboxContainer}
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
        checked={topSortFrom == 'month'}
        containerStyle={styles.checkboxContainer}
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
        checked={topSortFrom == 'alltime'}
        containerStyle={styles.checkboxContainer}
        size={20}
        checkedColor="#555"
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
      <View style={styles.titleView}>
        <Text style={styles.title}>Top Posts from</Text>
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
        overlayStyle={styles.overlayStyle}
        backdropStyle={styles.backdropStyle}>
        <View>
          {top ? topSortOptionsList : sortOptionsList}
          <Button
            raised
            type="solid"
            activeOpacity={0.5}
            titleStyle={{
              color: '#777',
              fontWeight: '500',
              fontSize: 12,
            }}
            containerStyle={{
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 5,
            }}
            buttonStyle={{
              borderRadius: 25,
              paddingHorizontal: '45%',
              paddingVertical: 8,
              alignItems: 'center',
              borderColor: '#222',
              backgroundColor: '#eee',
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
  backdropStyle: {
    backgroundColor: '#000',
    opacity: 0.2,
  },
  titleView: {padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd'},
  title: {
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#555',
  },
  optionView: {
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
  topOptionText: {
    paddingLeft: 10,
    fontWeight: '700',
    fontSize: 11,
    color: '#555',
    textTransform: 'uppercase',
    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
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
