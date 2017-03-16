import TestSuite from '~/TestSuite';
import should from 'should';

const suite = new TestSuite('Auth', 'firebase.auth()', { concurrency: 1 });
const { tryCatch, describe, firebase, beforeEach } = suite;

function randomString(length, chars) {
  let mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
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
    should.equal(currentUser.toJSON().email, null);
    currentUser.isAnonymous.should.equal(true);
    currentUser.providerId.should.equal('firebase');

    firebase.native.auth().currentUser.uid.should.be.a.String();

    return firebase.native.auth().signOut();
  };

  return firebase.native.auth().signInAnonymously().then(successCb);
});

describe('it should link anonymous account <-> email account', 'Link', () => {
  const random = randomString(12, '#aA');
  const email = `${random}@${random}.com`;
  const pass = random;

  const successCb = (currentUser) => {
    currentUser.should.be.an.Object();
    currentUser.uid.should.be.a.String();
    currentUser.toJSON().should.be.an.Object();
    should.equal(currentUser.toJSON().email, null);
    currentUser.isAnonymous.should.equal(true);
    currentUser.providerId.should.equal('firebase');
    firebase.native.auth().currentUser.uid.should.be.a.String();

    const credential = firebase.native.auth().EmailAuthProvider.credential(email, pass);

    return currentUser
      .link(credential)
      .then((linkedUser) => {
        linkedUser.should.be.an.Object();
        linkedUser.uid.should.be.a.String();
        linkedUser.toJSON().should.be.an.Object();
        should.equal(linkedUser.toJSON().email, email);
        linkedUser.isAnonymous.should.equal(false);
        linkedUser.providerId.should.equal('firebase');
        return firebase.native.auth().signOut();
      }).catch((error) => {
        return firebase.native.auth().signOut().then(() => {
          return Promise.reject(error);
        })
      });
  };

  return firebase.native.auth().signInAnonymously().then(successCb);
});

describe('it should error on link anon <-> email if email already exists', 'Link', () => {
  const email = 'test@test.com';
  const pass = 'test1234';

  const successCb = (currentUser) => {
    currentUser.should.be.an.Object();
    currentUser.uid.should.be.a.String();
    currentUser.toJSON().should.be.an.Object();
    should.equal(currentUser.toJSON().email, null);
    currentUser.isAnonymous.should.equal(true);
    currentUser.providerId.should.equal('firebase');
    firebase.native.auth().currentUser.uid.should.be.a.String();

    const credential = firebase.native.auth().EmailAuthProvider.credential(email, pass);

    return currentUser
      .link(credential)
      .then(() => {
        return firebase.native.auth().signOut().then(() => {
          return Promise.reject(new Error('Did not error on link'));
        })
      }).catch((error) => {
        return firebase.native.auth().signOut().then(() => {
          error.code.should.equal('auth/email-already-in-use');
          error.message.should.equal('The email address is already in use by another account.');
          return Promise.resolve();
        })
      });
  };

  return firebase.native.auth().signInAnonymously().then(successCb);
});

describe('it should login with email and password', 'Email - Login', () => {
  const email = 'test@test.com';
  const pass = 'test1234';

  const successCb = (currentUser) => {
    currentUser.should.be.an.Object();
    currentUser.uid.should.be.a.String();
    currentUser.toJSON().should.be.an.Object();
    should.equal(currentUser.toJSON().email, 'test@test.com');
    currentUser.isAnonymous.should.equal(false);
    currentUser.providerId.should.equal('firebase');

    firebase.native.auth().currentUser.uid.should.be.a.String();

    return firebase.native.auth().signOut();
  };

  return firebase.native.auth().signInWithEmailAndPassword(email, pass).then(successCb);
});

describe('it should error on login if user is disabled', 'Email - Login', () => {
  const email = 'disabled@account.com';
  const pass = 'test1234';

  const successCb = () => {
    return Promise.reject(new Error('Did not error.'))
  };

  const failureCb = (error) => {
    error.code.should.equal('auth/user-disabled');
    error.message.should.equal('The user account has been disabled by an administrator.');
    return Promise.resolve();
  };

  return firebase.native.auth().signInWithEmailAndPassword(email, pass).then(successCb).catch(failureCb);
});

