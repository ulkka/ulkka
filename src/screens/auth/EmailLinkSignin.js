import React, {useState, useRef} from 'react';
import {Button, View} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import {sendEmailSignInLink} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';

const EmailLinkSignIn = () => {
  const dispatch = useDispatch();
  const emailFieldRef = useRef(null);
  const renderErrorMessage = false;
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  return (
    <View>
      <Input
        ref={emailFieldRef}
        placeholder="Email"
        containerStyle={{width: 300}}
        inputContainerStyle={{borderBottomColor: '#ddd'}}
        inputStyle={{fontSize: 14, marginLeft: 10}}
        leftIcon={<Icon name="mail" size={20} color="green" />}
        errorStyle={{color: 'red'}}
        errorMessage={emailErrorMessage}
        renderErrorMessage={renderErrorMessage}
        onFocus={() => {
          setEmailErrorMessage('');
        }}
        onChangeText={(text) => {
          setEmail(text);
        }}
        value={email}
      />
      <Button
        title="Send Login Link"
        onPress={() => {
          emailFieldRef.current.blur();
          dispatch(sendEmailSignInLink(email)).then((res) => {
            if (res?.error) {
              setEmailErrorMessage(res.error.message);
            }
          });
        }}
      />
    </View>
  );
};

export default EmailLinkSignIn;
