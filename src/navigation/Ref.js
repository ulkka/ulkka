import * as React from 'react';
import {CommonActions, StackActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function push(name, params) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

export function goBack() {
  if (navigationRef.current.canGoBack()) {
    navigationRef.current.goBack();
  }
}

export const showAuthScreen = () => {
  navigationRef.current?.navigate('Authentication');
};

const resetAction = CommonActions.reset({
  index: 0,
  routes: [{name: 'Main'}],
});

export const reset = () => {
  // navigationRef.current?.dispatch(resetAction);
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{name: 'Main'}],
  });
};
