import {Linking} from 'react-native';
import {navigate, push} from '../navigation/Ref';
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

export function getUriImage(uri) {
  return typeof uri == 'string' &&
    uri !== null &&
    uri !== undefined &&
    uri.split('http')[1] &&
    uri.includes('/') &&
    uri.includes('.')
    ? uri
    : '';
}

export function getLinkFromRemoteMessage(remoteMessage) {
  return remoteMessage.data?.detailedLink &&
    remoteMessage.data?.detailedLink?.length &&
    !remoteMessage.data.detailedLink?.includes('undefined')
    ? remoteMessage.data.detailedLink
    : remoteMessage.data?.link && remoteMessage.data?.link?.length
    ? remoteMessage.data.link
    : '/';
}

export function getScreenFromLink(link) {
  const isPath = !link.startsWith('https://ulkka.in');
  const path = isPath ? link : link.replace('https://ulkka.in/', '/');

  const splitPath = path?.split('/');
  const entity = link && splitPath[1];
  const entityId = link && splitPath[2];
  const detailedEntityId =
    link && splitPath?.length > 2 ? splitPath[3] : undefined;

  const screen =
    entity == 'post' && entityId && entityId != ''
      ? 'PostDetail'
      : entity == 'community' && entityId && entityId != ''
      ? 'CommunityNavigation'
      : 'Feed';

  return {screen, entityId, detailedEntityId};
}

export function navigateToLink(link) {
  const {screen, entityId, detailedEntityId} = getScreenFromLink(link);
  const field =
    screen == 'PostDetail'
      ? 'postId'
      : screen == 'CommunityNavigation'
      ? 'communityId'
      : 'home'; // placeholder field
  let params = {};
  params[field] = entityId;
  if (detailedEntityId) {
    params.commentId = detailedEntityId;
  }
  push(screen, params);
}

export const navigateToURL = async (url, clickedFrom) => {
  analytics().logEvent('link_click', {click_from: clickedFrom, link: url});
  const resolvedUrl = await dynamicLinks()
    .resolveLink(url)
    .catch(error => {
      console.error('not a dynamic link', error.message);
      return false;
    });
  if (resolvedUrl?.url?.startsWith('https://ulkka.in')) {
    navigateToLink(resolvedUrl.url);
  } else {
    Linking.openURL(url).catch(error =>
      console.error('cannot open link', error),
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

export function getTimestampFromRange(range) {
  switch (range) {
    case 'today':
      return Date.now() - 24 * 3600 * 1000;
    case 'week':
      return Date.now() - 7 * 24 * 3600 * 1000;
    case 'month':
      return Date.now() - 30 * 24 * 3600 * 1000;
    default:
      return undefined;
  }
}
