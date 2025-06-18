"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
let panel;
function activate(context) {
    let disposable = vscode.commands.registerCommand("vscode2latex.convertToLatex", async () => {
        await vscode.commands.executeCommand("editor.action.clipboardCopyWithSyntaxHighlightingAction");
        const config = vscode.workspace.getConfiguration('vscode2latex');
        let templatePath = config.get('customTemplateFilepath');
        if (!templatePath) {
            templatePath = path.join(context.extensionPath, 'template.tex');
        }
        if (!fs.existsSync(templatePath)) {
            vscode.window.showErrorMessage(`Template .tex file not found: ${templatePath}`);
            return;
        }
        const scriptPath = path.join(context.extensionPath, "main.py");
        (0, child_process_1.exec)(`py -3.11 "${scriptPath}" "${templatePath}"`, (err, stdout, stderr) => {
            if (err) {
                vscode.window.showErrorMessage(`Python error: ${stderr}`);
                return;
            }
            if (panel) {
                // If panel exists, reveal and update content
                panel.reveal(vscode.ViewColumn.Beside);
                panel.webview.html = `<html><body><pre>${stdout}</pre></body></html>`;
            }
            else {
                // Otherwise create new panel
                panel = vscode.window.createWebviewPanel("vscode2latexOutput", "vscode2latex output", vscode.ViewColumn.Beside, { enableScripts: true });
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
function deactivate() { }
//# sourceMappingURL=extension.js.map