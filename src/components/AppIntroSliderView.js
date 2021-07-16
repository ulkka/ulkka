import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Icon} from 'react-native-elements';

const slides = [
  {
    key: 1,
    title: 'Welcome to\nULKKA !',
    text: 'Find your Tribe',
    image: require('../../assets/welcome.jpg'),
    backgroundColor: '#febe29',
  },
  {
    key: 2,
    title: 'Find your Community',
    text: 'Other cool stuff',
    // image: require('./assets/2.jpg'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Win Hearts',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    //image: require('./assets/3.jpg'),
    backgroundColor: '#febe29',
  },
];

export default function AppIntroSliderView(props) {
  const [showRealApp, setShowRealApp] = useState(false);

  const renderItem = ({item}) => {
    const {title, image, text, backgroundColor} = item;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          paddingTop: 100,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        {image && (
          <Image
            source={image}
            style={{
              borderRadius: 20,
              //height: 200,
              width: '80%',
            }}
          />
        )}

        <View
          style={{
            flex: 3,
            //  backgroundColor: backgroundColor,
            // paddingTop: 100,
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <View>
            <Image
              source={require('../../assets/ulkka_transparent_512x512.png')}
              style={{height: 100}}
              resizeMode="contain"
            />
            <StatusBar translucent backgroundColor={'#febe29'} />
            <Text
              style={{
                textAlign: 'center',
                lineHeight: 35,
                fontSize: 23,
                padding: 30,
                fontWeight: 'bold',
                // textTransform: 'uppercase',
                color: '#222',
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              {title}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              padding: 30,
              fontWeight: 'bold',
              // textTransform: 'uppercase',
              color: '#222',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {text}
          </Text>
        </View>
      </View>
    );
  };
  const onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    setShowRealApp(true);
  };

  const nextButton = () => {
    return (
      <View
        style={{
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            color: '#222',
            fontSize: 17,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Next
        </Text>
        <View style={{width: 15}}></View>
        <Icon name="arrow-right" color="#222" type="font-awesome-5" size={16} />
      </View>
    );
  };
  const prevButton = () => {
    return (
      <View
        style={{
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <Icon name="arrow-left" color="#222" type="font-awesome-5" size={16} />
        <View style={{width: 15}}></View>
        <Text
          style={{
            color: '#222',
            fontSize: 17,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Back
        </Text>
      </View>
    );
  };
  const doneButton = () => {
    return (
      <View
        style={{
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <Icon name="check" color="#02862a" type="font-awesome-5" size={16} />
        <View style={{width: 10}}></View>
        <Text
          style={{
            color: '#02862a',
            fontSize: 17,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Done
        </Text>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      <AppIntroSlider
        keyExtractor={(item) => item.key.toString()}
        renderItem={renderItem}
        data={slides}
        onDone={onDone}
        showPrevButton={true}
        renderNextButton={nextButton}
        renderPrevButton={prevButton}
        renderDoneButton={doneButton}
      />
    </View>
  );
}
