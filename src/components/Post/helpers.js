import {Dimensions} from 'react-native';

export function scaleHeightAndWidthAccordingToDimensions(data, type, screen) {
  if (data == undefined) {
    return {height: undefined, width: undefined};
  }

  const getMediaDimensions = (data, type) => {
    if (type != 'link') {
      return data;
    } else {
      const videoUrl = data?.ogVideo?.url;
      const videoHeight = data?.ogVideo?.height;
      const videoWidth = data?.ogVideo?.width;

      const imageUrl = data?.ogImage?.url;
      const imageHeight = data?.ogImage?.height;
      const imageWidth = data?.ogImage?.width;

      const ogType = videoUrl ? 'video' : imageUrl ? 'image' : undefined;

      const ogMediaDimensions = ogType
        ? ogType == 'video'
          ? {height: videoHeight, width: videoWidth}
          : {height: imageHeight, width: imageWidth}
        : undefined;
      return ogMediaDimensions;
    }
  };

  let mediaDimensions = getMediaDimensions(data, type);

  let {height, width} = Dimensions.get('window');

  if (mediaDimensions?.height && mediaDimensions?.width) {
    if (screen == 'PostDetail') {
      console.log('screen is post detail in helper');
      if (type != 'video' && !data?.ogVideo?.url) {
        height = (width * mediaDimensions.height) / mediaDimensions.width;
        return {height, width};
      }
    }
    height = Math.ceil(
      (mediaDimensions.height * Dimensions.get('window').width) /
        mediaDimensions.width,
    );
    const heightPercentOfTotalWindowHeight =
      (height / Dimensions.get('window').height) * 100;

    const heightThreshold = screen == 'PostDetail' ? 75 : 65;
    height =
      heightPercentOfTotalWindowHeight > heightThreshold
        ? Dimensions.get('window').height / (100 / heightThreshold)
        : height;

    width = (height * mediaDimensions.width) / mediaDimensions.height;
  } else {
    return {height: 400, width: width};
  }
  return {height, width};
}
