import {useActionSheet} from '@expo/react-native-action-sheet';
import {Chat, defaultTheme} from '@flyerhq/react-native-chat-ui';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
import {launchImageLibrary} from 'react-native-image-picker';
import {v4 as uuidv4} from 'uuid';
import useWebSocket from '../../hooks/useWebSocket';

const users = [
  {
    firstName: 'John',
    id: 'b4878b96-efbc-479a-8291-474ef323dec7',
    imageUrl: 'https://avatars.githubusercontent.com/u/14123304?v=4',
  },
  {
    firstName: 'Jane',
    id: '06c33e8b-e835-4736-80f4-63f44b66666c',
    imageUrl: 'https://avatars.githubusercontent.com/u/33809426?v=4',
  },
];

let numberOfMessages = 10;

const generated = [...Array(numberOfMessages)].map((_, index) => {
  const randomText = Math.round(Math.random());
  const text = randomText ? 'Text 1' : 'Text 2';
  const randomAuthor = Math.round(Math.random());
  const author = randomAuthor ? users[0] : users[1];
  const createdAt = Date.now() - index;
  const data = {
    author,
    createdAt,
    id: uuidv4(),
    status: 'seen',
    text,
    type: 'text',
  };
  return data;
});

const ChatDetail = props => {
  const token = 'ilma2@test.com';
  const {websocket} = useWebSocket({
    url: `ws://192.168.0.6:8080/ws?token=${token}`,
  });
  const {showActionSheetWithOptions} = useActionSheet();
  const [messages, setMessages] = useState(generated);
  const user = {id: '06c33e8b-e835-4736-80f4-63f44b66666c'};

  const addMessage = message => {
    setMessages([message, ...messages]);
  };

  const handleAttachmentPress = () => {
    showActionSheetWithOptions(
      {
        options: ['Photo', 'File', 'Cancel'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            handleImageSelection();
            break;
          case 1:
            handleFileSelection();
            break;
        }
      },
    );
  };

  const handleFileSelection = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      const fileMessage = {
        author: user,
        createdAt: Date.now(),
        id: uuidv4(),
        mimeType: response.type ?? undefined,
        name: response.name,
        size: response.size ?? 0,
        type: 'file',
        uri: response.uri,
      };
      addMessage(fileMessage);
    } catch {}
  };

  const handleImageSelection = () => {
    launchImageLibrary(
      {
        includeBase64: true,
        maxWidth: 1440,
        mediaType: 'photo',
        quality: 0.7,
      },
      ({assets}) => {
        const response = assets?.[0];

        if (response?.base64) {
          const imageMessage = {
            author: user,
            createdAt: Date.now(),
            height: response.height,
            id: uuidv4(),
            name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
            size: response.fileSize ?? 0,
            type: 'image',
            uri: `data:image/*;base64,${response.base64}`,
            width: response.width,
          };
          addMessage(imageMessage);
        }
      },
    );
  };

  const handleMessagePress = async message => {
    if (message.type === 'file') {
      try {
        await FileViewer.open(message.uri, {showOpenWithDialog: true});
      } catch {}
    }
  };

  const handlePreviewDataFetched = ({message, previewData}) => {
    setMessages(
      messages.map(m => (m.id === message.id ? {...m, previewData} : m)),
    );
  };

  const handleSendPress = message => {
    const textMessage = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    };
    addMessage(textMessage);
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <>
      <Chat
        messages={messages}
        onAttachmentPress={handleAttachmentPress}
        onMessagePress={handleMessagePress}
        onPreviewDataFetched={handlePreviewDataFetched}
        onSendPress={handleSendPress}
        user={user}
        showUserAvatars={true}
        theme={{
          ...defaultTheme,
          colors: {...defaultTheme.colors, primary: '#FF7BAC'},
        }}
      />
    </>
  );
};

export default ChatDetail;
