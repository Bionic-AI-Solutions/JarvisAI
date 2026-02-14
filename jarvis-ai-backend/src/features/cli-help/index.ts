// CLI Help feature placeholder
export class HelpService {
  private commands: Map<string, any> = new Map();

  registerCommand(name: string, metadata: any) {
    this.commands.set(name, metadata);
  }

  getHelp(commandName: string): string {
    const cmd = this.commands.get(commandName);
    if (!cmd) {
      return `Command not found: ${commandName}`;
    }

    return `
${cmd.name} - ${cmd.description}

USAGE:
  ${cmd.usage}

OPTIONS:
  ${cmd.options?.map((o: any) => `${o.flag}  ${o.description}`).join('\n  ') || 'None'}

EXAMPLES:
  ${cmd.examples?.map((e: any) => `$ ${e}`).join('\n  ') || 'None'}
`;
  }
}

export const helpService = new HelpService();
