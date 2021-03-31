import React, {useEffect} from 'react';
import {View, Text, Platform} from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';
import {Button, Icon} from 'react-native-elements';

const AppUpdateHandler = (props) => {
  const {handle, shouldUpdate} = props;
  useEffect(() => {
    remoteConfig()
      .setDefaults({
        mandatory_update: false,
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then((fetchedRemotely) => {
        if (fetchedRemotely) {
          console.log('Configs were retrieved from the backend and activated.');
          const shouldUpdate = remoteConfig()
            .getValue('mandatory_update')
            .asBoolean();
          handle(shouldUpdate);
        } else {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated',
          );
        }
      })
      .catch((error) =>
        console.log(
          'error fetching and activating from remote config in appupdatehandler',
          error,
        ),
      )
      .catch((error) =>
        console.log(
          'error setting remote config defaults in appupdatehandler',
          error,
        ),
      );
  }, []);

  return shouldUpdate ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 20,
      }}>
      <Icon
        name="tools"
        type="font-awesome-5"
        size={50}
        color="#ff6565"
        raised
      />
      <Text
        style={{
          fontSize: 18,
          color: '#444',
          textAlign: 'justify',
          lineHeight: 24,
        }}>
        We have made some breaking changes that makes this current version of
        app installed on your device to be dysfunctional. We deeply regret the
        inconvenience caused and kindly request you to update the app to the
        latest version from the{' '}
        {Platform.OS == 'ios' ? 'App Store' : 'Play Store'} inorder to continue
        using our services
      </Text>
      <Button
        raised
        title="Update App"
        containerStyle={{
          marginBottom: 15,
          borderRadius: 5,
        }}
        titleStyle={{
          fontSize: 17,
          color: '#02862ad6',
          padding: 4,
          fontWeight: '600',
        }}
        onPress={() => console.log('navigate to appstore/playstore')}
      />
    </View>
  ) : (
    <View></View>
  );
};

export default AppUpdateHandler;
