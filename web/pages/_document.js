import {Children} from 'react';
import Document, {Html, Head, Main, NextScript} from 'next/document';
import {AppRegistry} from 'react-native';
import config from '../app.json';

// Use prebuilt version of RNVI in dist folder
import Icon from 'react-native-vector-icons/dist/FontAwesome';

// Generate required css
import iconFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
import materialFont from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';
import materialCommunityFont from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: FontAwesome;
}

@font-face {
  src: url(${materialFont});
  font-family: MaterialIcons;
}
@font-face {
  src: url(${materialCommunityFont});
  font-family: MaterialCommunityIcons;
}

`;

// Create stylesheet

// Force Next-generated DOM elements to fill their parent's height
const normalizeNextElements = `
  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

export default class MyDocument extends Document {
  static async getInitialProps({renderPage}) {
    AppRegistry.registerComponent(config.name, () => Main);
    const {getStyleElement} = AppRegistry.getApplication(config.name);
    const page = await renderPage();
    const styles = [
      <style dangerouslySetInnerHTML={{__html: normalizeNextElements}} />,
      <style dangerouslySetInnerHTML={{__html: iconFontStyles}} />,

      getStyleElement(),
    ];
    return {...page, styles: Children.toArray(styles)};
  }

  render() {
    return (
      <Html style={{height: '100%'}}>
        <Head />
        <body style={{height: '100%', overflow: 'hidden'}}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
