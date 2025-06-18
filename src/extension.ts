import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

let panel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("vscode2latex.convertToLatex", async () => {
		await vscode.commands.executeCommand("editor.action.clipboardCopyWithSyntaxHighlightingAction");

		const config = vscode.workspace.getConfiguration('vscode2latex');
		let templatePath = config.get<string>('customTemplateFilepath');
		if (!templatePath) {
			templatePath = path.join(context.extensionPath, 'template.tex');
		}

		if (!fs.existsSync(templatePath)) {
			vscode.window.showErrorMessage(`Template .tex file not found: ${templatePath}`);
			return;
		}

		const scriptPath = path.join(context.extensionPath, "main.py");
		exec(`py -3.11 "${scriptPath}" "${templatePath}"`, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showErrorMessage(`Python error: ${stderr}`);
				return;
			}

			if (panel) {
				// If panel exists, reveal and update content
				panel.reveal(vscode.ViewColumn.Beside);
				panel.webview.html = `<html><body><pre>${stdout}</pre></body></html>`;
			} else {
				// Otherwise create new panel
				panel = vscode.window.createWebviewPanel(
					"vscode2latexOutput",
					"vscode2latex output",
					vscode.ViewColumn.Beside,
					{ enableScripts: true }
				);
				panel.webview.html = `<html><body><pre>${stdout}</pre></body></html>`;

				// Dispose panel on close
				panel.onDidDispose(() => {
					panel = undefined;
				}, null, context.subscriptions);
			}

			vscode.window.showInformationMessage(`vscode2latex: success`);
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
