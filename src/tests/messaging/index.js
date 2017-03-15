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


describe('it should listen/unlisten for token refresh', 'FCM', () => {
  const cb = () => {
  };
  firebase.native.messaging().listenForTokenRefresh(cb);
  firebase.native.messaging().unlistenForTokenRefresh(cb);
  return Promise.resolve();
});

describe('it should subscribe/unsubscribe to topics', 'FCM', () => {
  return firebase.native.messaging()
    .subscribeToTopic('foobar')
    .then(() => {
      return firebase.native.messaging().unsubscribeFromTopic('foobar');
    });
});

describe('it should send upstream messages', 'FCM', () => {
  // TODO - this does nothing on ios - its a stub function
  return firebase.native.messaging()
    .send({
      id: 'randomId',
      sender: `rnfirebase-b9ad4@gcm.googleapis.com`,
      ttl: 604800, // 1 week
      type: 'remote',
      data: {
        payload: JSON.stringify({ foo: 'bar' }),
      },
    });
});


export default suite;
