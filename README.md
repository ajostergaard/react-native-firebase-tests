# [WIP] react-native-firebase Test App

An **iOS** and **Android** React Native app built to test [`react-native-firebase`](https://github.com/invertase/react-native-firebase).

## Install
> Make sure you have the iOS and/or Android emulator/device running!

1: Clone
```bash
git clone git@github.com:invertase/react-native-firebase-tests.git
```
2: Install dependancies
```bash
npm install
```
or
```
yarn
```
3: Start RN packager
```bash
npm run start
```
4: Install the app
```
npm run android:dev
npm run ios:dev
```

## Tests

Tests are bootstrapped and ran when the app is booted. The status of each test suite and individual test
will update as and when a test has completed or errored.

### Adding a new test suite

A test suite groups together related tests, e.g. Realtime Database tests. To add a new suite, create a new
direcory within `src/tests`. Create an `index.js` file, containing the following:

```javascript
import TestSuite from '~/TestSuite';

const MyNewSuite = new TestSuite('Storage', 'Upload/Download storage tests');
const { describe } = MyNewSuite;

export default MyNewSuite;
```

This file now needs to be imported within `src/tests/index.js`.

### Adding new tests

The `TestSuite` class provides a `describe` function, which will be used to run our tests.
Tests can be async is returned with a Promise.

```javascript
describe('async successful test', 'category', async (test, state) => {
  return new Promise((resolve, reject) => {
    console.log('Current test: ', test);
    console.log('Current state: ', state);

    resolve();
  });
});
```

> When rejecting, always ensure a valid [JavaScript Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) is provided.

### Running tests

Tests can be run by pressing the play button in the toolbar of the app. Test can be run individually, by suite, or all at once.

### Lifecycle methods

Four lifecycle methods are provided for each suite.

```javascript
const { before, beforeEach, afterEach, after } = MyNewSuite;

before(() => console.log('Before all tests start.'});
beforeEach(() => console.log('Before every test starts.'});
afterEach(() => console.log('After each test starts.'});
after(() => console.log('After all tests are complete, with success or error.'});
```

These can be asynchronous by returning a Promise.

## Misc

### Imports

Imports are managed by [babel-plugin-root-import](https://www.npmjs.com/package/babel-plugin-root-import), where the root
is `src`.
