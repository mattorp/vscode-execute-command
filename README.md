# vscode-execute-command

`vscode-execute-command` is a Visual Studio Code extension that allows you to execute any Visual Studio Code command by calling a URL. This can help automate tasks or integrate with other tools.

<span style='background-color:red;color:black;font-weight:bold;'>
WARNING: This is an attack vector since it allows any application that can reach the Visual Studio Code instance to execute commands. Use at your own risk. The token used in the call should be complex enough to prevent brute-force attacks. For the same reason, this extension is not published and should in general be used as a reference implementation.
</span>

## Features

- Execute Visual Studio Code commands using a URL.
- Secure the execution with a token stored in Visual Studio Code's secret storage.
- Optional notifications upon successful command execution or when an error occurs.
- Set or update the token through a command in the command palette.

## Installation

1. Clone the repository.
2. use `vsce package` to create a VSIX file.
3. use `code --install-extension vscode-execute-command-$VERSION.vsix` to install the extension.
4. Open the command palette (Ctrl+Shift+P or Cmd+Shift+P), and run the "Set token for vscode-execute-command" command to set a token that will be used for secure communication.

## Usage

To execute a command using a URL, follow this format:

```txt
vscode://mattorp.vscode-execute-command?cmd=<command>&token=<token>[&notify=<notify>]
```

Replace `<command>` with the command you want to execute, `<token>` with the token you set earlier, and `<notify>` with one of the following values (optional):

- `true`: Show a notification upon successful execution and when an error occurs.
- `error`: Show a notification only when an error occurs.

```txt
vscode://mattorp.vscode-execute-command?cmd=workbench.action.files.newUntitledFile&token=mysecrettoken&notify=true
```

or

```txt
vscode://mattorp.vscode-execute-command?cmd=workbench.action.files.newUntitledFile&token=mysecrettoken&notify=error
```

As an example, you can open the URL using bash to trigger the command, by using one of the following methods depending on your operating system:

1. **Windows**: Open Command Prompt and run `start "vscode://mattorp.vscode-execute-command?cmd=<command>&token=<token>&notify=<notify>"`.
2. **macOS**: Open Terminal and run `open "vscode://mattorp.vscode-execute-command?cmd=<command>&token=<token>&notify=<notify>"`.
3. **Linux**: Open Terminal and run `xdg-open "vscode://mattorp.vscode-execute-command?cmd=<command>&token=<token>&notify=<notify>"`.

You can call the URL from any application that supports opening URLs, such as a browser or a script, and which can reach the Visual Studio Code instance.

To set or update the token for secure communication, open the command palette (Ctrl+Shift+P or Cmd+Shift+P) and run the "Set token for vscode-execute-command" command.

## Limitations

Please note that this extension relies on the availability of the `SecretStorage` API in Visual Studio Code, which is only available in version 1.54.0 or newer.
