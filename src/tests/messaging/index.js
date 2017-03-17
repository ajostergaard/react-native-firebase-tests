import TestSuite from '~/TestSuite';
import should from 'should';

const suite = new TestSuite('Messaging', 'firebase.messaging()', { concurrency: 10 });
const { tryCatch, describe, firebase, beforeEach } = suite;

describe('it should return fcm token from getToken', 'FCM', () => {
  const successCb = (token) => {
    console.log(token);
    token.should.be.a.String();
    return Promise.resolve();
  };

  return firebase.native.messaging()
    .getToken()
    .then(successCb);
});

describe('it should create/remove onTokenRefresh listeners', 'FCM', () => {
  const cb = () => {
  };
  try {
    const listener = firebase.native.messaging().onTokenRefresh(cb);
    listener.remove();
  } catch (e) {
    console.error(e);
  }

  return Promise.resolve();
});

describe('it should subscribe/unsubscribe to topics', 'FCM', () => {
  firebase.native.messaging().subscribeToTopic('foobar');
  firebase.native.messaging().unsubscribeFromTopic('foobar');
  return Promise.resolve();
});

describe('it should show a notification', 'FCM', () => {
  firebase.messaging().createLocalNotification({
    title: "Hello",
    body: "My Notification Message",
    big_text: "Is it me you're looking for?",
    sub_text: "nope",
    show_in_foreground: true
  });

  return Promise.resolve();
});

export default suite;
