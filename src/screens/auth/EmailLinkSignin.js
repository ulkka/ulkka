import React, {useState, useRef} from 'react';
import {View} from 'react-native';
import {Button, useTheme} from 'react-native-elements';
import {Input, Icon} from 'react-native-elements';
import {sendEmailSignInLink} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import {transformText} from '../../components/PostCreator/helpers';
import {useTranslation} from 'react-i18next';

const EmailLinkSignIn = () => {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const emailFieldRef = useRef(null);
  const renderErrorMessage = false;
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  return (
    <View>
      <Input
        label="Email"
        labelStyle={{color: theme.colors.black3, marginBottom: 5}}
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
        placeholderTextColor={theme.colors.black7}
        ref={emailFieldRef}
        placeholder="example@domain.com"
        keyboardType="email-address"
        autoCompleteType="email"
        autoCapitalize="none"
        autoCorrect={false}
        containerStyle={{width: 320}}
        inputContainerStyle={{
          borderBottomColor: 'transparent',
          backgroundColor: theme.colors.transparentBlack,
          borderRadius: 5,
          paddingHorizontal: 10,
          marginBottom: 10,
        }}
        inputStyle={{fontSize: 14, marginLeft: 10}}
        leftIcon={
          <Icon
            name="mail"
            size={20}
            color={disabled ? '#ff9999' : theme.colors.green}
          />
        }
        errorStyle={{color: 'red'}}
        errorMessage={emailErrorMessage}
        renderErrorMessage={renderErrorMessage}
        onFocus={() => {
          !email.length && setDisabled(true);
          setEmailErrorMessage('');
        }}
        onChangeText={text => {
          setDisabled(!validateEmail(text));
          setEmail(transformText(text, 1));
        }}
        value={email}
      />
      <Button
        title={t('Send Login Link')}
        type="solid"
        activeOpacity={0.5}
        disabledTitleStyle={{color: theme.colors.black6, fontWeight: '400'}}
        titleStyle={{
          color: theme.colors.blue,
          fontWeight: '500',
        }}
        disabledStyle={{
          backgroundColor: theme.colors.grey2,
        }}
        containerStyle={{marginHorizontal: 25}}
        buttonStyle={{
          borderRadius: 25,
          borderWidth: 1,
          borderColor: theme.colors.grey2,
        }}
        disabled={disabled}
        onPress={() => {
          emailFieldRef.current.blur();
          if (email.length) {
            dispatch(sendEmailSignInLink(email)).then(res => {
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
