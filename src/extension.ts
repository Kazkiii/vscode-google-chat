import * as vscode from 'vscode';
import { createWebView } from './webview';

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('extension.openGoogleChat', () => {
		createWebView(context);
	});

	context.subscriptions.push(
		vscode.commands.registerCommand('googleChat.openPanel', () => {
			vscode.commands.executeCommand('workbench.view.extension.googleChat');
		})
	);
}

export function deactivate() {}
