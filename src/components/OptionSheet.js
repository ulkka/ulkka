import React from 'react';
import {View} from 'react-native';
import {ListItem, BottomSheet, Divider, Button} from 'react-native-elements';

export default function OptionSheet(props) {
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
    <BottomSheet isVisible={props.isVisible}>
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
        <Divider style={{height: 15, padding: 5}} />
        <Button
          title="Cancel"
          type="outline"
          containerStyle={{backgroundColor: '#fff'}}
          titleStyle={{fontSize: 14, color: '#EC5152'}}
          onPress={() => props.hideOptionSheet()}
        />
      </View>
    </BottomSheet>
  );
}
