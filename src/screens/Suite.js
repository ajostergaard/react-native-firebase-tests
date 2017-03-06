import React from 'react';
import { StyleSheet, View, Text, ListView, TouchableHighlight, ProgressBarAndroid, Platform, Button } from 'react-native';
import { connect } from 'react-redux';
import { runSuite } from '~/tests';
import groupBy from 'lodash.groupby';
import Banner from '~/components/Banner';
import Toast from 'react-native-simple-toast';
import Icon from '~/components/Icon';

class Suite extends React.Component {

  static navigationOptions = {
    title: ({ state }) => {
      return state.params.suite.name;
    },
    header: ({ state, setParams }) => {
      return {
        style: { backgroundColor: '#0288d1' },
        tintColor: '#ffffff',
        right: (
          <View style={{ flexDirection: 'row', marginRight: 8 }}>
            {state.params.status === 'error' && (
              <Icon
                color={state.params.errorToggle ? '#ffffff' : 'rgba(255, 255, 255, 0.54)'}
                size={28}
                name="error outline"
                onPress={() => {
                  setParams({
                    errorToggle: !state.params.errorToggle,
                  });
                }}
              />
            )}
            {state.params.status !== 'started' && (
              <Icon
                color={'#ffffff'}
                size={28}
                name="play circle filled"
                onPress={() => {
                  runSuite(state.params.suite.id);
                  Toast.show(`Running ${state.params.suite.name} tests.`);
                }}
              />
            )}
          </View>
        ),
      };
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

  componentDidMount() {
    this.props.navigation.setParams({
      running: this.props.suite.status === 'started',
    });
  }

  /**
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      dataBlob: this.dataSource.cloneWithRowsAndSections(nextProps.categories),
    });

    if (this.props.suite.status !== nextProps.suite.status) {
      this.props.navigation.setParams({
        status: nextProps.suite.status,
        running: !!nextProps.suite.status === 'started',
      });
    }

    if (this.props.navigation.state.params.errorToggle !== nextProps.navigation.state.params.errorToggle) {
      const errorsOnly = nextProps.navigation.state.params.errorToggle;

      if (!errorsOnly) {
        return this.setState({
          dataBlob: this.dataSource.cloneWithRowsAndSections(nextProps.categories),
        });
      }

      const response = {};

      Object.keys(nextProps.categories).forEach((key) => {
        nextProps.categories[key].forEach((test) => {
          if (test.status === 'error') {
            if (!response[key]) response[key] = [];
            response[key].push(test);
          }
        });
      });

      this.setState({
        dataBlob: this.dataSource.cloneWithRowsAndSections(response),
      });
    }
  }

  /**
   * Go a single test
   * @param test
   */
  goToTest(test) {
    const { navigate } = this.props.navigation;
    navigate('Test', { test });
  }

  /**
   * Render test group header
   * @param data
   * @param title
   * @returns {XML}
   */
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

  /**
   * Render test row
   * @param test
   * @param sectionId
   * @param rowId
   * @param highlight
   * @returns {XML}
   */
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
            style={[{ flex: 9 }, styles.rowContent]}
          >
            <Text
              numberOfLines={2}
            >
              {test.description}
            </Text>
          </View>
          <View style={[{ flex: 1 }, styles.rowContent, [{ alignItems: 'center' }]]}>
            {test.status === 'started' && (
              <Icon
                color={'rgba(0, 0, 0, 0.2)'}
                name={'autorenew'}
              />
            )}
            {test.status === 'success' && <Icon name={'done'} />}
            {test.status === 'error' && (
              <Icon
                color={'#f44336'}
                name={'clear'}
              />
            )}
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

  /**
   *
   * @returns {XML}
   */
  render() {
    console.log(this.props.navigation)
    const { suite } = this.props;

    return (
      <View style={styles.container}>
        {suite.status === 'started' && <Banner type={'warning'}>{`Tests are currently running (${suite.progress}%).`}</Banner>}
        {suite.status === 'success' && <Banner type={'success'}>{`Tests passed. (${suite.time}ms)`}</Banner>}
        {suite.status === 'error' && <Banner type={'error'}>{`${suite.message} (${suite.time}ms)`}</Banner>}
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
  errorBanner: {
    backgroundColor: '#f44336',
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
