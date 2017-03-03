import React from 'react';
import { StyleSheet, View, Text, ListView, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

import { runSuite } from '~/tests';

class Overview extends React.Component {

  static navigationOptions = {
    title: 'Test Suites',
    header: {
      style: { backgroundColor: '#0288d1' },
      tintColor: '#ffffff',
    },
  };

  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
    });

    this.state = {
      dataBlob: this.dataSource.cloneWithRows(props.suites),
    };
  }

  /**
   *
   */
  componentDidMount() {
    runSuite('database');
  }

  /**
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataBlob: this.dataSource.cloneWithRows(nextProps.suites),
    });
  }

  /**
   *
   * @param suite
   */
  goToSuite(suite) {
    const { navigate } = this.props.navigation;

    navigate('Suite', { suite });
  }

  // TODO Status icon/symbol or something
  /**
   *
   * @param suite
   * @param sectionId
   * @param rowId
   * @param highlight
   * @returns {XML}
   */
  renderRow(suite, sectionId, rowId, highlight) {
    return (
      <TouchableHighlight
        key={`row_${rowId}`}
        underlayColor={'rgba(0, 0, 0, 0.054)'}
        onPress={() => {
          this.goToSuite(suite);
          highlight();
        }}
      >
        <View style={[styles.row, suite.status === 'error' ? styles.error : null]}>
          <View>
            <Text style={styles.title}>{suite.name}</Text>
            <Text
              style={styles.description}
              numberOfLines={1}
            >
              {suite.description}
              </Text>
          </View>
          <View style={styles.statusContainer}>
            <Text>{suite.status || 'paused'}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  /**
   *
   * @param sectionID
   * @param rowID
   * @returns {XML}
   */
  renderSeparator(sectionID, rowID) {
    return (
      <View
        key={`separator_${sectionID}_${rowID}`}
        style={styles.separator}
      />
    );
  }

  /**
   *
   * @returns {XML}
   */
  render() {
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          dataSource={this.state.dataBlob}
          renderRow={(...args) => this.renderRow(...args)}
          renderSeparator={(...args) => this.renderSeparator(...args)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  description: {
    fontSize: 11,
  },
  statusContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  row: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    backgroundColor: 'rgba(255, 0, 0, 0.054)',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
});

function select(state) {
  return {
    suites: state.tests.suites,
  };
}

export default connect(select)(Overview);
