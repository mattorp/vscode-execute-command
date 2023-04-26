/**
 * For development, we can target the extension host.
 * To do this, add "*" to activation events in package.json and set TEST_CALL below. It will only work in development mode. Make sure to remove the * activation event before committing.
 * It will print a URL to the console that you can use to test the extension.
 */
export const TEST_CALL = {
  cmd: 'workbench.action.files.newUntitledFile',
  notify: 'true',
}

export const SECRET_STORAGE_TOKEN_KEY = 'vscode-execute-command.token'
export const MINIMUM_TOKEN_LENGTH = 36
