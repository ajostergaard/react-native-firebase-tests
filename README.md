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


### Adding a new test

To add a new test to an existing test file, you simply need to add a new `describe` call, with your new test function. See the [describe API](#describe-api) below.

```javascript
describe('synchronous test', 'category', function() {

  // Setup and test assertions here
  
});
```

Tests can be asynchronous if they return a promise.

```javascript
describe('async successful test', 'category', async () => {

  return new Promise((resolve, reject) => {
    // ...
    resolve();
  });
  
});
```

> When rejecting, always ensure a valid [JavaScript Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) is provided.

### Creating a new test category

A test category groups tests that have a common theme within the same Firebase feature. If you want to add tests that don't fit in any of the existing test categories, you can create a new one:

1. Create a new file in one of the test directories under `src/tests/*/` depending on which firebase feature your tests relate to.
2. In the file, define a new function that accepts the arguments:
 
* **testSuite** - An instance of `TestSuite` that defines the test DSL and helpers. See [Test Definition](#test-definition) below.
* **testState** - (optional) The current state of the test suite.

```javascript
function testCategory({ describe }) {

  describe('a test', 'My test category', function(){
    // Test code
  });
}

export default testCategory;
```

3. Import your new test file in the `index.js` file of the same directory (`/src/tests/*/index.js`) and pass it the instance of `TestSuite` defined there. This allows the test category to register itself in the test suite.

```javascript
import newTestCategory from './newTestCategory';

//...

const suite = new TestSuite('Database', 'firebase.database()', { concurrency: 1 });

//...

newTestCategory(suite);
```


### Creating a new test suite

A test suite groups together test categories under the same Firebase feature. e.g. *Realtime Database* tests. 

To add a new test suite: 

1. Create a new directory within `src/tests`.
2. Create an `index.js` file.

In this file, you need to create an instance of `TestSuite` - see [TestSuite constructor](#testsuite-constructor).

```javascript
import TestSuite from '~/TestSuite';

const MyNewSuite = new TestSuite('Realtime Database Storage', 'Upload/Download storage tests');

export default MyNewSuite;
```

The test suite instance is then passed to each of your test files and provides the DSL used to write your tests.

3. Ensure the test suite instance is exported at the end of the `index.js` file as shown above. This file then needs to be imported within `src/tests/index.js`.


```javascript
import database from './database';

const tests = {
  //...
  database // <-- Add the test suite to the list of tests
};

```

## TestSuite API

### TestSuite Constructor

The TestSuite constructor accepts 3 arguments:

- **name**: String containing the name of the test suite. e.g. 'Realtime Storage'
- **description**: String containing description of the test suite
- **options**: (optional) Object of options 
  - **concurrency**: Integer setting the maximum number of tests to run concurrently. Default is 10.

```javascript
new TestSuite('Realtime Database Storage', 'firebase.database()', { concurrency: 1 });
```

### Test Definition

#### describe API

The `describe` function takes 2 - 3 arguments:

- **description**: String describing the test
- **category**: (Optional) string describing category of test
- **test**: Test function or promise, containing the test's body and assertions.

```javascript
function testCategory({ describe }) {

  describe('sync successful test', 'category', function() {
    // ...
  });
  
  describe('async successful test', 'category', async () => {
  
    return new Promise((resolve, reject) => {
      // ...
      resolve();
    });
    
  });
}
```
#### Test Assertions

The assertion library Should.js is used in the tests. The complete list of available assertions is available in the [Should.js documentation](https://shouldjs.github.io).

#### Lifecycle methods

Four lifecycle methods are provided for each test suite:

- **before** - Run once, before the test suite executes
- **beforeEach** - Run before every test in the test suite
- **after** - Run once, after the test suite has finished executing
- **afterEach** - Run after every test in the test suite

Each accepts a function or a promise to be run at the corresponding point in the test lifecycle.

```javascript
function testCategory({ before, beforeEach, afterEach, after }) {

  before(() => console.log('Before all tests start.'));
  beforeEach(() => console.log('Before every test starts.'));
  
  describe('sync successful test', 'category', function() {
    // ...
  });
  
  afterEach(() => console.log('After each test starts.'));
  after(() => console.log('After all tests are complete, with success or error.'));
}
```

#### Accessing Firebase

Firebase is available on `firebase.native`:

```javascript
function testCategory({ describe, firebase }) {

  describe('sync successful test', 'category', function() {
    firebase.native.database();
  });
}
```

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

