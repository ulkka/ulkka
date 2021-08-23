import React, {useState, useContext} from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {Input, Button, ThemeContext} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateCommunityFields,
  getCommunityField,
} from '../../redux/reducers/CommunitySlice';
import {goBack} from '../../navigation/Ref';

export default function UpdateCommunityField(props) {
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);

  const {communityId, field} = props.route.params;

  const communityField = useSelector(state =>
    getCommunityField(state, communityId, field),
  );
  const [value, setValue] = useState(communityField);

  const submit = () => {
    dispatch(updateCommunityFields({communityId, field: field, value: value}));
    goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS == 'android' ? 30 : 130}
      style={{
        flex: 1,
        backgroundColor: theme.colors.primary,
        padding: 20,
        justifyContent: 'space-between',
      }}>
      <Input
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
        placeholderTextColor={theme.colors.black7}
        placeholder={'Add community ' + field}
        containerStyle={{
          flex: 1,
          backgroundColor: theme.colors.grey2,
          borderRadius: 8,
          marginBottom: 20,
        }}
        inputContainerStyle={{
          borderBottomWidth: 0,
          marginTop: 10,
        }}
        inputStyle={{
          fontSize: 13,
          color: theme.colors.black3,
        }}
        value={value}
        onChangeText={text => setValue(text)}
        multiline={true}
        renderErrorMessage={false}
        maxLength={1000}
      />
      <Button
        raised
        title="Submit"
        containerStyle={{width: 100, alignSelf: 'flex-end', marginBottom: 30}}
        buttonStyle={{
          backgroundColor: theme.colors.blue,
          borderRadius: 15,
          paddingHorizontal: 20,
        }}
        titleStyle={{color: theme.colors.primary, fontSize: 14}}
        onPress={submit}
      />
    </KeyboardAvoidingView>
  );
}
