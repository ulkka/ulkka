import React, {useState, useRef} from 'react';
import {Button, Text, View, KeyboardAvoidingView, Platform} from 'react-native';
import {registerUser} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import {Icon, Input} from 'react-native-elements';
import ChangeAccount from './ChangeAcount';
import userApi from '../../services/UserApi';

const RegisterAccount = () => {
  const dispatch = useDispatch();
  const displaynameField = useRef(null);
  const renderErrorMessage = true;
  const [displayname, setDisplayname] = useState('');
  const [displaynameErrorMessage, setDisplaynameErrorMessage] = useState('');
  const [isDisplaynameValid, setIsDisplaynameValid] = useState(null);

  const validateDisplayName = async (text) => {
    if (
      text.length < 6 ||
      !/^([a-zA-Z0-9\u0D00-\u0D7F_.-]+)$/.test(text) || // reg exp to check characters are english or malayalam alphabets, numbers or _.-
      text.length > 25
    ) {
      setIsDisplaynameValid(false);
      setDisplaynameErrorMessage(
        'Invalid Display Name \nMin 6 characters, Max 25 characters \nEnglish / Malayalam alphabets, numbers or _.- ',
      );
      return false;
    } else {
      const response = await userApi.user.displaynameExists(text);
      if (response.data.length == 0) {
        console.log('displayname response', response);
        setIsDisplaynameValid(true);
        return true;
      } else {
        console.log('displayname already exists response', response);
        setIsDisplaynameValid(false);
        setDisplaynameErrorMessage('Display name already in use');
        return false;
      }
    }
  };

  const register = () => {
    dispatch(registerUser(displayname));
  };

  const DisplayNameField = (
    <Input
      ref={displaynameField}
      placeholder="Display Name"
      containerStyle={{width: 300}}
      inputContainerStyle={{borderBottomColor: '#ddd'}}
      inputStyle={{fontSize: 14, padding: 10}}
      leftIcon={
        <Icon
          name="user-alt"
          size={20}
          color={isDisplaynameValid ? 'green' : '#555'}
          type="font-awesome-5"
        />
      }
      rightIcon={
        isDisplaynameValid == null ? null : isDisplaynameValid ? (
          <Icon name="check-circle" size={20} color="green" />
        ) : (
          <Icon name="warning" size={20} color="red" />
        )
      }
      errorStyle={{color: 'red'}}
      errorMessage={
        isDisplaynameValid == null
          ? null
          : isDisplaynameValid
          ? null
          : displaynameErrorMessage
      }
      onFocus={() => {
        setIsDisplaynameValid(null);
        setDisplaynameErrorMessage('');
      }}
      renderErrorMessage={renderErrorMessage}
      onChangeText={(text) => {
        setDisplayname(text);
      }}
      value={displayname}
    />
  );
  const Title = (
    <View
      style={{
        marginBottom: 20,
      }}>
      <Text
        style={{
          fontSize: 18,
          color: '#444',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Please enter a display name to finish registration
      </Text>
    </View>
  );
  const Register = (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
      }}>
      <View>{DisplayNameField}</View>
      <View>
        <Button
          title="Register"
          onPress={async () => {
            displaynameField.current.blur();
            const isValid = await validateDisplayName(displayname);
            isValid ? register() : console.log('its not valid');
          }}
        />
      </View>
    </View>
  );
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={75}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#fff',
      }}>
      <View style={{flex: 3, justifyContent: 'center'}}>{Title}</View>
      <View style={{flex: 1}}>
        <ChangeAccount />
      </View>
      <View style={{flex: 2}}>{Register}</View>
    </KeyboardAvoidingView>
  );
};

export default RegisterAccount;
