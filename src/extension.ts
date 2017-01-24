'use strict';

import * as vscode from 'vscode';

import { useClassnames } from './use-classnames';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.useClassnames', () => {
        useClassnames();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
