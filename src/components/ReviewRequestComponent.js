import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Platform} from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import Rate, {AndroidMarket} from 'react-native-rate';
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsVisible,
  loadData,
  reviewLater,
  reviewDone,
} from '../redux/reducers/ReviewRequestSlice';

export default function ReviewRequestComponent() {
  const dispatch = useDispatch();
  const isVisible = useSelector(getIsVisible);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setVisible(true);
      }, 3000);
    } else {
      setVisible(false);
    }
  }, [isVisible]);

  useEffect(() => {
    dispatch(loadData());
  }, []);

  const rateApp = () => {
    const options = {
      AppleAppID: '1563474580',
      GooglePackageName: 'in.ulkka',
      // AmazonPackageName: 'com.mywebsite.myapp',
      // OtherAndroidURL: 'http://www.randomappstore.com/app/47172391',
      preferredAndroidMarket: AndroidMarket.Google,
      fallbackPlatformURL: 'https://ulkka.in',
      ...(Platform.OS == 'ios' && {
        openAppStoreIfInAppFails: true,
        preferInApp: true,
      }),
    };
    Rate.rate(options, (success) => {
      if (success) {
        // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
        dispatch(reviewDone());
      } else {
        dispatch(reviewLater());
      }
    });
  };

  return (
    <Overlay
      statusBarTranslucent={true}
      isVisible={!!visible}
      overlayStyle={{borderRadius: 25, backgroundColor: '#f5f5f5'}}>
      <View style={{width: '80%', padding: 15, alignItems: 'center'}}>
        <View style={{padding: 10}}>
          <Text
            style={{
              color: '#555',
              fontSize: 17,
              fontWeight: 'bold',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            Enjoying Ulkka?
          </Text>
        </View>
        <View style={{padding: 10}}>
          <Text style={{color: '#444', textAlign: 'center', fontSize: 13}}>
            If you are enjoying Ulkka, would you mind taking a moment to rate
            it?{'\n'}Thanks for your Support!
          </Text>
        </View>
        <View
          style={{
            paddingTop: 20,
            //borderWidth: 1,
            flexDirection: 'row',
            //flex: 1,
            //width: '100%',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => dispatch(reviewLater())}
            style={{
              padding: 5,
              paddingHorizontal: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#aaa',
            }}>
            <Text style={{color: '#444'}}>Later</Text>
          </TouchableOpacity>
          <View style={{width: 100}}></View>
          <TouchableOpacity
            onPress={rateApp}
            style={{
              padding: 5,
              paddingHorizontal: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: '#289df4',
            }}>
            <Text style={{fontWeight: 'bold', color: '#289df4'}}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
}
