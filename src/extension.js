"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const { readHtml, getSettings } = require("./util");

let panel;

const getConfig = () => {
	const editor = vscode.window.activeTextEditor;
	const extensionSettings = getSettings("vscode2latex", [
		"templateFilepath",
	]);

	if (!extensionSettings.templateFilepath) {
		extensionSettings.templateFilepath = path.join(__dirname, "../template.tex");
	}

	const template = fs.readFileSync(extensionSettings.templateFilepath, "utf8");

	return template;
};

const createPanel = async (context) => {
	if (panel) {
		panel.reveal(vscode.ViewColumn.Beside, true);
		return panel;
	}
	panel = vscode.window.createWebviewPanel(
		"vscode2latex",
		"vscode2latex",
		{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
		{
			enableScripts: true,
			retainContextWhenHidden: true,
			localResourceRoots: [vscode.Uri.file(context.extensionPath)]
		}
	);
	panel.webview.html = await readHtml(
		path.resolve(context.extensionPath, "webview/index.html"),
		panel
	);
	panel.onDidDispose(() => {
		panel = undefined;
	});
	return panel;
};

const hasOneSelection = (selections) =>
	selections && selections.length === 1 && !selections[0].isEmpty;

const runCommand = async (context) => {
	const activePanel = await createPanel(context);

	const update = async () => {
		await vscode.commands.executeCommand("editor.action.clipboardCopyWithSyntaxHighlightingAction");
		activePanel.webview.postMessage(getConfig());
	};

	const editor = vscode.window.activeTextEditor;
	if (editor && hasOneSelection(editor.selections)) update();
};

module.exports.activate = (context) =>
	context.subscriptions.push(
		vscode.commands.registerCommand("vscode2latex.convert", () => runCommand(context))
	);
