import React, {useEffect, useState, useContext} from 'react';
import {View, Text, Image, ScrollView, Platform} from 'react-native';
import {Input, ThemeContext} from 'react-native-elements';
import utilityApi from '../../services/UtilityApi';
import {isURLValid, transformText} from './helpers';

export const LinkField = props => {
  const {theme} = useContext(ThemeContext);

  const [preview, setPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {onChangeText, link, title, changeTitle} = props;

  useEffect(() => {
    link != '' && getOgPreview(link);
  }, [link]);

  useEffect(() => {
    const ogTitle = previewData?.ogTitle;
    if (title == '' && ogTitle) {
      changeTitle(ogTitle);
    }
  }, [previewData]);

  const getOgPreview = async link => {
    setLoading(true);
    setPreview(false);
    setPreviewData(null);
    if (isURLValid(link)) {
      const response = await utilityApi.og.preview(link);
      if (!response.error) {
        if (!response.data.ogImage) {
          setPreviewData(null);
        } else {
          setPreviewData(response.data);
          setPreview(true);
        }
        setLoading(false);
      } else {
        setPreview(false);
        setPreviewData(null);
        setLoading(false);
        console.error('Preview error');
      }
    } else {
      setLoading(false);
    }
  };

  const ogTitleField = (
    <View style={{margin: 5}}>
      <Text
        style={{fontWeight: 'bold', fontSize: 13, color: theme.colors.black3}}>
        {previewData == null ? '' : previewData.ogTitle}
      </Text>
    </View>
  );

  const ogDescriptionField = (
    <View style={{marginHorizontal: 5}}>
      <Text style={{fontSize: 11, color: theme.colors.black5}}>
        {previewData == null ? '' : previewData.ogDescription}
      </Text>
    </View>
  );

  const ogImageField = (
    <View
      style={{
        paddingHorizontal: 10,
        alignItems: 'flex-start',
      }}>
      <Image
        source={{uri: previewData == null ? '' : previewData.ogImage.url}}
        style={{
          width: '100%',
          aspectRatio: 1,
          maxWidth: 180,
          resizeMode: 'contain',
        }}
      />
    </View>
  );

  const PreviewField = loading ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        opacity: 0.8,
      }}>
      <Image
        source={require('../../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
    </View>
  ) : (
    <View
      style={{
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.grey4,
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
      }}>
      <View
        style={{
          flex: 7,
          justifyContent: 'center',
          padding: 5,
        }}>
        {ogTitleField}
        {ogDescriptionField}
      </View>
      {ogImageField}
    </View>
  );

  return (
    <View
      style={{
        //  flex: 4,
        justifyContent: 'center',
        //marginTop: 20,
        marginBottom: 50,
      }}>
      <View
        style={{
          justifyContent: 'center',
          marginTop: Platform.OS == 'ios' ? 50 : 95,
        }}>
        <Input
          keyboardAppearance={theme.dark ? 'dark' : 'light'}
          placeholderTextColor={theme.colors.black7}
          style={{
            height: 'auto',
            minHeight: 50,
          }}
          inputContainerStyle={{
            borderBottomColor: theme.colors.primary,
          }}
          keyboardType="url"
          inputStyle={{textAlign: 'center'}}
          onChangeText={text => onChangeText(transformText(text, 1))}
          value={link}
          placeholder={'Add Link'}
          numberOfLines={2}
          multiline={true}
          maxLength={1000}
          blurOnSubmit={true}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          //    flex: 4,
          justifyContent: 'center',
        }}>
        {preview || loading ? PreviewField : <View></View>}
      </ScrollView>
    </View>
  );
};
