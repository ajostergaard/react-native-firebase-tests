import React from 'react';
import { StyleSheet, View, Text, ListView, TouchableHighlight, ProgressBarAndroid, Platform, Button } from 'react-native';
import { connect } from 'react-redux';
import groupBy from 'lodash.groupby';

class Suite extends React.Component {

  static navigationOptions = {
    title: ({ state }) => {
      return state.params.suite.name;
    },
    header: {
      style: { backgroundColor: '#0288d1' },
      tintColor: '#ffffff',
    },
  };

  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataBlob: this.dataSource.cloneWithRowsAndSections(props.categories),
    };
  }

  /**
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataBlob: this.dataSource.cloneWithRowsAndSections(nextProps.categories),
    });
  }

  goToTest(test) {
    const { navigate } = this.props.navigation;

    navigate('Test', { test });
  }

  renderInProgress() {
    return (
      <View style={styles.inProgress}>
        <Text style={styles.inProgressText}>Tests in progress.</Text>
      </View>
    );
  }

  renderHeader(data, title) {
    return (
      <View
        key={`header_${title}`}
        style={styles.header}
      >
        <Text style={styles.headerText}>{title.toUpperCase()}</Text>
      </View>
    )
  }

  renderRow(test, sectionId, rowId, highlight) {
    return (
      <TouchableHighlight
        key={`row_${rowId}`}
        underlayColor={'rgba(0, 0, 0, 0.054)'}
        onPress={() => {
          this.goToTest(test);
          highlight();
        }}
      >
        <View style={[styles.row, test.status === 'error' ? styles.error : null]}>
          <View
            style={[{ flex: 8 }, styles.rowContent]}
          >
            <Text
              numberOfLines={2}
            >
              {test.description}
            </Text>
          </View>
          <View style={[{ flex: 2 }, styles.rowContent]}>
            <Text>{test.status}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
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

  render() {
    const { suite } = this.props;

    return (
      <View style={styles.container}>
        {suite.status === 'started' && this.renderInProgress()}
        <ListView
          dataSource={this.state.dataBlob}
          renderSectionHeader={(...args) => this.renderHeader(...args)}
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
  inProgress: {
    backgroundColor: '#FFC107',
    alignItems: 'center',
    elevation: 3,
  },
  inProgressText: {
    color: '#ffffff',
  },
  header: {
    elevation: 3,
    justifyContent: 'center',
    height: 25,
    paddingHorizontal: 16,
    backgroundColor: '#ECEFF1',
  },
  headerText: {
    fontWeight: '800',
  },
  row: {
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
  },
  rowContent: {
    justifyContent: 'center',
  },
  error: {
    backgroundColor: 'rgba(255, 0, 0, 0.054)',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
});

function select(state, { navigation }) {
  const id = navigation.state.params.suite.id;

  return {
    suite: state.tests.suites[id],
    categories: groupBy(state.tests.descriptions[id], 'category'),
  };
}

export default connect(select)(Suite);
