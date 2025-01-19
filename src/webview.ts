import * as vscode from 'vscode';
import { authenticate } from './auth';
import * as chatAPI from './chat';

export function createWebView(context: vscode.ExtensionContext) {
  const webviewPanel = vscode.window.createWebviewPanel(
    'googleChat',
    'Google Chat',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

	const scriptUri = webviewPanel.webview.asWebviewUri(
		vscode.Uri.joinPath(context.extensionUri, 'media', 'webview.js')
	);
	webviewPanel.webview.html = getWebviewHTML(scriptUri);

	webviewPanel.webview.onDidReceiveMessage(async (message) => {
		if (message.command === 'authenticate') {
			await authenticate();
			webviewPanel.webview.postMessage({ command: 'authenticated' });
		} else if (message.command === 'loadSpaces') {
			const spaces = await chatAPI.listSpaces();
			webviewPanel.webview.postMessage({ command: 'spacesLoaded', spaces });
		} else if (message.command === 'loadChatHistory' && message.spaceId) {
			const { spaceId, pageToken } = message;
			const history = await chatAPI.getChatHistory(spaceId, pageToken);
			webviewPanel.webview.postMessage({ command: 'chatHistoryLoaded', messages: history?.messages ?? [], nextPageToken: history?.nextPageToken });
		} else if (message.command === 'sendMessage' && message.spaceId && message.text) {
			await chatAPI.sendMessage(message.spaceId, message.text);
			webviewPanel.webview.postMessage({ command: 'messageSent' });
		}
	});
}

function getWebviewHTML(scriptUri: vscode.Uri) {
	return `
		<html>
		<head>
			<style>
				.chat-header { display: flex; align-items: center; }
				.chat-header select { margin-right: 8px; }
				.chat-messages { height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 8px; margin-bottom: 8px; }
				.chat-input { display: flex; }
				.chat-input textarea { flex: 1; resize: none; }
				.chat-input button { margin-left: 8px; }
			</style>
		</head>
		<body>
			<div class="chat-header">
				<select id="spaces-dropdown"></select>
				<button id="refresh-button">Refresh</button>
			</div>
			<div class="chat-messages" id="chat-messages">Please authenticate to load chats.</div>
			<div class="chat-input">
				<textarea id="message-box" rows="3"></textarea>
				<button id="send-button">Send</button>
			</div>
			<button id="auth-button">Authenticate</button>
			<script src="${scriptUri}"></script>
		</body>
		</html>
	`;
}
