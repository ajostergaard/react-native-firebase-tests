import React from 'react';
import { StyleSheet, View, Text, ListView, TouchableHighlight, ProgressBarAndroid, Platform } from 'react-native';
import { connect } from 'react-redux';

class Test extends React.Component {

  static navigationOptions = {
    title: ({ state }) => {
      return state.params.test.description;
    },
    header: {
      style: { backgroundColor: '#0288d1' },
      tintColor: '#ffffff',
    },
  };

  renderInProgress() {
    return (
      <View style={[styles.banner, styles.inProgress]}>
        <Text style={styles.bannerText}>Test is currently in progress.</Text>
      </View>
    );
  }

  renderSuccess() {
    return (
      <View style={[styles.banner, styles.success]}>
        <Text style={styles.bannerText}>Test succeeded.</Text>
      </View>
    );
  }

  renderError() {
    return (
      <View style={[styles.banner, styles.error]}>
        <Text style={styles.bannerText}>Test failed.</Text>
      </View>
    );
  }

  render() {
    const { test } = this.props;

   return (
     <View style={styles.container}>
       {test.status === 'started' && this.renderInProgress()}
       {test.status === 'success' && this.renderSuccess()}
       {test.status === 'error' && this.renderError()}
       <View>
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
  banner: {
    alignItems: 'center',
    elevation: 3,
  },
  bannerText: {
    color: '#ffffff',
  },
  inProgress: {
    backgroundColor: '#FFC107',
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#f44336',
  },
});

function select(state, { navigation }) {
  const { suite, description } = navigation.state.params.test;

  return {
    test: state.tests.descriptions[suite][description],
  };
}

export default connect(select)(Test);
