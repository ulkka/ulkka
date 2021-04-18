import React, {useState, useRef} from 'react';
import {View, Platform} from 'react-native';
import {Button} from 'react-native-elements';
import {Input, Icon} from 'react-native-elements';
import {sendEmailSignInLink} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import {transformText} from '../../components/PostCreator/helpers';

const EmailLinkSignIn = () => {
  const dispatch = useDispatch();
  const emailFieldRef = useRef(null);
  const renderErrorMessage = false;
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  return (
    <View>
      <Input
        ref={emailFieldRef}
        placeholder="Email"
        keyboardType="email-address"
        autoCompleteType="email"
        containerStyle={{width: 300}}
        inputContainerStyle={{
          borderBottomColor: 'transparent',
        }}
        inputStyle={{fontSize: 14, marginLeft: 10}}
        leftIcon={
          <Icon
            name="mail"
            size={20}
            color={disabled ? '#ff9999' : '#02862ad6'}
          />
        }
        errorStyle={{color: 'red'}}
        errorMessage={emailErrorMessage}
        renderErrorMessage={renderErrorMessage}
        onFocus={() => {
          !email.length && setDisabled(true);
          setEmailErrorMessage('');
        }}
        onChangeText={(text) => {
          setDisabled(!validateEmail(text));
          setEmail(transformText(text, 1));
        }}
        value={email}
      />
      <Button
        title="Send Login Link"
        raised
        type="solid"
        activeOpacity={0.5}
        disabledTitleStyle={{color: '#777', fontWeight: '400'}}
        titleStyle={{
          color: '#0099ff',
          fontWeight: '500',
        }}
        disabledStyle={{
          alignItems: 'center',
          width: 265,
          alignSelf: 'center',
          borderRadius: 25,
          backgroundColor: '#eee',
        }}
        containerStyle={{
          alignItems: 'center',
          width: 265,
          alignSelf: 'center',
          borderRadius: 25,
        }}
        style={{
          width: '80%',
        }}
        buttonStyle={{
          alignItems: 'center',
          borderColor: '#222',
        }}
        disabled={disabled}
        onPress={() => {
          emailFieldRef.current.blur();
          if (email.length) {
            dispatch(sendEmailSignInLink(email)).then((res) => {
              if (res?.error) {
                setEmailErrorMessage(res?.payload);
              }
            });
          } else {
            setEmailErrorMessage('Please enter a valid email');
          }
        }}
      />
    </View>
  );
};

export default EmailLinkSignIn;
