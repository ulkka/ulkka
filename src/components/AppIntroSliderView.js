import React from 'react';
import {View, Text, Image, StatusBar, Platform} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Icon, useTheme} from 'react-native-elements';
import {storeData} from '../localStorage/helpers';

const slides = [
  {
    key: 1,
    title: 'Welcome to\nUlkka !',
    image: require('../../assets/ulkka_transparent_512x512.png'),
  },
  {
    key: 2,
    title: "Let's find your Tribe !",
    image: require('../../assets/welcome.jpg'),
    points: [
      "Ulkka is a place where you can share anything that you find interesting on the internet with a community that's interested in the topic",
      'You can share content including images, links, videos or text posts to an existing community (check the search bar) or create a brand new community and let users find it',
    ],
  },
  {
    key: 3,
    title: 'Win Hearts',
    icon: 'heart',
    points: [
      'You receive hearts when your posts and comments are upvoted by community members',
      'Hearts represent your reputation in Ulkka and you can unlock features in Ulkka as you gain more hearts',
      'Hearts may also be used to elect new admins to communities',
    ],
  },
];

export default function AppIntroSliderView(props) {
  const {setIntroDone} = props;
  const {theme} = useTheme();

  const renderItem = ({item}) => {
    const {title, image, text, backgroundColor, icon, points} = item;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.primary,
          paddingTop: 100,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            flex: 3,

            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          {image && (
            <Image
              source={image}
              resizeMode="contain"
              style={{
                borderRadius: 10,
                height: 150,
              }}
            />
          )}
          {icon && (
            <Icon name={icon} size={125} color="red" type="font-awesome" />
          )}
          <Text
            style={{
              textAlign: 'center',
              lineHeight: 40,
              fontSize: 25,
              padding: 30,
              fontWeight: 'bold',
              color: theme.colors.black5,
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {title}
          </Text>
          {text && (
            <Text
              style={{
                fontSize: 18,
                padding: 30,
                fontWeight: 'bold',
                lineHeight: 25,
                textAlign: 'center',
                color: theme.colors.black5,
                ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
              }}>
              {text}
            </Text>
          )}
          {points && (
            <View style={{paddingBottom: 80}}>
              {points.map((point, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 25,
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}>
                    <Icon
                      name="circle"
                      type="font-awesome"
                      size={15}
                      color={theme.colors.black5}
                    />
                    <Text
                      style={{
                        paddingLeft: 15,
                        lineHeight: 20,
                        color: theme.colors.black3,
                      }}>
                      {point}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };
  const onDone = async () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    setIntroDone(true);
    await storeData('introDone', '1');
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
            color: theme.colors.green,
            fontSize: 17,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          Next
        </Text>
        <View style={{width: 15}}></View>
        <Icon
          name="arrow-right"
          color={theme.colors.green}
          type="font-awesome-5"
          size={16}
        />
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
        <Icon name="arrow-left" color="#777" type="font-awesome-5" size={16} />
        <View style={{width: 15}}></View>
        <Text
          style={{
            color: theme.colors.black6,
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
        <Icon
          name="check"
          color={theme.colors.green}
          type="font-awesome-5"
          size={16}
        />
        <View style={{width: 10}}></View>
        <Text
          style={{
            color: theme.colors.green,
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
        keyExtractor={item => item.key.toString()}
        renderItem={renderItem}
        data={slides}
        onDone={onDone}
        showPrevButton={true}
        renderNextButton={nextButton}
        renderPrevButton={prevButton}
        renderDoneButton={doneButton}
        dotStyle={{backgroundColor: theme.colors.grey6}}
        activeDotStyle={{backgroundColor: theme.colors.black2}}
      />
    </View>
  );
}
