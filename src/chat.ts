import * as vscode from 'vscode';
import { getOAuth2Client } from './auth';
import { chat } from '@googleapis/chat';

export async function listSpaces() {
  const authClient = getOAuth2Client();
  if (!authClient) {
    vscode.window.showErrorMessage('Failed to authenticate');
    return;
  }

  const chatClient = chat({ version: 'v1', auth: authClient });
  const response = await chatClient.spaces.list();

  if (response.status === 429) {
    vscode.window.showErrorMessage('Rate limit exceeded. Please try again later.');
    return;
  }

  if (response.status !== 200) {
    vscode.window.showErrorMessage('Failed to list spaces');
    return;
  }

  return (response.data.spaces ?? []).map(space => ({
      id: space.name,
      name: space.displayName || 'Direct Message',
  }));
}

export async function getChatHistory(spaceId: string, pageToken?: string) {
  const pageSize = 20;
  const authClient = getOAuth2Client();
  if (!authClient) {
    vscode.window.showErrorMessage('Failed to authenticate');
    return;
  }
  
  const chatClient = chat({ version: 'v1', auth: authClient });
  const response = await chatClient.spaces.messages.list({ parent: spaceId, pageSize, pageToken });

  if (response.status === 429) {
    vscode.window.showErrorMessage('Rate limit exceeded. Please try again later.');
    return;
  }

  if (response.status !== 200) {
    vscode.window.showErrorMessage('Failed to get chat history');
    return;
  }

  const messages = (response.data.messages ?? []).map(message => ({
      text: message.text || 'This is non-compliant media information.',
  }));

  return {
    messages,
    nextPageToken: response.data.nextPageToken || null
  };
}

export async function sendMessage(spaceId: string, text: string) {
  const authClient = getOAuth2Client();
  if (!authClient) {
    vscode.window.showErrorMessage('Failed to authenticate');
    return;
  }

  const chatClient = chat({ version: 'v1', auth: authClient });
  const response = await chatClient.spaces.messages.create({
    parent: spaceId,
    requestBody: {
        text,
    },
  });

  if (response.status === 429) {
    vscode.window.showErrorMessage('Rate limit exceeded. Please try again later.');
    return;
  }

  if (response.status !== 200) {
    vscode.window.showErrorMessage('Failed to send message');
    return;
  }
}
