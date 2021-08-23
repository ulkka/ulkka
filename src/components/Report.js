import React, {useState, useContext} from 'react';
import {View, Text, Image} from 'react-native';
import {
  CheckBox,
  Divider,
  Button,
  Icon,
  ThemeContext,
} from 'react-native-elements';
import {hideOptionSheet} from '../redux/reducers/OptionSheetSlice';
import {useDispatch} from 'react-redux';
import {reportPost} from '../redux/actions/PostActions';
import {reportComment} from '../redux/actions/CommentActions';

const Report = props => {
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);

  const {id, type} = props;
  const [selectedReportOption, setSelectedReportOption] = useState('');
  const [loading, setLoading] = useState(false);

  const list = [
    {
      title: 'Sexual content',
    },
    {
      title: 'Violent or repulsive content',
    },
    {
      title: 'Hateful or abusive content',
    },
    {
      title: 'Harmful or dangerous acts',
    },
    {
      title: 'Spam or misleading',
    },
    {
      title: 'Bullying or harassment',
    },
    {
      title: 'Intellectual property violation',
    },
  ];

  const reportEntity = async () => {
    setLoading(true);
    const response =
      type == 'post'
        ? await dispatch(reportPost({id: id, option: selectedReportOption}))
        : await dispatch(reportComment({id: id, option: selectedReportOption}));
    setLoading(false);
    dispatch(hideOptionSheet());
  };

  const ButtonsView = (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      }}>
      <Button
        title="Cancel"
        containerStyle={{
          marginBottom: 15,
        }}
        titleStyle={{
          fontSize: 14,
          color: 'red',
          padding: 4,
          fontWeight: '600',
        }}
        onPress={() => dispatch(hideOptionSheet())}
      />
      <Button
        title="Report"
        disabled={selectedReportOption == ''}
        disabledStyle={{backgroundColor: 'transparent'}}
        disabledTitleStyle={{color: theme.colors.black7}}
        containerStyle={{
          marginBottom: 15,
        }}
        titleStyle={{
          fontSize: 14,
          color: theme.colors.blue,
          padding: 4,
          fontWeight: '600',
        }}
        onPress={reportEntity}
      />
    </View>
  );

  const TitleView = (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
      }}>
      <Icon
        name="flag"
        type="font-awesome"
        size={17}
        color={theme.colors.black5}
      />
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          padding: 10,
          color: theme.colors.black5,
        }}>
        Report{' '}
      </Text>
    </View>
  );

  const reportOptionsListView = list.map((l, i) => (
    <CheckBox
      key={i}
      checkedIcon="dot-circle-o"
      uncheckedIcon="circle-o"
      title={l.title}
      checkedColor={theme.colors.blue}
      checked={l.title == selectedReportOption}
      textStyle={{
        fontWeight: '300',
        fontWeight: '400',
        color: theme.colors.black5,
      }}
      containerStyle={{
        backgroundColor: theme.colors.grey0,
        borderRadius: 12,
        borderColor: theme.colors.grey2,
      }}
      onPress={() => setSelectedReportOption(l.title)}
    />
  ));

  return loading ? (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
      }}>
      <Image
        source={require('../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      {TitleView}
      {reportOptionsListView}
      <Divider
        style={{
          height: 15,
          backgroundColor: 'transparent',
        }}
      />
      {ButtonsView}
    </View>
  );
};

export default Report;
