import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Icon, Input, SocialIcon} from 'react-native-elements';
// import auth from '@react-native-firebase/auth';
// import Snackbar from 'react-native-snackbar';
import mainClient from '../../client/mainClient';

export default function CreateAccount() {
  const renderErrorMessage = false;
  var authFlag = true;

  const emailErrorMessage = 'Invalid Email';
  const passwordErrorMessage = 'Min 6 characters';
  const confirmPasswordErrorMessage = "Passwords doesn't match";
  const [displayNameErrorMessage, setDisplayNameErrorMessage] = useState('');

  const [secure, setSecure] = useState(true);

  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(null);

  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(null);

  const [displayName, setDisplayName] = useState('');
  const [isDisplayNameValid, setIsDisplayNameValid] = useState(null);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      isDisplayNameValid
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    isEmailValid,
    isPasswordValid,
    isConfirmPasswordValid,
    isDisplayNameValid,
  ]);

  // useEffect(() => {
  //   if (confirmPassword == password && isPasswordValid) {
  //     setIsConfirmPasswordValid(true);
  //   } else if (password == '' || isConfirmPasswordValid == null) {
  //     setIsConfirmPasswordValid(null);
  //   } else {
  //     setIsConfirmPasswordValid(false);
  //   }
  // }, [password]);

  useEffect(() => {
    //  const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber; // unsubscribe on unmount
  }, []);

  async function onAuthStateChanged(user) {
    if (authFlag) {
      authFlag = false;
      if (user) {
        // await auth()
        //   .currentUser.getIdToken(false)
        //   .then((id_token) => {
        //     props.addAuth(user, id_token);
        //     console.log('in user', user);
        //   })
        //   .catch((e) => {
        //     console.log(e);
        //   });
      } else {
        console.log('null user');
      }
    }
    authFlag = true;
  }

  const validateEmail = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      setIsEmailValid(false);
      return false;
    } else {
      console.log('Email is Correct');
      setIsEmailValid(true);
      return true;
    }
  };

  const validatePassword = (text) => {
    console.log(text);
    if (text.length < 6) {
      console.log('Password is Not Correct');
      setIsPasswordValid(false);
      return false;
    } else {
      console.log('Password is Correct');
      setIsPasswordValid(true);
      return true;
    }
  };

  const validateConfirmPassword = (text) => {
    console.log(text);
    if (text != password) {
      console.log('Confirm Password is Not Correct');
      setIsConfirmPasswordValid(false);
      return false;
    } else {
      console.log('Confirm Password is Correct');
      setIsConfirmPasswordValid(true);
      return true;
    }
  };

  const validateDisplayName = (text) => {
    console.log(text);
    if (text.length < 6) {
      console.log('Display Name is Not Correct');
      setIsDisplayNameValid(false);
      setDisplayNameErrorMessage('Invalid Display Name (Min 6 characters)');
      return false;
    } else {
      console.log('Display Name is Correct (Min 6 Characters)');
      mainClient
        .get('/user?query={"name":"' + text + '"}')
        .then((res) => {
          console.log(res.data, res.data.length);
          if (res.data.length == 0) {
            setIsDisplayNameValid(true);
          } else {
            setIsDisplayNameValid(false);
            setDisplayNameErrorMessage('Display name already in use');
          }
        })
        .catch((e) => {
          console.log(e);
        });
      setIsDisplayNameValid(true);
      return true;
    }
  };

  const setField = (field, text) => {
    switch (field) {
      case 'email':
        validateEmail(text);
        setEmail(text);
        return;

      case 'password':
        validatePassword(text);
        setPassword(text);
        return;

      case 'confirmPassword':
        validateConfirmPassword(text);
        setConfirmPassword(text);
        return;

      case 'displayName':
        validateDisplayName(text);
        setDisplayName(text);
        return;
    }
  };

  const createAccount = async () => {
    // auth()
    //   .createUserWithEmailAndPassword(email, password)
    //   .then(async (user) => {
    //     console.log('User account created & signed in!', user);
    //     /*  auth().currentUser.sendEmailVerification({
    //                 handleCodeInApp: true
    //             });*/
    //     var token = await auth().currentUser.getIdToken(false);
    //     var data = JSON.stringify({
    //       token: token,
    //     });
    //     mainClient
    //       .post('user/signup', {
    //         data: data,
    //       })
    //       .then((res) => {
    //         console.log('create account se -- ', res.data);
    //       });
    //   })
    //   .catch((error) => {
    //     if (error.code === 'auth/email-already-in-use') {
    //       console.log('That email address is already in use!');
    //       Snackbar.show({
    //         text: 'Email address is already in use!',
    //         duration: Snackbar.LENGTH_LONG,
    //         action: {
    //           text: 'CHANGE',
    //           textColor: 'green',
    //           onPress: () => {
    //             Snackbar.dismiss();
    //           },
    //         },
    //       });
    //     }
    //     if (error.code === 'auth/invalid-email') {
    //       console.log('That email address is invalid!');
    //     }
    //     console.error(error);
    //   });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        scrollEnabled={true}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'space-evenly',
          backgroundColor: '#fff',
        }}>
        <View
          style={{
            height: (Dimensions.get('screen').height * 30) / 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              width: 280,
              color: '#444',
              fontSize: 18,
            }}>
            Welcome to Ulkka
          </Text>
        </View>
        <View
          style={{
            height: (Dimensions.get('screen').height * 40) / 100,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            borderColor: '#111',
            borderRadius: 10,
          }}>
          <KeyboardAvoidingView behavior="padding">
            <Input
              placeholder="Email"
              containerStyle={{width: 300}}
              inputContainerStyle={{borderBottomColor: '#ddd'}}
              inputStyle={{fontSize: 14}}
              leftIcon={
                <Icon
                  name="mail"
                  size={20}
                  color={isEmailValid ? 'green' : '#555'}
                />
              }
              rightIcon={
                isEmailValid == null ? null : isEmailValid ? (
                  <Icon name="check-circle" size={20} color="green" />
                ) : (
                  <Icon name="warning" size={20} color="red" />
                )
              }
              errorStyle={{color: 'red'}}
              errorMessage={
                isEmailValid == null
                  ? null
                  : isEmailValid
                  ? null
                  : emailErrorMessage
              }
              renderErrorMessage={renderErrorMessage}
              onChangeText={(text) => {
                setField('email', text);
              }}
              value={email}
            />
            <Input
              placeholder="Password"
              containerStyle={{width: 300}}
              inputContainerStyle={{borderBottomColor: '#ddd'}}
              inputStyle={{fontSize: 14}}
              leftIcon={
                <Icon
                  name="key"
                  size={20}
                  color={isPasswordValid ? 'green' : '#555'}
                  type="font-awesome-5"
                />
              }
              rightIcon={
                <Icon
                  name={secure ? 'eye' : 'eye-slash'}
                  color={
                    isPasswordValid == null
                      ? '#555'
                      : isPasswordValid
                      ? 'green'
                      : 'red'
                  }
                  size={18}
                  type="font-awesome-5"
                  onPress={() => setSecure(!secure)}
                />
              }
              errorStyle={{color: 'red'}}
              errorMessage={
                isPasswordValid == null
                  ? null
                  : isPasswordValid
                  ? null
                  : passwordErrorMessage
              }
              renderErrorMessage={renderErrorMessage}
              onChangeText={(text) => {
                setField('password', text);
              }}
              value={password}
              secureTextEntry={secure}
            />
            <Input
              placeholder="Confirm Password"
              disabled={!isPasswordValid}
              leftIcon={
                <Icon
                  name="key"
                  size={20}
                  color={isConfirmPasswordValid ? 'green' : '#555'}
                  type="font-awesome-5"
                />
              }
              containerStyle={{width: 300}}
              inputContainerStyle={{borderBottomColor: '#ddd'}}
              inputStyle={{fontSize: 14}}
              rightIcon={
                isConfirmPasswordValid ==
                null ? null : isConfirmPasswordValid ? (
                  <Icon name="check-circle" size={20} color="green" />
                ) : (
                  <Icon name="warning" size={20} color="red" />
                )
              }
              errorStyle={{color: 'red'}}
              errorMessage={
                isConfirmPasswordValid == null
                  ? null
                  : isConfirmPasswordValid
                  ? null
                  : confirmPasswordErrorMessage
              }
              renderErrorMessage={renderErrorMessage}
              onChangeText={(text) => {
                setField('confirmPassword', text);
              }}
              value={confirmPassword}
              secureTextEntry={secure}
            />
            <Input
              placeholder="Display Name"
              containerStyle={{width: 300}}
              inputContainerStyle={{borderBottomColor: '#ddd'}}
              inputStyle={{fontSize: 14}}
              leftIcon={
                <Icon
                  name="user-alt"
                  size={20}
                  color={isDisplayNameValid ? 'green' : '#555'}
                  type="font-awesome-5"
                />
              }
              rightIcon={
                isDisplayNameValid == null ? null : isDisplayNameValid ? (
                  <Icon name="check-circle" size={20} color="green" />
                ) : (
                  <Icon name="warning" size={20} color="red" />
                )
              }
              errorStyle={{color: 'red'}}
              errorMessage={
                isDisplayNameValid == null
                  ? null
                  : isDisplayNameValid
                  ? null
                  : displayNameErrorMessage
              }
              renderErrorMessage={renderErrorMessage}
              onChangeText={(text) => {
                setField('displayName', text);
              }}
              value={displayName}
            />
          </KeyboardAvoidingView>
          <View style={{width: '60%', padding: 20}}>
            <TouchableOpacity
              disabled={false}
              onPress={() => createAccount()}
              style={{
                backgroundColor: isFormValid ? 'green' : '#d3d3d3',
                borderRadius: 20,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
              <Text
                style={{
                  color: isFormValid ? 'white' : '#555',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            height: (Dimensions.get('screen').height * 30) / 100,
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            padding: 20,
          }}>
          <SocialIcon
            title="Sign Up With Google"
            button
            type="google"
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log('Signed in with Google!'),
              )
            }
            iconSize={20}
            style={{
              width: '80%',
              height: 45,
            }}
          />
          <SocialIcon
            title="Sign Up With Facebook"
            button
            type="facebook"
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log('Signed in with Google!'),
              )
            }
            iconSize={20}
            style={{
              width: '80%',
              height: 45,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
