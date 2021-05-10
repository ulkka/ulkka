import React, {useEffect, useState} from 'react';
import {View, Text, Platform} from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';
import {Button, Icon} from 'react-native-elements';
import {navigateToURL} from '../components/helpers';

const AppMaintenanceHandler = (props) => {
  const {handle, maintenance} = props;
  const [updateRequired, setUpdateRequired] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    remoteConfig()
      .setDefaults({
        mandatory_update: false,
        maintenance_mode: false,
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then((fetchedRemotely) => {
        if (fetchedRemotely) {
          console.log('Configs were retrieved from the backend and activated.');
          setUpdateRequired(
            remoteConfig().getValue('mandatory_update').asBoolean(),
          );
          setMaintenanceMode(
            remoteConfig().getValue('maintenance_mode').asBoolean(),
          );
        } else {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated',
          );
        }
      })
      .catch((error) =>
        console.log(
          'error fetching and activating from remote config in AppMaintenanceHandler',
          error,
        ),
      )
      .catch((error) =>
        console.log(
          'error setting remote config defaults in AppMaintenanceHandler',
          error,
        ),
      );
  }, []);

  useEffect(() => {
    handle(updateRequired || maintenanceMode);
  }, [updateRequired, maintenanceMode]);

  const storeName = Platform.OS == 'ios' ? 'App Store' : 'Play Store';

  const updateRequiredText =
    'We have made some breaking changes that makes this current version of app installed on your device to be dysfunctional. We deeply regret the inconvenience caused and kindly request you to update the app to the latest version from the ' +
    storeName +
    ' inorder to continue using our services';

  const maintenanceText =
    'Sorry, we are currently in maintenance mode. Please try again after sometime.';

  return maintenance ? (
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
        {updateRequired ? updateRequiredText : maintenanceText}
      </Text>
      {updateRequired && (
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
          onPress={() => {
            Platform.OS == 'ios' &&
              navigateToURL(
                'https://apps.apple.com/in/app/ulkka/id1563474580',
                'app_update',
              );
            Platform.OS == 'android' &&
              navigateToURL(
                'https://play.google.com/store/apps/details?id=in.ulkka',
                'app_update',
              );
          }}
        />
      )}
    </View>
  ) : (
    <View></View>
  );
};

export default AppMaintenanceHandler;
