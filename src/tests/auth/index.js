import TestSuite from '~/TestSuite';
import should from 'should';

const suite = new TestSuite('Auth', 'firebase.auth()', { concurrency: 1 });
const { tryCatch, describe, firebase, beforeEach } = suite;

function randomString(length, chars) {
  let mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz01234567890';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  let result = '';
  for (let i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
  return result;
}

describe('it should sign in anonymously', 'Anonymous', () => {
  const successCb = (currentUser) => {
    currentUser.should.be.an.Object();
    currentUser.uid.should.be.a.String();
    currentUser.toJSON().should.be.an.Object();
    should.equal(currentUser.toJSON().email, null)
    currentUser.isAnonymous.should.equal(true);
    currentUser.providerId.should.equal('firebase');

    firebase.native.auth().currentUser.uid.should.be.a.String();

    return firebase.native.auth().signOut();
  };

  return firebase.native.auth()
    .signInAnonymously()
    .then(successCb);
});

describe('it should sign in with email and password', 'Email', () => {
  const successCb = (currentUser) => {
    currentUser.should.be.an.Object();
    currentUser.uid.should.be.a.String();
    currentUser.toJSON().should.be.an.Object();
    should.equal(currentUser.toJSON().email, null)
    currentUser.isAnonymous.should.equal(true);
    currentUser.providerId.should.equal('firebase');

    firebase.native.auth().currentUser.uid.should.be.a.String();

    return firebase.native.auth().signOut();
  };

  return firebase.native.auth()
    .signInWithEmailAndPassword('test@test.com', 'test1234')
    .then(successCb);
});


describe('it should create a user with an email and password and delete after', 'Email', () => {
  const random = randomString(12, '#aA');
  const email = `${random}@${random}.com`;
  const pass = random;

  return new Promise((resolve, reject) => {
    const successCb = tryCatch((newUser) => {
      newUser.uid.should.be.a.String();
      newUser.email.should.equal(email.toLowerCase());
      newUser.emailVerified.should.equal(false);
      newUser.isAnonymous.should.equal(false);
      newUser.providerId.should.equal('firebase');
      firebase.native.auth().currentUser.delete().then(resolve).catch(reject);
    }, reject);

    const failureCb = tryCatch(error => {
      reject(error);
    }, reject);


    firebase.native.auth().createUserWithEmailAndPassword(email, pass).then(successCb).catch(failureCb);
  });
});

describe('it should reject signOut if no currentUser', 'Misc', () => {
  return new Promise((resolve, reject) => {
    if (firebase.native.auth().currentUser) {
      return reject(new Error(`A user is currently signed in. ${firebase.native.auth().currentUser.uid}`));
    }

    const successCb = tryCatch(() => {
      reject(new Error('No signOut error returned'));
    }, reject);

    const failureCb = tryCatch(error => {
      error.code.should.equal('auth/no_current_user');
      error.message.should.equal('No user currently signed in.');
      resolve();
    }, reject);


    firebase.native.auth().signOut().then(successCb).catch(failureCb);
  });
});

export default suite;
