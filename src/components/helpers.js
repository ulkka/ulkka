import {Linking} from 'react-native';
import {navigate} from '../navigation/Ref';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import analytics from '@react-native-firebase/analytics';

function getScreenFromLink(link) {
  const isPath = !link.startsWith('https://ulkka.in');
  const path = isPath ? link : link.replace('https://ulkka.in/', '/');

  console.log('path', path);
  const entity = link && path.substring(1, path.lastIndexOf('/'));
  const entityId = link && path.substring(path.lastIndexOf('/') + 1);
  const screen =
    entity == 'post' && entityId && entityId != '' ? 'PostDetail' : 'Feed';

  return {screen, entityId};
}

export function navigateToLink(link) {
  const {screen, entityId} = getScreenFromLink(link);
  console.log('{ screen, entityId }', screen, entityId, link);
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
