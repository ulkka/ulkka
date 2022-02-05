import React from 'react';
import {View, Text, Image, StatusBar, Platform} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {Icon, useTheme} from 'react-native-elements';
import {storeData} from '../localStorage/helpers';

const slides = [
  {
    key: 1,
    title: 'Selamat datang di\nOmong !',
    image: require('../../assets/ulkka_transparent_512x512.png'),
  },
  {
    key: 2,
    title: 'Yuk cari komunitasmu !',
    image: require('../../assets/welcome.jpg'),
    points: [
      'Omong adalah tempat dimana kamu dapat membagikan apapun yang menurutmu menarik di internet dengan komunitas yang juga memiliki ketertarikan sama denganmu',
      'Kamu dapat membagikan hal - hal seperti gambar, tautan, video atau tulisan kepada komunitas yang ada (Dapat kamu cari) atau juga bisa membuat komunitas baru untukmu dan orang - orang',
    ],
  },
  {
    key: 3,
    title: 'Dapatkan Like!',
    icon: 'heart',
    points: [
      'Kamu akan mendapatkan logo hati ketika post dan komentar kamu di upvote oleh komunitas',
      'Hati menggambarkan reputasi kamu di Omong. Kamu dapat mengakses fitur - fitur spesial ketika kamu mendapatkan lebih banyak hati/like',
      'Hati juga dapat digunakan untuk menunjuk admin baru ke dalam komunitas',
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
          Lanjut
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
          Kembali
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
