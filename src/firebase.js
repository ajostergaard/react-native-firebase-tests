import firebase from 'firebase';
import RNfirebase from 'react-native-firebase';

const config = {
  apiKey: "AIzaSyDnVqNhxU0Biit9nCo4RorAh5ulQQwko3E",
  authDomain: "rnfirebase-b9ad4.firebaseapp.com",
  databaseURL: "https://rnfirebase-b9ad4.firebaseio.com",
  storageBucket: "rnfirebase-b9ad4.appspot.com",
  messagingSenderId: "305229645282"
};

const instances = {
  web: firebase.initializeApp(config),
  native: RNfirebase.initializeApp(),
};

instances.web.database().ref('tests/types').set({
  array: [
    0,1,2,3,4,5,6,7,8,9,
  ],
  boolean: true,
  string: 'foobar',
  number: 123567890,
});

export default instances;
