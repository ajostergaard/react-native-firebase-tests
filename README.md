# [WIP] react-native-firebase Test App

An **iOS** and **Android** React Native app built to test [`react-native-firebase`](https://github.com/invertase/react-native-firebase).

## Install

1. Clone the test application

```bash
git clone https://github.com/invertase/react-native-firebase-tests.git
```

2. Install the dependencies listed in `package.json`

```bash
npm install
```

### iOS Installation

3. Install the test application's CocoaPods. 
* See [troubleshooting](#installing-podfiles) if this doesn't work for you.

```bash
npm run ios:pod:install
```

4. Start the React Native packager

```bash
npm run start
```

5. In another terminal window, install the app on your emulator:

```bash
npm run ios:dev
```

### Android Installation

6. Start your emulator through Android Studio: Tools > Android > AVD Manager

> You will need a version of the Android emulator that has the Play Store installed (you should be able to find it on the emulator's home screen on on the list of apps).

7. Start the React Native packager if you haven't already in the iOS instructions.

```bash
npm run start
```

8. Run the test app on your Android emulator:


```bash
npm run android:dev
```

## Tests

Tests are bootstrapped and ran when the app is booted. The status of each test suite and individual test
will update as and when a test has completed or errored.

### Running tests

Tests can be run by pressing the play button in the toolbar of the app. Test can be run individually, by suite, or all at once.

![Test suite Android](/docs/assets/test-suite-screenshot-android.png?raw=true)

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

## Running test suite during development

You can use the node module `wml` to automatically copy changes you make to `react-native-firebase` over to the test application so you can run the test suite against them.

1. Install `wml` globally:

```bash
npm install wml -g
```

2. Configure `wml` to copy changes from where you are developing `react-native-firebase` to where `react-native-firebase-tests` is:

```bash
wml add /full/path/to/RNfirebase-clone /full/path/to/tests-repo/node_modules/react-native-firebase
```

3. Start `wml`:

```bash
wml start
```

> JavaScript changes require restarting the React Native packager to take effect

> Java changes will need to be rebuilt in Android Studio

> Objective-C changes need to be rebuilt in Xcode

4. Stop `wml` when you are finished:
```bash
wml stop
```

## Misc

### Imports

Imports are managed by [babel-plugin-root-import](https://www.npmjs.com/package/babel-plugin-root-import), where the root
is `src`.

## Troubleshooting

### Installing PodFiles

#### Invalid React.podspec file: no implicit conversion of nil into String

This error occurs if you are using ruby version 2.1.2. Upgrade your version of ruby and try again.

