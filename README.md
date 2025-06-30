# vscode2latex README

The VS Code extension vscode2latex converts selected code into a LaTeX file, preserving VS Code’s syntax highlighting and colors. Effortlessly create nicely formatted code snippets for your LaTeX documents.

## Features

- Convert selected code to LaTeX with matching syntax colors.
- Preview the generated LaTeX code in a side panel.
- Customize the LaTeX document template via settings.

## Requirements

- Tested on Windows 10; functionality on other operating systems is not guaranteed.

## Extension Settings

This extension contributes the following settings:

- `vscode2latex.templateFilepath`: Path to a custom `.tex` template file (leave empty for default template).

## Known Issues

- Large code selections may take a moment to process.
- Brackets may sometimes lose color during conversion to LaTeX.
- May not work when syntax highlighting is not present (e.g. in .txt files).

## Release Notes

Check CHANGELOG.md for release notes.

---

GitHub repository: [https://github.com/ottokokstein/vscode2latex](https://github.com/ottokokstein/vscode2latex)

Found an issue or have feedback? Feel free to let me know on [my personal website](https://ottokokstein.github.io).
