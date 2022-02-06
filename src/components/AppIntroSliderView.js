import React from 'react';
import {View, Text, Image, StatusBar, Platform} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Icon, useTheme} from 'react-native-elements';
import {storeData} from '../localStorage/helpers';
import {useTranslation} from 'react-i18next';

export default function AppIntroSliderView(props) {
  const {setIntroDone} = props;
  const {theme} = useTheme();
  const {t} = useTranslation();

  const slides = [
    {
      key: 1,
      title: t('Welcome to Omong'),
      image: require('../../assets/ulkka_transparent_512x512.png'),
    },
    {
      key: 2,
      title: t("Let's find your Tribe"),
      // image: require('../../assets/welcome.jpg'),
      points: [t('Tutorial Page2 Point1'), t('Tutorial Page2 Point2')],
    },
    {
      key: 3,
      title: t('Win Hearts'),
      icon: 'heart',
      points: [
        t('Tutorial Page3 Point1'),
        t('Tutorial Page3 Point2'),
        t('Tutorial Page3 Point3'),
      ],
    },
  ];

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
          {t('Next')}
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
          {t('Back')}
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
