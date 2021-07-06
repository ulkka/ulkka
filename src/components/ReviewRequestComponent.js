import React from 'react';
import {View, Button} from 'react-native';
import Rate, {AndroidMarket} from 'react-native-rate';

export default function ReviewRequestComponent {
 
    return (
      <View>
        <Button
          title="Rate App"
          onPress={() => {
            const options = {
              AppleAppID: '1563474580',
              GooglePackageName: 'in.ulkka',
              // AmazonPackageName: 'com.mywebsite.myapp',
              // OtherAndroidURL: 'http://www.randomappstore.com/app/47172391',
              preferredAndroidMarket: AndroidMarket.Google,
              preferInApp: true,
              openAppStoreIfInAppFails: true,
              fallbackPlatformURL: 'https://ulkka.in',
            };
            Rate.rate(options, (success) => {
              if (success) {
                // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                this.setState({rated: true});
              }
            });
          }}
        />
      </View>
    );
 
}
