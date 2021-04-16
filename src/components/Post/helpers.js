import {Dimensions} from 'react-native';

export function mediaUrlWithWidth(url, width, type) {
  let splitUrl = url.split('upload');
  const lesserWidth =
    width < Dimensions.get('window').width
      ? parseInt(width)
      : parseInt(Dimensions.get('window').width);
  const transformParams = type == 'video' ? 'w_' : 'q_100,w_';
  const transformedUrl =
    splitUrl[0] + 'upload/' + transformParams + lesserWidth + splitUrl[1];
  return transformedUrl;
}

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

    const heightThreshold = 75;
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

export function makeId(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const getHostnameFromRegex = (url) => {
  // run against regex
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  // extract hostname (will be null if no match is found)
  return matches && matches[1];
};
