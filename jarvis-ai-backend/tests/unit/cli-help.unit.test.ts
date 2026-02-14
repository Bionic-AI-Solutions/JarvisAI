import { helpService, HelpService } from '../../src/features/cli-help';
import { cliHelpTestData } from '../fixtures/sample-data';

describe('CLI Help Feature', () => {
  describe('HelpService class', () => {
    let service: HelpService;

    beforeEach(() => {
      // Create a fresh instance for each test
      service = new HelpService();
    });

    describe('registerCommand', () => {
      it('should register a command successfully', () => {
        const cmd = cliHelpTestData.commands[0];
        service.registerCommand(cmd.name, cmd);

        const help = service.getHelp(cmd.name);
        expect(help).toContain(cmd.name);
        expect(help).toContain(cmd.description);
      });

      it('should register multiple commands', () => {
        for (const cmd of cliHelpTestData.commands) {
          service.registerCommand(cmd.name, cmd);
        }

        for (const cmd of cliHelpTestData.commands) {
          const help = service.getHelp(cmd.name);
          expect(help).toContain(cmd.name);
        }
      });

      it('should overwrite existing command with same name', () => {
        const original = cliHelpTestData.commands[0];
        const updated = {
          ...original,
          description: 'Updated description',
        };

        service.registerCommand(original.name, original);
        service.registerCommand(original.name, updated);

        const help = service.getHelp(original.name);
        expect(help).toContain('Updated description');
      });
    });

    describe('getHelp', () => {
      beforeEach(() => {
        for (const cmd of cliHelpTestData.commands) {
          service.registerCommand(cmd.name, cmd);
        }
      });

      it('should return help text for registered command', () => {
        const cmd = cliHelpTestData.commands[0]; // create
        const help = service.getHelp(cmd.name);

        expect(help).toContain(cmd.name);
        expect(help).toContain(cmd.description);
      });

      it('should include usage information', () => {
        const cmd = cliHelpTestData.commands[0];
        const help = service.getHelp(cmd.name);

        expect(help).toContain('USAGE');
        expect(help).toContain(cmd.usage);
      });

      it('should include options', () => {
        const cmd = cliHelpTestData.commands[0]; // create has options
        const help = service.getHelp(cmd.name);

        expect(help).toContain('OPTIONS');
        for (const opt of cmd.options) {
          expect(help).toContain(opt.flag);
          expect(help).toContain(opt.description);
        }
      });

      it('should include examples', () => {
        const cmd = cliHelpTestData.commands[0];
        const help = service.getHelp(cmd.name);

        expect(help).toContain('EXAMPLES');
        for (const example of cmd.examples) {
          expect(help).toContain(example);
        }
      });

      it('should return "Command not found" for unknown command', () => {
        const help = service.getHelp(cliHelpTestData.unknownCommand);

        expect(help).toContain('Command not found');
        expect(help).toContain(cliHelpTestData.unknownCommand);
      });

      it('should handle command with no options gracefully', () => {
        service.registerCommand('simple', {
          name: 'simple',
          description: 'A simple command',
          usage: 'jarvis simple',
          // no options
          // no examples
        });

        const help = service.getHelp('simple');
        expect(help).toContain('simple');
        expect(help).toContain('A simple command');
        // Should not throw
      });
    });
  });

  describe('helpService singleton', () => {
    it('should be an instance of HelpService', () => {
      expect(helpService).toBeInstanceOf(HelpService);
    });

    it('should be a singleton (same reference)', () => {
      // Import again to verify same instance
      const { helpService: sameInstance } = require('../../src/features/cli-help');
      expect(sameInstance).toBe(helpService);
    });

    it('should work with registerCommand and getHelp', () => {
      const testCmd = {
        name: 'test-singleton',
        description: 'Test singleton command',
        usage: 'jarvis test-singleton',
        options: [],
        examples: ['jarvis test-singleton'],
      };

      helpService.registerCommand(testCmd.name, testCmd);
      const help = helpService.getHelp(testCmd.name);

      expect(help).toContain(testCmd.name);
      expect(help).toContain(testCmd.description);
    });
  });
});
