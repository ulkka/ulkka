import {Dimensions} from 'react-native';

export function scaleHeightAndWidthAccordingToDimensions(data, type) {
  if (data == undefined) {
    return {height: undefined, width: undefined};
  }

  const getMediaDimensions = (data, type) => {
    if (type == 'media') {
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
    height = Math.ceil(
      (mediaDimensions.height * Dimensions.get('window').width) /
        mediaDimensions.width,
    );
    const heightPercentOfTotalWindowHeight =
      (height / Dimensions.get('window').height) * 100;

    height =
      heightPercentOfTotalWindowHeight > 50
        ? Dimensions.get('window').height / 1.865
        : height;

    width = (height * mediaDimensions.width) / mediaDimensions.height;
  } else {
    return {height: 400, width: width};
  }
  return {height, width};
}
