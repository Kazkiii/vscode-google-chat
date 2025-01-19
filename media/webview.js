let nextPageToken = null;
const vscode = acquireVsCodeApi();

const chatMessagesDiv = document.getElementById('chat-messages');
const spacesDropdown = document.getElementById('spaces-dropdown');

chatMessagesDiv.addEventListener('scroll', () => {
  if (chatMessagesDiv.scrollTop === 0 && nextPageToken) {
    vscode.postMessage({ command: 'loadChatHistory', spaceId: spacesDropdown.value, nextPageToken });
  }
});

document.getElementById('auth-button').addEventListener('click', () => {
  vscode.postMessage({ command: 'authenticate' });
});

document.getElementById('refresh-button').addEventListener('click', () => {
  vscode.postMessage({ command: 'loadChatHistory', spaceId: spacesDropdown.value, nextPageToken });
});

document.getElementById('send-button').addEventListener('click', () => {
  const messageBox = document.getElementById('message-box');
  vscode.postMessage({ command: 'sendMessage', spaceId: spacesDropdown.value, text: messageBox.value });
  messageBox.value = '';
});

window.addEventListener('message', (event) => {
  const data = event.data;
  if (data.command === 'authenticated') {
    document.getElementById('auth-button').style.display = 'none';
    vscode.postMessage({ command: 'loadSpaces' });
  } else if (data.command === 'spacesLoaded') {
    spacesDropdown.innerHTML = '';
    data.spaces.forEach(space => {
      const option = document.createElement('option');
      option.value = space.id;
      option.textContent = space.name;
      spacesDropdown.appendChild(option);
    });
  } else if (data.command === 'chatHistoryLoaded') {
    chatMessagesDiv.innerHTML = '';
    nextPageToken = data.nextPageToken;
    data.messages.forEach(message => {
      const div = document.createElement('div');
      div.textContent = message.text || 'This is non-compliant media information.';
      chatMessagesDiv.appendChild(div);
    });
  } else if (data.command === 'messageSent') {
    nextPageToken = null;
    vscode.postMessage({ command: 'loadChatHistory', spaceId: spacesDropdown.value, nextPageToken });
  }
});
