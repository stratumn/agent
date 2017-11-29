import { expect } from 'chai';
import { parseAgentAndProcess } from './queryString';

describe('queryString', () => {
  describe('parseAgentAndProcess', () => {
    it('parses the agent and process from a path', () => {
      [
        {
          path: '/agent/process',
          expected: { agent: 'agent', process: 'process' }
        },
        {
          path: '/agent/process/',
          expected: { agent: 'agent', process: 'process' }
        },
        {
          path: '/agent/process/bar',
          expected: { agent: 'agent', process: 'process' }
        },
        {
          path: 'agent/process',
          expected: { agent: 'agent', process: 'process' }
        },
        {
          path: '/agent',
          expected: { agent: undefined, process: undefined }
        },
        {
          path: '//process',
          expected: { agent: undefined, process: undefined }
        },
        {
          path: '//',
          expected: { agent: undefined, process: undefined }
        }
      ].forEach(({ path, expected }) => {
        expect(parseAgentAndProcess(path)).to.deep.equal(expected, path);
      });
    });
  });
});
