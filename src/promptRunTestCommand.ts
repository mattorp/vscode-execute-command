import * as vscode from 'vscode'
import { SECRET_STORAGE_TOKEN_KEY } from './utils'

/**
 * For development, we can target the extension host.
 * To do this, add "*" to activation events in package.json and set TEST_CALL below. It will only work in development mode. Make sure to remove the * activation event before committing.
 * It will print a URL to the console that you can use to test the extension.
 */
export const TEST_CALL = {
  cmd: 'workbench.action.files.newUntitledFile',
  notify: 'true',
}

/**
 * Prompts the user to run a command using an external URL.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 */
export const promptRunTestCommand = async (
  context: vscode.ExtensionContext
) => {
  const token = await context.secrets.get(SECRET_STORAGE_TOKEN_KEY)
  if (!token) {
    vscode.window.showErrorMessage(
      `No token found. Please set the token using the "Set Token" command.`
    )
    return
  }
  const urlParams = new URLSearchParams({ ...TEST_CALL, token })
  const internalUri = vscode.Uri.parse(
    `vscode://mattorp.vscode-execute-command?${urlParams.toString()}`
  )
  const externalUri = await vscode.env.asExternalUri(internalUri)

  vscode.window
    .showInformationMessage(
      `Run the test command:\n"${TEST_CALL.cmd}"`,
      { modal: false },
      'Yes',
      'No'
    )
    .then((selection) => {
      if (selection === 'Yes') {
        vscode.env.openExternal(externalUri)
      }
    })
}
