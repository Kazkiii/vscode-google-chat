import * as vscode from 'vscode';
import chat from '@googleapis/chat';
import http from 'http';
import url from 'url';
import destroyer from 'server-destroy';

const LOCAL_HOST = 'http://localhost:3000';

export function getOAuth2Client() {
  const config = getConfiguration();
  if (!config) {
    vscode.window.showErrorMessage('Failed to get extension settings');
    return;
  }
  return new chat.auth.OAuth2(config.CLIENT_ID, config.CLIENT_SECRET, LOCAL_HOST);
}

export async function authenticate() {
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client) {
    vscode.window.showErrorMessage('Failed to authenticate');
    return;
  }

  const scopes = ["https://www.googleapis.com/auth/chat"];
  const open = (await import('open')).default;
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
  });

  vscode.window.showInformationMessage(`Open the following URL to authenticate:\n${authorizeUrl}`);

  new Promise((resolve, reject) => {
    const server = http
      .createServer(async (req, res) => {
        try {
          if (!req.url) throw Error('Unexpected Error: Url does not exist');
          const qs = new url.URL(req.url, LOCAL_HOST).searchParams;
          res.end('Authentication successful! Please return to the console.');
          server.destroy();
          const code = qs.get('code');
          if (!code) throw new Error('Unexpected Error: Authentication code does not exist');
          const { tokens } = await oAuth2Client.getToken(code);
          oAuth2Client.setCredentials(tokens);
          vscode.window.showInformationMessage('Authentication successful!');
          resolve(oAuth2Client);
        } catch (e) {
          vscode.window.showErrorMessage(`Authentication failed : ${e}`);
          reject(e);
        }
      })
      .listen(3000, () => open(authorizeUrl, { wait: false }).then(cp => cp.unref()));
    destroyer(server);
  });
}

function getConfiguration() {
  const configuration = vscode.workspace.getConfiguration('googleChat');
  const CLIENT_ID = configuration.get<'string'>('clientId');
  const CLIENT_SECRET = configuration.get<'string'>('clientSecret');

  if (!CLIENT_ID || !CLIENT_SECRET) {
    vscode.window.showErrorMessage('Please configure ClientId and ClientSecret in the extension settings.');
    return;
  }

  return { CLIENT_ID, CLIENT_SECRET };
}
