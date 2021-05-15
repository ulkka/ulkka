import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Button, CheckBox} from 'react-native-elements';
import {registerUser} from '../../redux/actions/AuthActions';
import {useDispatch} from 'react-redux';
import {Icon, Input} from 'react-native-elements';
import ChangeAccount from './ChangeAcount';
import userApi from '../../services/UserApi';
import {transformText} from '../../components/PostCreator/helpers';
import Hyperlink from 'react-native-hyperlink';
import {navigateToURL} from '../../components/helpers';
import Snackbar from 'react-native-snackbar';

const RegisterAccount = () => {
  const dispatch = useDispatch();
  const displaynameField = useRef(null);
  const renderErrorMessage = true;
  const [displayname, setDisplayname] = useState('');
  const [displaynameErrorMessage, setDisplaynameErrorMessage] = useState('');
  const [isDisplaynameValid, setIsDisplaynameValid] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (Platform.OS == 'android') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        keyboardDidShow,
      );
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        keyboardDidHide,
      );
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, []);

  const keyboardDidShow = () => setShowTitle(false);
  const keyboardDidHide = () => setShowTitle(true);

  const validateDisplayName = async (text) => {
    if (
      text.length < 4 ||
      !/^([a-zA-Z0-9\u0D00-\u0D7F_.-]+)$/.test(text) || // reg exp to check characters are english or malayalam alphabets, numbers or _.-
      text.length > 25
    ) {
      setIsDisplaynameValid(false);
      setDisplaynameErrorMessage(
        'Invalid Display Name \nMin 4 characters, Max 25 characters \nEnglish / Malayalam alphabets, numbers or _.- ',
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
        setDisplaynameErrorMessage(
          'Display name already in use. Please enter another one',
        );
        return false;
      }
    }
  };

  const register = () => {
    dispatch(registerUser(displayname));
  };

  const DisplayNameField = (
    <Input
      label="Display Name"
      labelStyle={{color: '#444', marginBottom: 5}}
      ref={displaynameField}
      placeholder="Nickname / വട്ടപ്പേര്"
      placeholderTextColor="#666"
      autoCapitalize="none"
      autoCorrect={false}
      containerStyle={{width: 320}}
      inputContainerStyle={{
        borderBottomColor: '#ddd',
        backgroundColor: 'rgba(52, 52, 52, 0.2)',
        borderRadius: 5,
        paddingHorizontal: 10,
      }}
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
        setDisplayname(transformText(text, 1));
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
          lineHeight: 27,
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        {'  '}
        Please enter a display name to join {' \n'}Ulkka{'  '}
      </Text>
    </View>
  );
  const Register = (
    <View
      style={{
        justifyContent: 'space-evenly',
      }}>
      <View>{DisplayNameField}</View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingBottom: 10,
        }}>
        <CheckBox
          checked={checked}
          onPress={() => setChecked(!checked)}
          checkedColor="#02862ad6"
          size={18}
          containerStyle={{
            paddingHorizontal: 0,
          }}
        />
        <Hyperlink
          linkDefault={false}
          linkStyle={{color: '#2980b9'}}
          linkText={(url) =>
            url == 'https://ulkka.in/terms.html'
              ? 'Terms and Conditions'
              : 'Privacy Policy'
          }
          onPress={(url, text) => navigateToURL(url, 'register_account')}>
          <Text style={{color: '#000', fontSize: 10}}>
            I have read and agree to the https://ulkka.in/terms.html{'\n'}and
            https://ulkka.in/privacy-policy.html
          </Text>
        </Hyperlink>
      </View>
      <View>
        <Button
          raised
          type="solid"
          activeOpacity={0.5}
          disabledTitleStyle={{color: '#777', fontWeight: '400'}}
          titleStyle={{
            color: '#0099ff',
            fontWeight: '500',
          }}
          containerStyle={{
            alignItems: 'center',
            width: 180,
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
          title="Create Account"
          onPress={async () => {
            displaynameField.current.blur();
            const isDisplayNameValid = await validateDisplayName(displayname);
            isDisplayNameValid &&
              !checked &&
              Snackbar.show({
                text:
                  'Please agree to the Terms & Conditions and Privacy Policy',
                duration: Snackbar.LENGTH_SHORT,
              });
            isDisplayNameValid && checked
              ? register()
              : console.log('its not valid');
          }}
        />
      </View>
    </View>
  );
  return (
    <ImageBackground
      blurRadius={0.5}
      resizeMode="repeat"
      style={{
        // flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 50,
        alignItems: 'center',
        // justifyContent: 'center',
      }}
      source={require('../../../assets/doodlebg.jpg')}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 150 : 60}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            // flex: showTitle ? 3 : 0,
            justifyContent: 'center',
          }}>
          {Title}
        </View>
        <View
          style={
            {
              //flex: 1
            }
          }>
          {showTitle && <ChangeAccount />}
        </View>
        <View
          style={
            {
              // flex: showTitle ? 2 : 4
            }
          }>
          {Register}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default RegisterAccount;
