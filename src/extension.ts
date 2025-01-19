import * as vscode from 'vscode';
import { createWebView } from './webview';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.window.registerWebviewViewProvider('googleChat.view', {
		resolveWebviewView(webviewView) {
			createWebView(context, webviewView);
		}
	}));

	context.subscriptions.push(
		vscode.commands.registerCommand('googleChat.openView', () => {
			vscode.commands.executeCommand('workbench.view.extension.googleChat');
		})
	);
}

export function deactivate() {}
