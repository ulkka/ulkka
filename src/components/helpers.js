import {Linking} from 'react-native';
import {navigate} from '../navigation/Ref';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import analytics from '@react-native-firebase/analytics';

const coolColors = [
  '#FF420E',
  '#695cff',
  '#2450a4',
  '#ff3781',
  '#fea800',
  '#ffd933',
  '#f62a66',
  '#fbb040',
  '#8f3a84',
  '#3a4750',
  '#ff8f56',
  '#be3144',
  '#28cc9e',
  '#f6c90e',
  '#dd1616',
  '#09229c',
  '#eee14d',
  '#0ad8ff',
  '#8843eb',
];

export function getColorFromTitle(text) {
  const index = parseInt(text, 36) % 19;
  const color = coolColors[index];
  return color ? color : coolColors[13];
}

export function getScreenFromLink(link) {
  const isPath = !link.startsWith('https://ulkka.in');
  const path = isPath ? link : link.replace('https://ulkka.in/', '/');

  const entity = link && path.substring(1, path.lastIndexOf('/'));
  const entityId = link && path.substring(path.lastIndexOf('/') + 1);
  const screen =
    entity == 'post' && entityId && entityId != ''
      ? 'PostDetail'
      : entity == 'community' && entityId && entityId != ''
      ? 'CommunityNavigation'
      : 'Feed';

  return {screen, entityId};
}

export function navigateToLink(link) {
  const {screen, entityId} = getScreenFromLink(link);
  const field =
    screen == 'PostDetail'
      ? 'postId'
      : screen == 'CommunityNavigation'
      ? 'communityId'
      : 'home'; // placeholder field
  let params = {};
  params[field] = entityId;
  navigate(screen, params);
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
