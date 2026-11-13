import { Plugin } from '@opencode/plugin';
import { searchLiteral } from './search.mjs';

export default Plugin.define({
  id: 'oc07-search',
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.add({
        name: 'oc07_code_search',
        description: 'Busca texto literal en src, public o .oc07 y devuelve solo ruta:línea.',
        input: {
          type: 'object',
          properties: {
            query: { type: 'string' },
            directory: { type: 'string', enum: ['src', 'public', '.oc07'] }
          },
          required: ['query', 'directory'],
          additionalProperties: false
        },
        options: { codemode: false },
        execute: async (input, tool) => {
          await ctx.permission.assert({
            sessionID: tool.sessionID,
            agent: tool.agent,
            source: { type: 'tool', messageID: tool.messageID, id: tool.id },
            action: 'oc07_code_search',
            resources: ['*']
          });
          const matches = await searchLiteral({ root: ctx.location.directory, query: input.query, directory: input.directory });
          return { content: matches.join('\n') };
        }
      });
    });
  }
});
