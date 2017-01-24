import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as assert from 'assert';

import * as vscode from 'vscode';

import { useClassnames } from '../src/use-classnames';

type Range = [[number, number], [number, number]];

interface Case {
    input: string;
    range: Range;
    output: string;
}

const cases: Case[] = [{
    input:
`<div className="l-container">
  <button className="button button--primary l-container__button"><span className="icon icon-edit" /> Button</button>
</div>`,
    range: [[0, 0], [0, 0]],
    output:
`<div className={classNames('l-container')}>
  <button className="button button--primary l-container__button"><span className="icon icon-edit" /> Button</button>
</div>`
}, {
    input:
`<div className="l-container">
  <button className="button button--primary l-container__button"><span className="icon icon-edit" /> Button</button>
</div>`,
    range: [[1, 0], [1, 0]],
    output:
`<div className="l-container">
  <button className={classNames('button', 'button--primary', 'l-container__button')}><span className={classNames('icon', 'icon-edit')} /> Button</button>
</div>`
}, {
    input:
`<div className="l-container">
  <button className="button button--primary l-container__button"><span className="icon icon-edit" /> Button</button>
</div>`,
    range: [[1, 71], [1, 97]],
    output:
`<div className="l-container">
  <button className="button button--primary l-container__button"><span className={classNames('icon', 'icon-edit')} /> Button</button>
</div>`
}];

function runCase(input: string, range: Range) {
    let testFilePath = path.join(os.tmpdir(), 'use-classnames-' + (Math.random() * 100000) + '.jsx');

    fs.writeFileSync(testFilePath, input);

    return vscode.workspace.openTextDocument(testFilePath).then((document) => {
        return vscode.window.showTextDocument(document).then((editor) => {
            editor.selection = new vscode.Selection(new vscode.Position(range[0][0], range[0][1]), new vscode.Position(range[1][0], range[1][1]));

            useClassnames();

            return new Promise((resolve) => {
                setTimeout(resolve, 200);
            }).then(() => {
                return editor.document.getText();
            });
        });
    });
}

suite('useClassnames', () => {
    test('useClassnames', () => {
        return cases.reduce((p, c) => {
            return p.then(() => {
                return runCase(c.input, c.range).then(output => {
                    assert.equal(output, c.output);
                });
            })
        }, Promise.resolve());
    });
});
