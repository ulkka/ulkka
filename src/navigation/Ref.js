import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBackFromAuthToHome() {
  console.log(
    'navigation current route name',
    navigationRef.current,
    navigationRef.current.canGoBack(),
    navigationRef.current.dangerouslyGetParent(),
    navigationRef.current.getRootState(),
    //  navigationRef.current.getCurrentRoute(),
  );
  if (navigationRef.current.canGoBack()) {
    navigationRef.current.goBack();
  }
}
