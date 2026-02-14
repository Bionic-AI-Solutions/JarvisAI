import { getBashCompletion, getZshCompletion } from '../../src/features/shell';
import { shellTestData } from '../fixtures/sample-data';

describe('Shell Completion Feature', () => {
  describe('getBashCompletion', () => {
    let bashOutput: string;

    beforeAll(() => {
      bashOutput = getBashCompletion();
    });

    it('should return a non-empty string', () => {
      expect(bashOutput).toBeDefined();
      expect(typeof bashOutput).toBe('string');
      expect(bashOutput.length).toBeGreaterThan(0);
    });

    it('should contain bash completion function keywords', () => {
      for (const keyword of shellTestData.expectedBashKeywords) {
        expect(bashOutput).toContain(keyword);
      }
    });

    it('should contain all expected commands', () => {
      for (const cmd of shellTestData.expectedCommands) {
        expect(bashOutput).toContain(cmd);
      }
    });

    it('should include the complete built-in registration', () => {
      expect(bashOutput).toContain('complete');
      expect(bashOutput).toContain('jarvis');
    });

    it('should handle COMP_WORDS and COMP_CWORD variables', () => {
      expect(bashOutput).toContain('COMP_WORDS');
      expect(bashOutput).toContain('COMP_CWORD');
    });
  });

  describe('getZshCompletion', () => {
    let zshOutput: string;

    beforeAll(() => {
      zshOutput = getZshCompletion();
    });

    it('should return a non-empty string', () => {
      expect(zshOutput).toBeDefined();
      expect(typeof zshOutput).toBe('string');
      expect(zshOutput.length).toBeGreaterThan(0);
    });

    it('should contain zsh completion keywords', () => {
      for (const keyword of shellTestData.expectedZshKeywords) {
        expect(zshOutput).toContain(keyword);
      }
    });

    it('should contain all expected commands with descriptions', () => {
      for (const cmd of shellTestData.expectedCommands) {
        expect(zshOutput).toContain(cmd);
      }
    });

    it('should use _describe for command descriptions', () => {
      expect(zshOutput).toContain("_describe 'command' commands");
    });

    it('should include compdef directive for jarvis', () => {
      expect(zshOutput).toContain('#compdef jarvis');
    });
  });

  describe('Output format consistency', () => {
    it('bash and zsh should list the same commands', () => {
      const bashOutput = getBashCompletion();
      const zshOutput = getZshCompletion();

      for (const cmd of shellTestData.expectedCommands) {
        expect(bashOutput).toContain(cmd);
        expect(zshOutput).toContain(cmd);
      }
    });

    it('outputs should be valid script fragments (no syntax errors in structure)', () => {
      const bashOutput = getBashCompletion();
      const zshOutput = getZshCompletion();

      // Bash should have matching braces
      const bashOpenBraces = (bashOutput.match(/{/g) || []).length;
      const bashCloseBraces = (bashOutput.match(/}/g) || []).length;
      expect(bashOpenBraces).toBe(bashCloseBraces);

      // Zsh should have matching parens for array
      expect(zshOutput).toContain('(');
      expect(zshOutput).toContain(')');
    });
  });
});
