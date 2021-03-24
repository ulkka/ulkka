import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {showOptionSheet} from '../redux/reducers/OptionSheetSlice';
import {useDispatch} from 'react-redux';

const ExtraOptions = (props) => {
  const dispatch = useDispatch();
  const {type, id} = props;
  return (
    <TouchableOpacity
      style={{padding: 5}}
      hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      onPress={() => dispatch(showOptionSheet({type: type, id: id}))}>
      <Icon name="more-horiz" size={18} color="#888" />
    </TouchableOpacity>
  );
};

export default memo(ExtraOptions);
