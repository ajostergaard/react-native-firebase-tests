# [WIP] react-native-firebase Test App

An **iOS** and **Android** React Native app built to test [`react-native-firebase`](https://github.com/invertase/react-native-firebase).

## Install
> Make sure you have the iOS and/or Android emulator/device running!

1: Clone
```bash
git clone <<repo url>>
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
const { describe } = Suite;

export default MyNewSuite;
```

This file now needs to be imported within `src/tests/index.js`.

### Adding new tests

The `TestSuite` class provides a `describe` function, which will be used to run our asynchronous tests.
The async function must return either a resolved or rejected promise when complete.

```javascript
describe('test description', 'category', async (test) => {
  console.log('Current test: ', test);

  return Promise.reject(new Error('Some error occured'));
});
```

> When rejecting, always ensure a valid [JavaScript Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) is provided.

### Running tests

Tests can be run by rebooting the app, or manually within the app.

## Misc

### Imports

Imports are managed by [babel-plugin-root-import](https://www.npmjs.com/package/babel-plugin-root-import), where the root
is `src`.
