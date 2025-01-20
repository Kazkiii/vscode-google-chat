import * as vscode from 'vscode';
import { authenticate } from './auth';
import * as chatAPI from './chat';

export function createWebView(context: vscode.ExtensionContext, webviewView: vscode.WebviewView) {
  webviewView.webview.options = { enableScripts: true };

	const scriptUri = webviewView.webview.asWebviewUri(
		vscode.Uri.joinPath(context.extensionUri, 'media', 'webview.js')
	);
	webviewView.webview.html = getWebviewHTML(scriptUri);

	webviewView.webview.onDidReceiveMessage(async (message) => {
		if (message.command === 'authenticate') {
			await authenticate();
			webviewView.webview.postMessage({ command: 'authenticated' });
		} else if (message.command === 'loadSpaces') {
			const spaces = await chatAPI.listSpaces();
			webviewView.webview.postMessage({ command: 'spacesLoaded', spaces });
		} else if (message.command === 'loadChatHistory' && message.spaceId) {
			const { spaceId, pageToken } = message;
			const history = await chatAPI.getChatHistory(spaceId, pageToken);
			webviewView.webview.postMessage({ command: 'chatHistoryLoaded', messages: history?.messages ?? [], nextPageToken: history?.nextPageToken });
		} else if (message.command === 'sendMessage' && message.spaceId && message.text) {
			await chatAPI.sendMessage(message.spaceId, message.text);
			webviewView.webview.postMessage({ command: 'messageSent' });
		}
	});
}

function getWebviewHTML(scriptUri: vscode.Uri) {
	return `
		<html>
			<head>
				<style>
					body {
						font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
						margin: 0;
						padding: 0;
						background-color: #1e1e1e;
						color: #d4d4d4;
					}
					.chat-header {
						display: flex;
						align-items: center;
						padding: 10px;
						background-color: #252526;
						border-bottom: 1px solid #333;
					}
					.chat-header select {
						flex: 1;
						background-color: #3c3c3c;
						color: #d4d4d4;
						border: 1px solid #555;
						padding: 5px;
						border-radius: 4px;
					}
					.chat-header button {
						background: none;
						border: none;
						cursor: pointer;
						padding: 0;
						color: #d4d4d4;
						margin-left: 10px;
					}
					.chat-header button:hover {
						color: #ffffff;
					}
					.chat-messages {
						height: 400px;
						overflow-y: auto;
						border: 1px solid #333;
						padding: 10px;
						background-color: #1e1e1e;
					}
					.chat-input {
						display: flex;
						padding: 10px;
						background-color: #252526;
						border-top: 1px solid #333;
					}
					.chat-input textarea {
						flex: 1;
						resize: none;
						background-color: #3c3c3c;
						color: #d4d4d4;
						border: 1px solid #555;
						padding: 5px;
						border-radius: 4px;
					}
					.chat-input button {
						margin-left: 8px;
						background: none;
						border: none;
						cursor: pointer;
						padding: 0;
						color: #d4d4d4;
					}
					.chat-input button:hover {
						color: #ffffff;
					}
					.icon-button svg {
						width: 24px;
						height: 24px;
					}
					#auth-button {
						display: block;
						margin-top: 20px;
						padding: 10px 20px;
						font-size: 16px;
						color: #ffffff;
						background-color: #007acc;
						border: none;
						border-radius: 4px;
						cursor: pointer;
					}
					#auth-button:hover {
						background-color: #005a9e;
					}
					.chat-messages div {
						margin-bottom: 10px;
						padding: 5px;
						border-bottom: 1px solid #333;
					}
					.chat-messages div span {
						font-size: 0.8em;
						color: #888;
					}
				</style>
			</head>
			<body>
				<div class="chat-header">
					<select id="spaces-dropdown"></select>
					<button id="refresh-button" class="icon-button" title="Refresh">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="23 4 23 10 17 10"></polyline>
							<polyline points="1 20 1 14 7 14"></polyline>
							<path d="M3.51 9a9 9 0 0114.36-6.36L23 10M1 14l5.64 5.64A9 9 0 0020.49 15"></path>
						</svg>
					</button>
				</div>
				<div class="chat-messages" id="chat-messages">
					Please authenticate to load chats.
					<button id="auth-button">Authenticate with Google Chat</button>
				</div>
				<div class="chat-input">
					<textarea id="message-box" rows="3"></textarea>
					<button id="send-button" class="icon-button" title="Send">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="22" y1="2" x2="11" y2="13"></line>
							<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
						</svg>
					</button>
				</div>
				<script src="${scriptUri}"></script>
			</body>
		</html>
	`;
}
