import React, {useEffect} from 'react';
import {View} from 'react-native';
import auth from '@react-native-firebase/auth';
import mainClient from './mainClient';

const IdTokenListener = () => {
  useEffect(() => {
    const subscriber = auth().onIdTokenChanged(handleIdTokenChange);
    return subscriber; // unsubscribe on unmount
  }, []);

  async function handleIdTokenChange(user) {
    // token refreshed in mainClient.js refreshauthlogic
    const idToken = await auth().currentUser?.getIdToken(false);
    // const idToken =
    //   'eyJhbGciOiJSUzI1NiIsImtpZCI6ImY4NDY2MjEyMTQxMjQ4NzUxOWJiZjhlYWQ4ZGZiYjM3ODYwMjk5ZDciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVHJvbGwgQWNjb3VudCIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLUZmTzBsejFKajBnL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FNWnV1Y2xaWC16ZGlyM01XdXhDM1k1dEZVTktXU0tkNFEvczk2LWMvcGhvdG8uanBnIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3ZlbGxhcmlra2EtcGF0dGFuYW0iLCJhdWQiOiJ2ZWxsYXJpa2thLXBhdHRhbmFtIiwiYXV0aF90aW1lIjoxNjE2OTU0MjM5LCJ1c2VyX2lkIjoiRWczdW5KM1BZQmJBSE4wT1cyOHdEYjRGbTdqMiIsInN1YiI6IkVnM3VuSjNQWUJiQUhOME9XMjh3RGI0Rm03ajIiLCJpYXQiOjE2MTY5NTkxNDEsImV4cCI6MTYxNjk2Mjc0MSwiZW1haWwiOiJ0cm9sbGFuYXBwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTExNDIyNjIwNzQ3OTAyNzg4MzQ4Il0sImVtYWlsIjpbInRyb2xsYW5hcHBAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.V2G5zOmJ33-G-q7KOndx1wCvk6PBF5kZsc9WlGeRLEWNhhISEucmCrOZNFHkvniW3iRHIZ56FrxbhzYTlcSQgpNlryx2van7zW7HYD5DHf8xL62uJ_FJWodIeW_JvcI5lNjaRvLa0sQ2HvjBDlfL668A6OkyPQcM-GZT4pjLGozK9DW5yISnYzeMVQ9P8kEAiYZik8RAY1VtLfaL2-XoPh89rf1tFOFEKtNTkXaWFCMidCs7AeldMA5-EGQU_CADuAwBfPMexeUI4lOGHdl5AHk7p0mUJp4OIyILkUdRuv4zrAxCq3CWg8_P-3oyszkWEIQBxNHFt0GfoXSPYZ7yOg';
    if (idToken) {
      mainClient.defaults.headers.common['Authorization'] = 'Bearer ' + idToken;
    }
  }

  return <View></View>;
};

export default IdTokenListener;
