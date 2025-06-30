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

- `vscode2latex.templateFilepath`: Path to a custom `.tex` template file. Leave empty to use the default template. When creating a custom template file, include these placeholders:
    - `VERBATIM_PLACEHOLDER`: The formatted code with `\textcolor` commands will be inserted here.
    - `DEFINITIONS_PLACEHOLDER`: The color definitions with `\definecolor` commands will be inserted here.
    - `BG_COLOR_PLACEHOLDER`: The background color’s hex code (without #) will be inserted here.

## Use

- Download the extension from the VS Code Marketplace
- Select code that is syntax-highlighted
- Open the Command Palette (default shortcut: F1)
- Run the `vscode2latex: Convert Code to LaTeX` command
- Copy the generated LaTeX code from the sidebar

## Known Issues

- Large code selections may take a moment to process.
- Brackets may sometimes lose color during conversion to LaTeX.
- May not work when syntax highlighting is not present (e.g. in .txt files).

## Release Notes

Check CHANGELOG.md for release notes.

---

Thanks to the author(s) of the [CodeSnap extension](https://github.com/kufii/CodeSnap), whose code this extension builds upon.

GitHub repository: [https://github.com/ottokokstein/vscode2latex](https://github.com/ottokokstein/vscode2latex)

You can find additional info about the development of this extension on [my personal website](https://ottokokstein.github.io/vscode2latex.html).

Found an issue or have feedback? Feel free to let me know on [my personal website's homepage](https://ottokokstein.github.io).
