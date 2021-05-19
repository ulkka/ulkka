import React, {memo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Icon, BottomSheet, ListItem, Overlay} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {sortFeed} from '../../redux/actions/FeedActions';
import {getFeedSortMethod} from '../../redux/selectors/FeedSelectors';

export default function SortFeed(props) {
  const dispatch = useDispatch();
  const {screen} = props;

  const sortMethod = useSelector((state) => getFeedSortMethod(state, screen));

  const [isVisible, setIsVisible] = useState(false);
  const list = [
    {title: 'List Item 1'},
    {title: 'List Item 2'},
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: 'red'},
      titleStyle: {color: 'white'},
      onPress: () => setIsVisible(false),
    },
  ];

  const getCurrentSortMethod = () => {
    switch (sortMethod) {
      case 'hot':
        return HotSortOption;
      case 'new':
        return NewSortOption;
      case 'top':
        return TopSortOption;
      default:
        return HotSortOption;
    }
  };

  const SelectSort = () => {
    return (
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={{
          paddingHorizontal: 7,
          backgroundColor: '#f5f5f5',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}>
        {getCurrentSortMethod()}
        <View style={{width: 10}}></View>
        <Icon name="caret-down" type="font-awesome" color="#666" size={16} />
      </TouchableOpacity>
    );
  };

  const noSortView = <View style={{height: 1, backgroundColor: '#fff'}}></View>;

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

  const TopSortOption = (
    <View style={styles.optionView}>
      <View style={styles.iconViewStyle}>
        <Icon name="trophy" type="font-awesome-5" color="#666" size={16} />
      </View>
      <Text style={styles.optionText}>Top</Text>
    </View>
  );

  const separator = <View style={{height: 10}}></View>;

  const updateSortMethodHandler = (method) => {
    setIsVisible(false);
    dispatch(sortFeed({type: screen, sort: method}));
  };

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
  return (
    <View>
      <SelectSort />
      <Overlay
        isVisible={isVisible}
        statusBarTranslucent={true}
        onBackdropPress={() => setIsVisible(false)}
        overlayStyle={styles.overlayStyle}
        backdropStyle={styles.backdropStyle}>
        <View>
          <View style={styles.title}>
            <Text>Sort By</Text>
          </View>
          {sortOptions}
        </View>
      </Overlay>
    </View>
  );
}

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
  title: {padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd'},
  optionView: {paddingVertical: 10, flexDirection: 'row', alignItems: 'center'},
  optionText: {
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#555',
    ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
  },
  iconViewStyle: {
    width: 20,
  },
});
