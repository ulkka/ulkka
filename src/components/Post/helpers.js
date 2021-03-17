import {Dimensions} from 'react-native';

export function scaleHeightAndWidthAccordingToDimensions(mediaDimensions) {
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
