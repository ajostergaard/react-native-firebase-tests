import TestSuite from '~/TestSuite';

const Suite = new TestSuite('Realtime Database', 'Read/Write database tests');
const { describe } = Suite;

describe('it should return true with a really really really really really really really really really long description', 'read', async() => {
  return Promise.resolve('SUCCESS');
});


describe('it should return woo', 'read', async() => {
  return Promise.resolve('woo');
});


describe('it should return boo', 'yada', async() => {
  return Promise.resolve('boo');
});

describe('it should return false', async() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return reject(new Error('ELLIOT!'));
    }, 3000);
  });
});


export default Suite;

