import {Linking} from 'react-native';
import {navigate} from '../navigation/Ref';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import analytics from '@react-native-firebase/analytics';

const coolColors = [
  '#FF420E',
  '#336b87',
  '#2a3132',
  '#ba5536',
  '#a43820',
  '#a3bd38',
  '#598234',
  '#68829e',
  '#003b46',
  '#07575b',
  '#486b00',
  '#021c1e',
  '#c8000a',
  '#2c7873',
  '#375e97',
  '#fb6542',
  '#ffbb00',
  '#e6d72a',
  '#f18d9e',
  '#4cb5f5',
  '#32384d',
  '#20948b',
  '#8d230f',
  '#1e434c',
  '#1995ad',
  '#063852',
  '#8eba43',
  '#2d4262',
  '#9bc01c',
  '#cb0000',
  '#7caa2d',
  '#00293c',
  '#f62a00',
  '#258039',
  '#006c84',
  '#31a9b8',
  '#ee693F',
  '#793f3d',
  '#283655',
  '#4d648d',
  '#f70025',
  '#f25c00',
  '#4897d8',
  '#d13525',
  '#fa4032',
  '#f56c57',
  '#e94f08',
  '#68a225',
  '#d72c16',
  '#2988bc',
];

export function getColorFromTitle(text) {
  const index = parseInt(text, 36) % 50;
  const color = coolColors[index];
  return color;
}

function getScreenFromLink(link) {
  const isPath = !link.startsWith('https://ulkka.in');
  const path = isPath ? link : link.replace('https://ulkka.in/', '/');

  const entity = link && path.substring(1, path.lastIndexOf('/'));
  const entityId = link && path.substring(path.lastIndexOf('/') + 1);
  const screen =
    entity == 'post' && entityId && entityId != '' ? 'PostDetail' : 'Feed';

  return {screen, entityId};
}

export function navigateToLink(link) {
  const {screen, entityId} = getScreenFromLink(link);
  navigate(screen, {
    postId: entityId,
  });
}

export const navigateToURL = async (url, clickedFrom) => {
  analytics().logEvent('link_click', {click_from: clickedFrom, link: url});
  const resolvedUrl = await dynamicLinks()
    .resolveLink(url)
    .catch((error) => {
      console.log('not a dynamic link', error.message);
      return false;
    });
  if (resolvedUrl?.url?.startsWith('https://ulkka.in')) {
    navigateToLink(resolvedUrl.url);
  } else {
    Linking.openURL(url).catch((error) =>
      console.log('cannot open link', error),
    );
  }
};

export function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
    : Math.sign(num) * Math.abs(num);
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
