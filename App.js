import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import SplashScreen from 'react-native-splash-screen';

GoogleSignin.configure({
  scopes: ['openid', 'email', 'profile'],
  webClientId: '125095692098-jvns3h2vfqkf3ufrb0kcqhf1k2abicog.apps.googleusercontent.com',
});

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const onEmailButtonPress = async () => {
    // Get the users ID token
    // const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    // const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    var credential = auth.EmailAuthProvider.credential('arjunswarrier@gmail.com', 'kuttettan');
    return auth().signInWithCredential(credential);
    /*    user.linkWithCredential(credential)
      .then(function (usercred) {
        var user = usercred.user;
        console.log("Account linking success", user);
      }).catch(function (error) {
        console.log("Account linking error", error);
      });*/
  }

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  // Handle user state changes
  async function onAuthStateChanged(user) {
    setUser(user);
   // console.log(await auth().currentUser.getIdToken(true));
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    SplashScreen.hide();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
        <Button
          title="Google Sign-In"
          onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
        />
        <Button
          title="Email Sign-In"
          onPress={() => onEmailButtonPress().then(() => console.log('Signed in with Email!'))}
        />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Button
        title="Signout"
        onPress={() => auth().signOut().then(() => console.log('User signed out!'))}
      />
      <Button
          title="Email Sign-In"
          onPress={() => onEmailButtonPress().then(() => console.log('Signed in with Email!'))}
        />
      <Button
        title="Signout"
        onPress={() => signOut()}
      />
    </View>
  );
}
