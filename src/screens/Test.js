import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  ScrollView,
  TouchableHighlight,
  ProgressBarAndroid,
  Platform
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import Banner from '~/components/Banner';
import Icon from '~/components/Icon';
import { runTest } from '~/tests';
import { js_beautify as beautify } from 'js-beautify';

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
          <Text style={styles.codeHeader}>Test Code Preview</Text>
          <ScrollView>
            <Text style={styles.code}>{beautify(test.func.toString(), { indent_size: 2 })}</Text>
          </ScrollView>
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
  content: {},
  code: {
    backgroundColor: '#3F373A',
    color: '#c3c3c3',
    padding: 5,
    fontSize: 16,
  },
  codeHeader: {
    fontWeight: '600',
    fontSize: 18,
    backgroundColor: '#000',
    color: '#fff',
    padding: 5,
  }
});

function select(state, { navigation }) {
  const { suite, description } = navigation.state.params.test;

  return {
    test: state.tests.descriptions[suite][description],
  };
}

export default connect(select)(Test);
