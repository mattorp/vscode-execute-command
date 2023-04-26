import * as vscode from 'vscode'
import { SECRET_STORAGE_TOKEN_KEY } from './utils'

/**
 * Logs the external URL in the debug console for executing a command in the extension host.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 * @returns {(params: { cmd: string; notify: string }) => Promise<void>} - An async function that takes a params object and logs the external URL.
 */
export const logExtensionHostUrl =
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
    console.log(externalUri.toString())
  }
