import * as vscode from 'vscode'
import { SECRET_STORAGE_TOKEN_KEY } from './utils'

/**
 * Prompts the user to run a command using an external URL.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 * @returns {(params: { cmd: string; notify: string }) => Promise<void>} - An async function that takes a params object and prompts the user to run the command.
 */
export const promptRunCommand =
  (context: vscode.ExtensionContext) =>
  async (params: { cmd: string; notify: string }) => {
    const token = await context.secrets.get(SECRET_STORAGE_TOKEN_KEY)
    if (!token) {
      vscode.window.showErrorMessage(
        `No token found. Please set the token using the "Set Token" command.`
      )
      return
    }
    const urlParams = new URLSearchParams({ ...params, token })
    const internalUri = vscode.Uri.parse(
      `vscode://mattorp.vscode-execute-command?${urlParams.toString()}`
    )
    const externalUri = await vscode.env.asExternalUri(internalUri)

    vscode.window
      .showInformationMessage(
        `Run the "${params.cmd}"`,
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
