import React from 'react';
import { StyleSheet, View, Text, ListView, TouchableHighlight, ProgressBarAndroid, Platform } from 'react-native';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import Banner from '~/components/Banner';
import Icon from '~/components/Icon';
import { runTest } from '~/tests';

class Test extends React.Component {

  static navigationOptions = {
    title: ({ state }) => {
      return state.params.test.description;
    },
    header: ({ state }) => {
      const params = state.params || { test: {} };

      return {
        style: { backgroundColor: '#0288d1' },
        tintColor: '#ffffff',
        right: (
          <View style={{ marginRight: 8 }}>
            {!state.params.running && (
              <Icon
                color={'#ffffff'}
                size={28}
                name="play circle filled"
                onPress={() => {
                  runTest(params.test.suite, params.test.category, params.test.description);
                  Toast.show(`Running ${state.params.test.description}.`);
                }}
              />
            )}
          </View>
        ),
      };
    },
  };

  componentDidMount() {
    this.props.navigation.setParams({
      test: this.props.test,
    });
  }

  render() {
    const { test } = this.props;

   return (
     <View style={styles.container}>
       {test.status === 'started' && <Banner type={'warning'}>Test is currently running.</Banner>}
       {test.status === 'success' && <Banner type={'success'}>{`Test passed. (${test.time}ms)`}</Banner>}
       {test.status === 'error' && <Banner type={'error'}>{`Test failed. (${test.time}ms)`}</Banner>}
       <View style={styles.content}>
         <Text>{test.message}</Text>
       </View>
     </View>
   );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {

  },
});

function select(state, { navigation }) {
  const { suite, description } = navigation.state.params.test;

  return {
    test: state.tests.descriptions[suite][description],
  };
}

export default connect(select)(Test);
