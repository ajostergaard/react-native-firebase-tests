import TestSuite from '~/TestSuite';

const Suite = new TestSuite('Realtime Database', 'Read/Write database tests');
console.log(Suite);
const { before, after, beforeEach, afterEach, describe } = Suite;

before(() => {
  console.log('before hook');
});

beforeEach(() => {
  console.log('beforeEach hook')
});

afterEach(() => {
  console.log('afterEach hook')
});

after(() => {
  console.log('after hook')
});

describe('it should return true with a really really really really really really really really really long description', 'read', async() => {
  return Promise.resolve('SUCCESS');
});


describe('it should return a value', 'read', async(test, state) => {
  return Promise.resolve('SUCCESS');
});


describe('it should return another value', 'yada', async() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return reject(new Error('ERROR!'));
    }, 1500);
  });
});

describe('it should return an error after 3 seconds', async() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return reject(new Error('ERROR!'));
    }, 3000);
  });
});


export default Suite;