describe('it should error on login if password incorrect', 'Email - Login', () => {
  const email = 'test@test.com';
  const pass = 'test1234666';

  const successCb = () => {
    return Promise.reject(new Error('Did not error.'))
  };

  const failureCb = (error) => {
    error.code.should.equal('auth/wrong-password');
    error.message.should.equal('The password is invalid or the user does not have a password.');
    return Promise.resolve();
  };

  return firebase.native.auth().signInWithEmailAndPassword(email, pass).then(successCb).catch(failureCb);
});

describe('it should error on login if user not found', 'Email - Login', () => {
  const email = 'randomSomeone@fourOhFour.com';
  const pass = 'test1234';

  const successCb = () => {
    return Promise.reject(new Error('Did not error.'))
  };

  const failureCb = (error) => {
    error.code.should.equal('auth/user-not-found');
    error.message.should.equal('There is no user record corresponding to this identifier. The user may have been deleted.');
    return Promise.resolve();
  };

  return firebase.native.auth().signInWithEmailAndPassword(email, pass).then(successCb).catch(failureCb);
});


describe('it should create a user with an email and password', 'Email - Create', () => {
  const random = randomString(12, '#aA');
  const email = `${random}@${random}.com`;
  const pass = random;

  const successCb = (newUser) => {
    newUser.uid.should.be.a.String();
    newUser.email.should.equal(email.toLowerCase());
    newUser.emailVerified.should.equal(false);
    newUser.isAnonymous.should.equal(false);
    newUser.providerId.should.equal('firebase');
  };

  return firebase.native.auth().createUserWithEmailAndPassword(email, pass).then(successCb);
});

describe('it should delete a user', 'Misc', () => {
  const random = randomString(12, '#aA');
  const email = `${random}@${random}.com`;
  const pass = random;

  const successCb = (newUser) => {
    newUser.uid.should.be.a.String();
    newUser.email.should.equal(email.toLowerCase());
    newUser.emailVerified.should.equal(false);
    newUser.isAnonymous.should.equal(false);
    newUser.providerId.should.equal('firebase');
    return firebase.native.auth().currentUser.delete();
  };

  return firebase.native.auth().createUserWithEmailAndPassword(email, pass).then(successCb);
});

describe('it should return a token via getToken', 'Misc', () => {
  const random = randomString(12, '#aA');
  const email = `${random}@${random}.com`;
  const pass = random;

  const successCb = (newUser) => {
    newUser.uid.should.be.a.String();
    newUser.email.should.equal(email.toLowerCase());
    newUser.emailVerified.should.equal(false);
    newUser.isAnonymous.should.equal(false);
    newUser.providerId.should.equal('firebase');
    return newUser.getToken().then((token) => {
      console.warn(token);
      token.should.be.a.String();
      should.equal(token.length > 24, true);
      return firebase.native.auth().currentUser.delete();
    })
  };

  return firebase.native.auth().createUserWithEmailAndPassword(email, pass).then(successCb);
});

describe('it should error on create with invalid email', 'Email - Create', () => {
  const random = randomString(12, '#aA');
  const email = `${random}${random}.com.boop.shoop`;
  const pass = random;

  const successCb = () => {
    return Promise.reject(new Error('Did not error.'))
  };

  const failureCb = (error) => {
    error.code.should.equal('auth/invalid-email');
    error.message.should.equal('The email address is badly formatted.');
    return Promise.resolve();
  };

  return firebase.native.auth().createUserWithEmailAndPassword(email, pass).then(successCb).catch(failureCb);
});

describe('it should error on create if email in use', 'Email - Create', () => {
  const email = 'test@test.com';
  const pass = 'test123456789';

  const successCb = () => {
    return Promise.reject(new Error('Did not error.'))
  };

  const failureCb = (error) => {
    error.code.should.equal('auth/email-already-in-use');
    error.message.should.equal('The email address is already in use by another account.');
    return Promise.resolve();
  };

  return firebase.native.auth().createUserWithEmailAndPassword(email, pass).then(successCb).catch(failureCb);
});

describe('it should error on create if password weak', 'Email - Create', () => {
  const email = 'testy@testy.com';
  const pass = '123';

  const successCb = () => {
    return Promise.reject(new Error('Did not error.'))
  };

  const failureCb = (error) => {
    error.code.should.equal('auth/weak-password');
    // cannot test this message - it's different on the web client than ios/android return
    // error.message.should.equal('The given password is invalid.');
    return Promise.resolve();
  };

  return firebase.native.auth().createUserWithEmailAndPassword(email, pass).then(successCb).catch(failureCb);
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
