const CATEGORY = 'Snapshot';

export default function addTests({ tryCatch, describe, firebase }) {
  describe('should provide a functioning val() method', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        snapshot.val.should.be.a.Function();
        snapshot.val().should.eql([
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        ]);
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/array').once('value', successCb, reject);
    });
  });

  describe('should provide a functioning child() method', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        snapshot.child('0').val.should.be.a.Function();
        snapshot.child('0').val().should.equal(0);
        snapshot.child('0').key.should.be.a.String();
        snapshot.child('0').key.should.equal('0');
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/array').once('value', successCb, reject);
    });
  });

  describe('should provide a functioning hasChild() method', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        snapshot.hasChild.should.be.a.Function();
        snapshot.hasChild('foo').should.equal(true);
        snapshot.hasChild('baz').should.equal(false);
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/object').once('value', successCb, reject);
    });
  });

  describe('should provide a functioning hasChildren() method', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        snapshot.hasChildren.should.be.a.Function();
        snapshot.hasChildren().should.equal(true);
        snapshot.child('foo').hasChildren().should.equal(false);
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/object').once('value', successCb, reject);
    });
  });

  describe('should provide a functioning exists() method', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        snapshot.exists.should.be.a.Function();
        snapshot.exists().should.equal(false);
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/object/baz/daz').once('value', successCb, reject);
    });
  });

  describe('should provide a functioning forEach() method', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        let total = 0;
        snapshot.forEach.should.be.a.Function();
        snapshot.forEach((childSnapshot, i) => {
          i.should.be.a.Number();
          total = total + childSnapshot.val();
        });
        total.should.equal(45); // 45 = 0 to 9 added
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/object/baz/daz').once('value', successCb, reject);
    });
  });

  describe('should provide a key property', CATEGORY, () => {
    return new Promise((resolve, reject) => {
      const successCb = tryCatch((snapshot) => {
        snapshot.key.should.be.a.String();
        snapshot.key.should.equal('array');
        resolve();
      }, reject);

      firebase.native.database().ref('tests/types/array').once('value', successCb, reject);
    });
  });
}
