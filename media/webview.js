let nextPageToken = null;
let isAuthenticated = false;
const vscode = acquireVsCodeApi();
const authButton = document.getElementById('auth-button');
const messageBox = document.getElementById('message-box');
const sendButton = document.getElementById('send-button');
const refreshButton = document.getElementById('refresh-button');
const chatMessagesDiv = document.getElementById('chat-messages');
const spacesDropdown = document.getElementById('spaces-dropdown');

function updateUIBasedOnAuth() {
  if (isAuthenticated) {
      authButton.style.display = 'none';
      chatMessagesDiv.textContent = ''; // Clear the placeholder message
      messageBox.disabled = false;
      sendButton.disabled = false;
      refreshButton.disabled = false;
  } else {
      authButton.style.display = 'block';
      chatMessagesDiv.textContent = 'Please authenticate to load chats.';
      messageBox.disabled = true;
      sendButton.disabled = true;
      refreshButton.disabled = true;
  }
}

chatMessagesDiv.addEventListener('scroll', () => {
  if (!isAuthenticated) return;
  if (chatMessagesDiv.scrollTop === 0 && nextPageToken) {
    vscode.postMessage({ command: 'loadChatHistory', spaceId: spacesDropdown.value, nextPageToken });
  }
});

authButton.addEventListener('click', () => {
  vscode.postMessage({ command: 'authenticate' });
});

refreshButton.addEventListener('click', () => {
  if (!isAuthenticated) return;
  vscode.postMessage({ command: 'loadChatHistory', spaceId: spacesDropdown.value, nextPageToken });
});

sendButton.addEventListener('click', () => {
  if (!isAuthenticated) return;
  vscode.postMessage({ command: 'sendMessage', spaceId: spacesDropdown.value, text: messageBox.value });
  messageBox.value = '';
});

window.addEventListener('message', (event) => {
  const data = event.data;
  if (data.command === 'authenticated') {
    updateUIBasedOnAuth();
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
      const messageText = message.text || 'This is non-compliant media information.';
      div.textContent = `
        <div>
          <span>${chat.sender}</span> <span>${chat.timestamp}</span><br>
          ${messageText}
        </div>
      `;
      chatMessagesDiv.appendChild(div);
    });
  } else if (data.command === 'messageSent') {
    nextPageToken = null;
    vscode.postMessage({ command: 'loadChatHistory', spaceId: spacesDropdown.value, nextPageToken });
  }

  updateUIBasedOnAuth();
});
