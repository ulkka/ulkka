import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, Platform} from 'react-native';
import {Button, Overlay, useTheme} from 'react-native-elements';
import Rate, {AndroidMarket} from 'react-native-rate';
import {useSelector, useDispatch} from 'react-redux';
import {
  getIsVisible,
  loadData,
  reviewLater,
  reviewDone,
} from '../redux/reducers/ReviewRequestSlice';
import {useTranslation} from 'react-i18next';

export default function ReviewRequestComponent() {
  const dispatch = useDispatch();
  const {theme} = useTheme();
  const {t} = useTranslation();
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
      AppleAppID: '1601976921',
      GooglePackageName: 'id.omong',
      // AmazonPackageName: 'com.mywebsite.myapp',
      // OtherAndroidURL: 'http://www.randomappstore.com/app/47172391',
      preferredAndroidMarket: AndroidMarket.Google,
      fallbackPlatformURL: 'https://omong.id',
      ...(Platform.OS == 'ios' && {
        openAppStoreIfInAppFails: true,
        preferInApp: true,
      }),
    };
    Rate.rate(options, success => {
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
      isVisible={!!isVisible}
      overlayStyle={{borderRadius: 25, backgroundColor: theme.colors.grey1}}>
      <View style={{width: '80%', padding: 15, alignItems: 'center'}}>
        <View style={{padding: 10}}>
          <Text
            style={{
              color: theme.colors.black5,
              fontSize: 17,
              fontWeight: 'bold',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            Enjoying Omong?
          </Text>
        </View>
        <View style={{padding: 10}}>
          <Text
            style={{
              color: theme.colors.black4,
              textAlign: 'center',
              fontSize: 13,
            }}>
            {t('Review Request Text')}
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
              borderColor: theme.colors.grey6,
            }}>
            <Text style={{color: theme.colors.black4}}>Later</Text>
          </TouchableOpacity>
          <View style={{width: 100}}></View>
          <TouchableOpacity
            onPress={rateApp}
            style={{
              padding: 5,
              paddingHorizontal: 20,
              borderWidth: 1,
              borderRadius: 10,
              borderColor: theme.colors.blue,
            }}>
            <Text style={{fontWeight: 'bold', color: theme.colors.blue}}>
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
}
