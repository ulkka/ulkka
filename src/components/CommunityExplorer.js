import React from 'react';
import {TouchableOpacity, View, Text, ScrollView, Platform} from 'react-native';
import {Icon, useTheme} from 'react-native-elements';
import {coolColors} from './helpers';

export default function CommunityExplorer(props) {
  const {theme} = useTheme();

  const topicObject = [
    {
      name: 'Politics',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
        {name: 'rytyffdsrt'},
        {name: 'rydsffsdyrt'},
      ],
    },
    {
      name: 'Sports',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
      ],
    },
    {
      name: 'Movies',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
      ],
    },
    {
      name: 'Music',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
      ],
    },
    {
      name: 'News',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
      ],
    },
    {
      name: 'Dance',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
      ],
    },
    {
      name: 'Entertainment',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
      ],
    },
    {
      name: 'Travel',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
      ],
    },
    {
      name: 'Automobile',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
      ],
    },
    {
      name: 'Memes',
      communities: [
        {name: 'adasdasd'},
        {name: 'fsdfdsfd'},
        {name: 'ewwrerwe'},
        {name: 'adasfhghfgfdasd'},
        {name: 'rytyrt'},
      ],
    },
  ];

  function getTopicTitle(topic) {
    return (
      <View
        key={topic.name}
        style={{
          borderTopEndRadius: 15,
          borderTopStartRadius: 15,
          paddingHorizontal: 10,
          paddingVertical: 8,
          backgroundColor: 'rgba(52, 52, 52, 0.5)',
          marginBottom: 20,
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#eee',
            fontSize: 17,
            fontWeight: 'bold',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {topic.name}
        </Text>
      </View>
    );
  }

  function getTopicCommunities(topic) {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
        {topic.communities.map(community => {
          return (
            <TouchableOpacity
              key={community.name}
              style={{
                borderRadius: 10,
                paddingHorizontal: 8,
                paddingVertical: 5,
                backgroundColor: 'rgba(25, 25, 25, 0.5)',
                marginBottom: 10,
                marginHorizontal: 5,
              }}>
              <Text style={{color: '#eee', fontSize: 15}}>
                {community.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{
        justifyContent: 'space-between',
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {topicObject.map((topic, index) => {
        const topicTitle = getTopicTitle(topic);
        const topicCommunities = getTopicCommunities(topic);
        return (
          <View
            style={{
              width: '48%',
              //  alignItems: 'center',
              borderRadius: 15,
              paddingBottom: 15,
              // paddingHorizontal: 5,
              marginBottom: 20,
              backgroundColor: coolColors[index],
              opacity: 0.9,
            }}>
            {topicTitle}
            {topicCommunities}
          </View>
        );
      })}
    </ScrollView>
  );
}
