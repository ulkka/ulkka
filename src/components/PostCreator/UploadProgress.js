import React from 'react';
import {View, Text, Image} from 'react-native';
import {Overlay, useTheme} from 'react-native-elements';
import {Button} from 'react-native';

export const uploadProgress = _setUploadProgress => progressEvent => {
  const percentFraction = progressEvent.loaded / progressEvent.total;
  _setUploadProgress(parseInt(percentFraction * 100));
};

export const ShowSubmitProgress = props => {
  const {theme} = useTheme();

  const {percent, isVisible, onCancel, showUploadProgress} = props;

  return (
    <Overlay
      statusBarTranslucent={true}
      isVisible={isVisible}
      animationType="none"
      fullScreen
      overlayStyle={{
        backgroundColor: theme.colors.grey2,
        opacity: 0.8,
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: showUploadProgress ? 'flex-end' : 'center',
            marginBottom: 75,
          }}>
          <Image
            source={require('../../../assets/loading.gif')}
            style={{height: 40, width: 40}}
          />
        </View>
        {showUploadProgress ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
                width: '100%',
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.colors.black3,
                }}>
                {percent != 100
                  ? percent + ' %   Uploaded  '
                  : ' Processing...'}
              </Text>
            </View>
            <View
              style={{
                bottom: 20,
              }}>
              <Button
                title="Cancel Upload"
                onPress={onCancel}
                color={theme.colors.blue}
              />
            </View>
          </View>
        ) : null}
      </View>
    </Overlay>
  );
};
