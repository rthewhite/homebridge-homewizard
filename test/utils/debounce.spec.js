import 'babel-polyfill';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import {debounce} from './../../src/utils/debounce.js';

describe('debounce decorator', () => {
  it('debounce should be a function', () => {
    expect(debounce).to.be.a('function');
  });

  it('debounced function should maintain this scope', () => {
    let scopeVariable;

    class Test {
      foobar = 'foobar';

      @debounce()
      decoratorTest () {
        scopeVariable = this.foobar;
      }
    }

    const testClass = new Test();
    testClass.decoratorTest();
    expect(scopeVariable).to.equal('foobar');
  });

  it('function calls should be debounced', done => {
    let counter = 0;

    class Test {
      @debounce()
      decoratorTest () {
        counter += 1;
      }
    }

    const testClass = new Test();

    testClass.decoratorTest();
    testClass.decoratorTest();
    testClass.decoratorTest();
    testClass.decoratorTest();
    testClass.decoratorTest();

    setTimeout(() => {
      expect(counter).to.equal(2);
      done();
    }, 600);
  });

  it('function should be called directly again after waiting period', done => {
    let counter = 0;

    class Test {
      @debounce()
      decoratorTest () {
        counter += 1;
      }
    }

    const testClass = new Test();

    testClass.decoratorTest();
    testClass.decoratorTest();
    testClass.decoratorTest();
    testClass.decoratorTest();
    testClass.decoratorTest();

    setTimeout(() => {
      expect(counter).to.equal(2);
      testClass.decoratorTest();
      expect(counter).to.equal(3);
      done();
    }, 600);
  });

  it('should be able to pass the waiting time', done => {
    let counter = 0;

    class Test {
      @debounce(100)
      decoratorTest () {
        counter += 1;
      }
    }

    const testClass = new Test();

    testClass.decoratorTest();
    testClass.decoratorTest();
    testClass.decoratorTest();

    setTimeout(() => {
      expect(counter).to.equal(2);
      testClass.decoratorTest();
      expect(counter).to.equal(3);
      done();
    }, 110);
  });

  it('should call the callback if first or second argument is a function', () => {
    class Test {
      @debounce(0)
      decoratorTest () {}
    }
    const spy = sinon.spy();
    const testClass = new Test();

    testClass.decoratorTest(spy);
    testClass.decoratorTest(null, spy);
    expect(spy.callCount).to.equal(2);
  });

  it('should also call the callback for debounced functions', () => {
    class Test {
      @debounce()
      decoratorTest () {}
    }

    const testClass = new Test();
    const spy = sinon.spy();

    testClass.decoratorTest(spy);
    testClass.decoratorTest(spy);
    testClass.decoratorTest(spy);

    expect(spy.callCount).to.equal(3);
  });

  it('shouldnt call the callback when set to false', () => {
    class Test {
      @debounce(200, false)
      decoratorTest () {}
    }

    const testClass = new Test();
    const spy = sinon.spy();

    testClass.decoratorTest(spy);
    testClass.decoratorTest(spy);
    testClass.decoratorTest(spy);

    expect(spy.callCount).to.equal(0);
  });
});
