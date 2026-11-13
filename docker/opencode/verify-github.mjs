const token = process.env.HERMES_GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_AUTH_MISSING');
  process.exit(2);
}

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'User-Agent': 'HermesWeb-R2-Auth-Check',
  'X-GitHub-Api-Version': '2022-11-28'
};

try {
  const identity = await fetch('https://api.github.com/user', { headers });
  if (!identity.ok) {
    console.error(`GITHUB_AUTH_FAILED_HTTP_${identity.status}`);
    process.exit(1);
  }
  const repository = await fetch('https://api.github.com/repos/undercodeec/hermes-web', { headers });
  if (!repository.ok) {
    console.error(`GITHUB_REPOSITORY_ACCESS_FAILED_HTTP_${repository.status}`);
    process.exit(1);
  }
  const metadata = await repository.json();
  if (metadata.full_name !== 'undercodeec/hermes-web') {
    console.error('GITHUB_REPOSITORY_IDENTITY_MISMATCH');
    process.exit(1);
  }
  if (metadata.permissions?.push === false) {
    console.error('GITHUB_ACCOUNT_PUSH_PERMISSION_DENIED');
    process.exit(1);
  }
  const accountPush = metadata.permissions?.push === true ? 'yes' : 'unknown';
  console.log(`GITHUB_AUTH_OK: identity and repository access confirmed; account_push=${accountPush}`);
} catch (error) {
  console.error(`GITHUB_AUTH_NETWORK_ERROR: ${error instanceof Error ? error.name : 'unknown'}`);
  process.exit(1);
}
