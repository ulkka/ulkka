import React, {useState} from 'react';
import {View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateCommunityFields,
  getCommunityField,
} from '../../redux/reducers/CommunitySlice';
import {goBack} from '../../navigation/Ref';

export default function UpdateCommunityField(props) {
  const dispatch = useDispatch();

  const {communityId, field} = props.route.params;

  const communityField = useSelector((state) =>
    getCommunityField(state, communityId, field),
  );
  const [value, setValue] = useState(communityField);

  const submit = () => {
    dispatch(updateCommunityFields({communityId, field: field, value: value}));
    goBack();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'space-between',
      }}>
      <Input
        placeholder={'Add community ' + field}
        containerStyle={{
          flex: 1,
          backgroundColor: '#eee',
          borderRadius: 8,
          marginBottom: 20,
        }}
        inputContainerStyle={{
          borderBottomWidth: 0,
          marginTop: 10,
        }}
        inputStyle={{
          fontSize: 13,
          color: '#333',
        }}
        value={value}
        onChangeText={(text) => setValue(text)}
        multiline={true}
        renderErrorMessage={false}
        maxLength={1000}
      />
      <Button
        raised
        title="Submit"
        containerStyle={{width: 100, alignSelf: 'flex-end'}}
        buttonStyle={{
          backgroundColor: '#2a9df4',
          borderRadius: 15,
          paddingHorizontal: 20,
        }}
        titleStyle={{color: '#fff', fontSize: 14}}
        onPress={submit}
      />
    </View>
  );
}
