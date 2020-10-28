import React, {useContext} from 'react';
import {View, Image, TouchableOpacity, TouchableHighlight} from 'react-native';
import {ThemeContext, Icon, Text} from 'react-native-elements';

export default function Post(props) {
  const {theme} = useContext(ThemeContext);

  return (
    <View
      style={{
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: theme.colors.background,
        width: '100%',
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="account-circle"
            color="#333"
            size={32}
            style={{padding: 5}}
          />
          <View style={{padding: 5}}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Community', {
                  community_id: props.item.community._id,
                })
              }>
              <Text style={{fontSize: 13, fontWeight: 'bold', color: '#432'}}>
                {props.item.community.name}
              </Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Account')}>
                <Text style={{fontSize: 11, paddingRight: 10, color: '#555'}}>
                  By - {props.item.author.name}
                </Text>
              </TouchableOpacity>
              <Text style={{fontSize: 11, color: '#555'}}>3h</Text>
            </View>
          </View>
        </View>
        <View style={{padding: 5}}>
          <Icon name="more-vert" size={18} color="#888" />
        </View>
      </View>
      <View>
        <Text
          style={{
            fontSize: 15,
            padding: 10,
            fontWeight: 'bold',
            color: '#555',
          }}>
          Title - {props.item.title}
        </Text>
      </View>
      <TouchableHighlight
        activeOpacity={0.9}
        underlayColor="#fff"
        onPress={() =>
          props.navigation.navigate('PostDetail', {
            post: props.item,
          })
        }>
        <Image
          style={{
            width: '99%',
            height: 270,
            resizeMode: 'cover',
            alignSelf: 'center',
          }}
          source={{
            uri:
              'https://i.guim.co.uk/img/media/d143e03bccd1150ef52b8b6abd7f3e46885ea1b3/0_182_5472_3283/master/5472.jpg?width=1020&quality=85&auto=format&fit=max&s=5381baed444132de5bbf0830b0d990c7',
          }}
        />
      </TouchableHighlight>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: '#eee',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 3,
            paddingLeft: 10,
            alignItems: 'center',
          }}>
          <Icon
            name="arrow-up-bold"
            type="material-community"
            size={20}
            color="#888"
          />
          <Text style={{fontWeight: 'bold', color: '#888'}}>-50</Text>
          <Icon
            name="arrow-down-bold"
            type="material-community"
            size={20}
            color="#888"
          />
        </View>
        <View
          style={{
            flex: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name="comment"
            type="material-community"
            color="#000"
            size={18}
            color="#888"
          />
          <Text style={{fontWeight: 'bold', color: '#888', paddingLeft: 15}}>
            50
          </Text>
        </View>
        <TouchableOpacity style={{flex: 3, flexDirection: 'row'}}>
          <Icon name="share" type="font-awesome" size={18} color="#888" />
          <Text
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              paddingLeft: 12,
              color: '#777',
            }}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
