# Google Chat VSCode Extension
This extension integrates Google Chat functionality directly into Visual Studio Code, allowing users to view and send messages in Google Chat spaces or DMs without leaving their development environment.

## Features
### 1. Space and DM Selection:
- View a dropdown list of Google Chat spaces and DMs.
- Refresh the list of spaces with a single click.

### 2. Chat Messaging:
- View the chat history of the selected space or DM.
- Send new messages directly from the VSCode sidebar.

### 3. Authentication:
- Authenticate with your Google account to enable the extension.

### 4. Dynamic Chat History Loading:
- Retrieve a limited number of recent messages.
- Load older messages by scrolling to the top of the chat history.

## Prerequisites
- A Google account with access to Google Chat.
- A registered Google API project with the Chat API enabled.
- ClientId and ClientSecret for OAuth2 authentication.

## How to Obtain ClientId and ClientSecret
To use this extension, you need to obtain ClientId and ClientSecret from the Google Cloud Console and configure them in the extension settings.

**Steps**
1. Go to the Google Cloud Console and log in with your Google account.
2. Create a new project or select an existing one.
3. Navigate to APIs & Services > Library.
4. Search for Google Chat API and enable it for your project.
5. Go to APIs & Services > Credentials and create OAuth 2.0 credentials:
  - Click Create Credentials and select OAuth 2.0 Client ID.
  - Choose Desktop App as the application type.
  - Once created, copy the ClientId and ClientSecret.
6. Configure these credentials in VSCode:
  - How to configure:
    1. Open VSCode and go to File > Preferences > Settings > Extensions > Google Chat Extension.
    2. Paste the ClientId and ClientSecret into the respective input fields.

**Notes**
- Keep your credentials secure and do not share them with others.
- If necessary, you can regenerate the ClientId or ClientSecret in the Google Cloud Console.

## Configuration
1. Go to the extension settings.
2. Provide the ClientId and ClientSecret obtained from the Google Cloud Console.

## How to Use
1. Click the extension icon in the VSCode Activity Bar to open the chat sidebar.
2. Authenticate your Google account by clicking the "Authenticate" button.
3. After authentication:
  - Select a space or DM from the dropdown.
  - View chat history or send a message.
4. Use the refresh icon to update the chat history or space list.

## Controls
- **Refresh Button**: Updates the chat history of the selected space.
- **Send Button**: Sends the message typed in the text area.
- **Dropdown**: Select the chat space or DM.

## Troubleshooting
- Ensure that the ClientId and ClientSecret are valid.
- Verify that the Google Chat API is enabled for your Google Cloud project.
- If authentication fails, reauthenticate by clicking the "Authenticate" button again.

## Known Limitations
- Media messages (e.g., images, videos) are not supported and will display as placeholder text.
- Messages are retrieved in batches to optimize performance.
- This extension interacts with Google Chat via the Google Chat API. It is important to note that the API is subject to rate limits, which may affect the frequency and amount of data you can retrieve or send.

## Contributing
Feel free to submit issues, feature requests, or pull requests to improve the extension.
