import { lstat, readdir, readFile, realpath } from 'node:fs/promises';
import { extname, isAbsolute, join, relative, resolve, sep } from 'node:path';

const ROOTS = new Set(['src', 'public', '.oc07']);
const EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.md', '.txt', '.json', '.mjs', '.svg']);
const SKIP_DIRS = new Set(['node_modules', '.next', 'out', 'dist', 'build', '.git', '.opencode']);
const SENSITIVE = /(^\.|secret|credential|token|password|private|evidence|evidencia|clientes|clients|\.env|\.pem$|\.key$|\.p12$|\.pfx$|\.sql$|\.dump$|\.log$|\.jsonl$)/i;

export async function searchLiteral({ root, query, directory = 'src', maxMatches = 30, maxFiles = 200, maxBytes = 65536 }) {
  if (typeof query !== 'string' || !query.trim() || query.length > 100) throw new Error('Invalid query');
  if (typeof directory !== 'string' || isAbsolute(directory) || /^[a-z]:/i.test(directory) || directory.startsWith('\\\\')) throw new Error('Invalid directory');
  const parts = directory.replaceAll('\\', '/').split('/');
  if (!ROOTS.has(parts[0]) || parts.some((part, index) => !part || part === '..' || part === '.' || (index > 0 && (SENSITIVE.test(part) || SKIP_DIRS.has(part))))) throw new Error('Invalid directory');
  if (!Number.isInteger(maxMatches) || maxMatches < 1 || maxMatches > 100 || !Number.isInteger(maxFiles) || maxFiles < 1 || maxFiles > 1000) throw new Error('Invalid limits');
  const base = await realpath(resolve(root));
  let cursor = base;
  for (const part of parts) {
    cursor = join(cursor, part);
    const component = await lstat(cursor);
    if (component.isSymbolicLink() || !component.isDirectory()) throw new Error('Invalid directory');
  }
  const requested = join(base, ...parts);
  const requestedStat = await lstat(requested);
  if (!requestedStat.isDirectory() || requestedStat.isSymbolicLink()) throw new Error('Invalid directory');
  const canonical = await realpath(requested);
  if (canonical !== base && !canonical.startsWith(base + sep)) throw new Error('Invalid directory');
  const results = [];
  let files = 0;
  const visit = async (dir) => {
    const entries = (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'));
    for (const entry of entries) {
      if (files >= maxFiles || results.length >= maxMatches) break;
      const name = entry.name;
      if (SKIP_DIRS.has(name) || SENSITIVE.test(name) || entry.isSymbolicLink()) continue;
      const full = join(dir, name);
      const stat = await lstat(full);
      if (stat.isSymbolicLink()) continue;
      const actual = await realpath(full);
      if (!actual.startsWith(base + sep)) continue;
      if (stat.isDirectory()) { await visit(full); continue; }
      if (!stat.isFile() || !EXTENSIONS.has(extname(name).toLowerCase()) || stat.size > maxBytes) continue;
      files++;
      const content = await readFile(full, 'utf8');
      const lines = content.split(/\r?\n/);
      for (let i = 0; i < lines.length && results.length < maxMatches; i++) {
        if (lines[i].includes(query)) results.push(`${relative(base, full).replaceAll('\\', '/')}:${i + 1}`);
      }
    }
  };
  await visit(requested);
  return results;
}
