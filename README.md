# vscode2latex README

vscode2latex converts selected code into a LaTeX file, preserving VS Code’s syntax highlighting and colors. Effortlessly create nicely formatted code snippets for your LaTeX documents.

## Features

- Convert selected code to LaTeX with matching syntax colors.
- Preview the generated LaTeX code in a side panel.
- Customize the LaTeX document template via settings.

## Requirements

- Python 3.11+ (tested with 3.11.0)
- Python packages listed below (install with `pip install -r requirements.txt` inside this extension's root directory):
- *beautifulsoup4* (tested with 4.13.4)
- *cssutils* (tested with 2.11.1)
- *pywin32* (tested with 306)

## Extension Settings

This extension contributes the following settings:

- `vscode2latex.customTemplateFilepath`: Path to a custom `.tex` template file (leave empty for default template).

## Known Issues

- Large code selections may take a moment to process.
- Brackets may sometimes lose color during conversion to LaTeX.

## Release Notes

### 1.0.0

Initial release — generate LaTeX code with syntax highlighting.

### 1.0.1

Bug fix release.

### 1.0.2

Bug fix release.

### 1.0.3

Bug fix release.

### 1.0.4

Bug fix release.

---

GitHub repository: [https://github.com/ottokokstein/vscode2latex](https://github.com/ottokokstein/vscode2latex)

Found an issue or have feedback? Feel free to let me know on [my personal website](https://ottokokstein.github.io).
