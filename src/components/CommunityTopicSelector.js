import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import {Button, Icon, Divider} from 'react-native-elements';

const TopicField = (props) => {
  const {onPress, topic} = props;

  return (
    <View
      style={
        {
          //flex: 1, borderWidth: 1
        }
      }>
      <TouchableOpacity
        onPress={onPress}
        style={{
          height: 50,
          width: '95%',
          alignSelf: 'center',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Text
            style={{
              color: '#555',
              fontSize: 18,
              fontWeight: 'bold',
              ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
            }}>
            {!topic ? 'Select Topic' : topic}
          </Text>
          <Icon
            name="angle-down"
            size={18}
            color="#333"
            type="font-awesome-5"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function CommunityTopicSelector(props) {
  const {topic, setTopic} = props;
  const [visible, setVisible] = useState(false);
  //const [items, setItems] = useState([]);
  const items = [
    'Funny',
    'News',
    'Movies',
    'Politics',
    'Travel',
    'Careers',
    'Automobile',
  ];
  const toggleModal = () => {
    setVisible(!visible);
  };

  const setCommunityTopic = (topic) => {
    setVisible(false);
    setTopic(topic);
  };

  function _renderItem() {
    return ({item}) => {
      return (
        <TouchableOpacity
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          style={{}}
          onPress={() => setCommunityTopic(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: '#222',
              }}>
              {item}
            </Text>
            <Icon
              name="arrow-right"
              type="font-awesome-5"
              color="#333"
              size={12}
              style={{padding: 5}}
            />
          </View>
        </TouchableOpacity>
      );
    };
  }

  const _itemSeperatorComponent = () => {
    return (
      <View
        style={{
          height: 30,
          justifyContent: 'center',
        }}>
        <Divider
          style={{
            backgroundColor: '#ddd',
          }}
        />
      </View>
    );
  };
  const ListHeaderComponent = (
    <View style={{alignSelf: 'center', paddingBottom: 40}}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
        }}>
        Select a topic
      </Text>
    </View>
  );
  const ResultsView = (
    <View
      style={{
        height: '80%',
        width: '100%',
      }}>
      <FlatList
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        data={items}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={_itemSeperatorComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{
          opacity: 0.8,
          padding: 10,
        }}
        renderItem={_renderItem()}
      />
    </View>
  );

  const CloseButtonView = (
    <View style={{marginBottom: 20}}>
      <Button
        title="Close"
        color="red"
        titleStyle={{
          color: 'green',
        }}
        onPress={() => {
          toggleModal();
        }}
      />
    </View>
  );

  return (
    <View style={{}}>
      {visible ? (
        <Modal
          statusBarTranslucent={true}
          transparent={true}
          animationType="slide"
          visible={visible}>
          <View
            style={{
              margin: 45,
              height: '90%',
              backgroundColor: 'white',
              borderRadius: 25,
              padding: 30,
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOffset: {
                width: 2,
                height: 2,
              },
              shadowOpacity: 0.5,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            {ResultsView}
            {CloseButtonView}
          </View>
        </Modal>
      ) : (
        <TopicField onPress={() => setVisible(true)} topic={topic} />
      )}
    </View>
  );
}
