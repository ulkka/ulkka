import {Dimensions} from 'react-native';

export function scaleHeightAndWidthAccordingToDimensions(mediaMetadata) {
  let {height, width} = Dimensions.get('window');
  if (mediaMetadata) {
    height = Math.ceil(
      (mediaMetadata.height * Dimensions.get('window').width) /
        mediaMetadata.width,
    );
    const heightPercentOfTotalWindowHeight =
      (height / Dimensions.get('window').height) * 100;

    height =
      heightPercentOfTotalWindowHeight > 50
        ? Dimensions.get('window').height / 1.865
        : height;

    width = (height * mediaMetadata.width) / mediaMetadata.height;
  }
  return {height, width};
}
