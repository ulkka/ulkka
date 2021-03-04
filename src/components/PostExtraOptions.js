import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {showOptionSheet} from '../redux/reducers/OptionSheetSlice';
import {useDispatch} from 'react-redux';

export default function PostExtraOptions(props) {
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      style={{padding: 5}}
      onPress={() =>
        dispatch(
          showOptionSheet({optionType: props.optionType, id: props.postId}),
        )
      }>
      <Icon name="more-horiz" size={18} color="#888" />
    </TouchableOpacity>
  );
}
