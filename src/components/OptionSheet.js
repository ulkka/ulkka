import React from 'react';
import {View} from 'react-native';
import {ListItem, Divider, Button, Overlay} from 'react-native-elements';
import {hideOptionSheet, isVisible} from '../redux/reducers/OptionSheetSlice';
import {useDispatch, useSelector} from 'react-redux';

export default function OptionSheet() {
  const dispatch = useDispatch();
  const visible = useSelector(isVisible);
  const listItemStyle = {
    borderRadius: 5,
  };
  const list = [
    {
      title: 'Report',
      titleStyle: {fontSize: 14},
      containerStyle: listItemStyle,
    },
    {
      title: 'Delete',
      titleStyle: {fontSize: 14},
      containerStyle: listItemStyle,
    },
  ];
  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={() => dispatch(hideOptionSheet())}
      overlayStyle={{
        position: 'absolute',
        bottom: 0,
        width: '97%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
      backdropStyle={{
        backgroundColor: '#000',
        opacity: 0.2,
      }}>
      <View
        style={{
          width: '98%',
          alignSelf: 'center',
        }}>
        <View>
          {list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}
              bottomDivider={true}>
              <ListItem.Content style={{alignItems: 'center'}}>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
        <Divider
          style={{
            height: 15,
            backgroundColor: 'transparent',
          }}
        />
        <Button
          title="Cancel"
          containerStyle={{backgroundColor: '#fff', marginBottom: 15}}
          titleStyle={{fontSize: 14, color: '#EC5152'}}
          onPress={() => dispatch(hideOptionSheet())}
        />
      </View>
    </Overlay>
  );
}
