import {Linking} from 'react-native';
import {navigate, push} from '../navigation/Ref';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import analytics from '@react-native-firebase/analytics';

export const coolColors = [
  '#e90c20dd',
  '#695cffdd',
  '#00B1D2dd',
  '#963cbddd',
  '#ff6f61dd',
  '#feae51',
  '#28cc9edd',
  '#fdd20e',
  '#f93822dd',
  '#f9dc5c',
  '#ffd933dd',
  '#f62a66dd',
  '#0ad8ffdd',
  '#8843ebdd',
];

const TSH = s => {
  for (var i = 0, h = 9; i < s.length; )
    h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
  return h ^ (h >>> 9);
};
export function getColorFromTitle(text) {
  const index = Math.abs(TSH(text) % coolColors.length);
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
  const isPath = !link.startsWith('https://omong.id');
  const path = isPath ? link : link.replace('https://omong.id/', '/');

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
      console.warn('not a dynamic link', error.message);
      return false;
    });
  if (resolvedUrl?.url?.startsWith('https://omong.id')) {
    navigateToLink(resolvedUrl.url);
  } else {
    Linking.openURL(url).catch(error =>
      console.warn('cannot open link', error),
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
