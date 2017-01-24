'use strict';

import * as vscode from 'vscode';

const classNameRegExp = /className="([^"]*)"/g;

export function useClassnames() {
    const editor = vscode.window.activeTextEditor;

    const range = editor.selection.start.isEqual(editor.selection.end) ?
        editor.document.lineAt(editor.selection.start.line).range :
        editor.selection;

    const text = editor.document.getText(range);

    if (!classNameRegExp.test(text)) {
        return;
    }

    const newText = text.replace(classNameRegExp, (match, className) => {
        const names = className.split(' ').map(x => `'${x}'`).join(', ');
        return `className={classNames(${names})}`
    });

    editor.edit(editBuilder => {
        editBuilder.replace(range, newText);
    });
}
