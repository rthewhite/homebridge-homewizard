import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import {Logger} from './../src/logger';

describe('Class Logger', () => {
  describe('Constructor', () => {
    it('Should thrown an error if no log function is passed', () => {
      const construct = () => {
        const logger = new Logger(); //eslint-disable-line
      };
      expect(construct).to.throw('No log function passed to logger constructor');
    });

    it('Should accept logLevel parameter', () => {
      let logger = new Logger(sinon.spy(), 2);
      expect(logger.logLevel).to.equal(2);

      logger = new Logger(sinon.spy(), 100);
      expect(logger.logLevel).to.equal(100);
    });
  });

  describe('Check interface of Logger instance', () => {
    const logger = new Logger(sinon.spy());

    it('Error function', () => {
      expect(logger.error).to.be.a('function');
    });

    it('Warn function', () => {
      expect(logger.warn).to.be.a('function');
    });

    it('Info function', () => {
      expect(logger.info).to.be.a('function');
    });

    it('Debug function', () => {
      expect(logger.debug).to.be.a('function');
    });
  });

  describe('Test log levels', () => {
    let logSpy;
    let logger;

    beforeEach(() => {
      logSpy = sinon.spy();
      logger = new Logger(logSpy);
    });

    it('Error logs should be logged at level 0', () => {
      const msg = 'Some error';
      logger.logLevel = 0;
      logger.error(msg);
      expect(logSpy).to.have.been.calledWith(msg);
    });

    it('Error logs should be logged at level 1', () => {
      const msg = 'Some error';
      logger.logLevel = 1;
      logger.error(msg);
      expect(logSpy).to.have.been.calledWith(msg);
    });

    it('Error logs should be logged at level 2', () => {
      const msg = 'Some error';
      logger.logLevel = 2;
      logger.error(msg);
      expect(logSpy).to.have.been.calledWith(msg);
    });

    it('Warn logs should be logged at level 0', () => {
      const msg = 'Some warning';
      logger.logLevel = 0;
      logger.warn(msg);
      expect(logSpy).to.have.been.calledWith(msg);
    });

    it('Warn logs should be logged at level 1', () => {
      const msg = 'Some warning';
      logger.logLevel = 1;
      logger.warn(msg);
      expect(logSpy).to.have.been.calledWith(msg);
    });

    it('Warn logs should be logged at level 2', () => {
      const msg = 'Some warning';
      logger.logLevel = 2;
      logger.warn(msg);
      expect(logSpy).to.have.been.calledWith(msg);
    });

    it('Info logs should not be logged at level 0', () => {
      const msg = 'Some info';
      logger.logLevel = 0;
      logger.info(msg);
      expect(logSpy.callCount).to.equal(0);
    });

    it('Info logs should be logged at level 1', () => {
      const msg = 'Some info';
      logger.logLevel = 1;
      logger.info(msg);
      expect(logSpy).to.have.been.calledWith(msg);
    });

    it('Info logs should be logged at level 2', () => {
      const msg = 'Some error';
      logger.logLevel = 3;
      logger.error(msg);
      expect(logSpy).to.have.been.calledWith(msg);
    });

    it('Debug logs should not be logged at level 0', () => {
      logger.logLevel = 0;
      logger.debug('foobar');
      expect(logSpy.callCount).to.equal(0);
    });

    it('Debug logs should not be logged at level 1', () => {
      logger.logLevel = 1;
      logger.debug('foobar');
      expect(logSpy.callCount).to.equal(0);
    });

    it('Debug logs should be logged at level 2', () => {
      const msg = 'debug message';
      logger.logLevel = 3;
      logger.debug(msg);
      expect(logSpy).to.have.been.calledWith(msg);
    });
  });
});
