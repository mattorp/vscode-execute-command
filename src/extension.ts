/**
 * vscode-execute-command
 *
 * A Visual Studio Code extension that allows you to execute any Visual Studio Code command
 * by calling a URL. The extension checks the provided token against the one stored in
 * Visual Studio Code's secret storage. If the tokens match, the provided command is executed.
 *
 * @module vscode-execute-command
 */

import * as vscode from 'vscode'
import { SECRET_STORAGE_TOKEN_KEY } from './utils'

const SECRET_STORAGE_TOKEN_KEY = 'vscode-execute-command.token'

/**
 * Validates the required parameters.
 *
 * @param {string | null} cmd - The command to execute.
 * @param {string | null} token - The token to validate.
 * @returns {boolean} - True if parameters are valid, otherwise false.
 */
function validateParameters(cmd: string | null, token: string | null): boolean {
  if (!cmd || !token) {
    vscode.window.showErrorMessage(
      'Missing required parameters (cmd and/or token).'
    )
    return false
  }
  return true
}

/**
 * Validates the token.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 * @param {string} token - The token to validate.
 * @returns {Promise<boolean>} - True if the token is valid, otherwise false.
 */
async function validateToken(
  context: vscode.ExtensionContext,
  token: string
): Promise<boolean> {
  const storedToken = await context.secrets.get(SECRET_STORAGE_TOKEN_KEY)

  if (storedToken !== token) {
    vscode.window.showErrorMessage(
      token ? `Incorrect token provided: ${token}` : `No token provided.`
    )
    return false
  }
  return true
}

/**
 * Executes the command and shows notifications if required.
 *
 * @param {string} cmd - The command to execute.
 * @param {string | null} notify - Whether to show notifications or not.
 * @param {vscode.OutputChannel} outputChannel - The output channel for logging errors.
 */
async function executeCommand(
  cmd: string,
  notify: string | null,
  outputChannel: vscode.OutputChannel
): Promise<void> {
  try {
    await vscode.commands.executeCommand(cmd)
    outputChannel.appendLine(`Command "${cmd}" executed successfully.`)
    if (notify === 'true') {
      vscode.window.showInformationMessage(
        `Command "${cmd}" executed successfully.`
      )
    }
  } catch (error: any) {
    if (notify === 'true' || notify === 'error') {
      vscode.window.showErrorMessage(
        `Error executing command "${cmd}": ${error.message}`
      )
    }
    outputChannel.appendLine(
      `Error executing command "${cmd}": ${error.message}`
    )
  }
}

/**
 * Activates the extension.
 *
 * @param {vscode.ExtensionContext} context - The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel(
    'vscode-execute-command'
  )

  /**
   * URI handler for executing commands.
   */
  const uriHandler = vscode.window.registerUriHandler({
    async handleUri(uri: vscode.Uri): Promise<void> {
      const queryParams = new URLSearchParams(uri.query)
      const cmd = queryParams.get('cmd')
      const token = queryParams.get('token')
      const notify = queryParams.get('notify')

      if (!validateParameters(cmd, token)) {
        return
      }

      if (!(await validateToken(context, token as string))) {
        return
      }

      await executeCommand(cmd as string, notify, outputChannel)
    },
  })

  /**
   * Command for setting the token.
   */
  const setTokenCommand = vscode.commands.registerCommand(
    'vscode-execute-command.setToken',
    async () => {
      const token = await vscode.window.showInputBox({
        prompt: 'Enter the token to use for executing commands.',
        placeHolder: 'Token',
        value: await context.secrets.get(SECRET_STORAGE_TOKEN_KEY),
      })

      if (token) {
        context.secrets.store(SECRET_STORAGE_TOKEN_KEY, token)
        vscode.window.showInformationMessage('Token set successfully.')
      }
    }
  )

  context.subscriptions.push(uriHandler, setTokenCommand)
}

/**
 * Deactivates the extension.
 */
export function deactivate() {}
