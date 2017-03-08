const CATEGORY = 'Type Checks';

export default function addTests({ tryCatch, describe, firebase }) {
  describe('it should correctly return array values', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        const result = snapshot.val();
        result.should.be.an.Array();
        result.length.should.equal(10);
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/array').once('value', successCb, reject);
    });
  });

  describe('it should correctly return boolean values', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        const result = snapshot.val();
        result.should.be.a.Boolean();
        result.should.equal(true);
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/boolean').once('value', successCb, reject);
    });
  });

  describe('it should correctly return number values', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        const result = snapshot.val();
        result.should.be.a.Number();
        result.should.equal(123567890);
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/number').once('value', successCb, reject);
    });
  });

  describe('it should correctly return string values', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        const result = snapshot.val();
        result.should.be.a.String();
        result.should.equal('foobar');
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/string').once('value', successCb, reject);
    });
  });

  describe('it should correctly return objects', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        const result = snapshot.val();
        result.should.be.an.Object();
        result.should.eql({ foo: 'bar' });
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/object').once('value', successCb, reject);
    });
  });
}
