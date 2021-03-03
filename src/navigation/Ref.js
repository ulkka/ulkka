import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  if (navigationRef.current.canGoBack()) {
    navigationRef.current.goBack();
  }
}

export const showAuthScreen = () => {
  navigationRef.current?.navigate('Authentication');
};
