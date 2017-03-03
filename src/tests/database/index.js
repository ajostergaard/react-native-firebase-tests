import TestSuite from '~/TestSuite';

const Suite = new TestSuite('Realtime Database', 'Read/Write database tests');
const { describe } = Suite;

describe('it should return true with a really really really really really really really really really long description', 'read', async() => {
  return Promise.resolve('SUCCESS');
});


describe('it should return a value', 'read', async() => {
  return Promise.resolve('SUCCESS');
});


describe('it should return another value', 'yada', async() => {
  return Promise.resolve('SUCCESS');
});

describe('it should return an error after 3 seconds', async() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return reject(new Error('ERROR!'));
    }, 3000);
  });
});


export default Suite;

