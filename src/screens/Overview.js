import React from 'react';
import { View, Text } from 'react-native';

class Overview extends React.Component {

  static navigationOptions = {
    title: 'Test Overview',
  };

  render() {
    return (
      <View>
        <Text>Overview</Text>
      </View>
    );
  }
}

export default Overview;
