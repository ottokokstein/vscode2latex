import html
import sys
import warnings
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Set

import bs4 as bs
import cssutils
import win32clipboard

CF_HTML = win32clipboard.RegisterClipboardFormat("HTML Format")


@dataclass
class Token:
    text: str
    color: str = ""
    italic: bool = False


@dataclass
class Line:
    tokens: List[Token]


@dataclass
class Page:
    lines: List[Line]
    font: str
    bg_color: str
    colors: List[str] = field(default_factory=list)

    def set_colors(self) -> None:
        colors: Set[str] = set()
        for line in self.lines:
            for token in line.tokens:
                if token.color:
                    colors.add(token.color)
        colors.add(self.bg_color)
        self.colors = list(colors)


class Parser:
    def __init__(self, data: bytes) -> None:
        self.data: bytes = data

    def parse_data(self) -> Page:
        soup: bs.BeautifulSoup = bs.BeautifulSoup(self.data.decode(), "html.parser")
        page_div: bs.element.Tag = soup.find("div")  # type: ignore
        page_style = cssutils.parseStyle(page_div.get("style"))
        bg_color: str = page_style.getPropertyValue("background-color")[1:]
        font: str = page_style.getPropertyValue("font-family").split(",")[0]
        lines: List[Line] = []
        line_elements: List[bs.element.Tag] = page_div.find_all(recursive=False)  # type: ignore
        for line_element in line_elements:
            tokens: List[Token] = []
            if line_element.name == "br":
                pass  # Empty line; keep tokens empty
            elif line_element.name == "div":
                token_spans: List[bs.element.Tag] = line_element.find_all("span")  # type: ignore
                for token_span in token_spans:
                    text: str = html.unescape(token_span.get_text())
                    span_style = cssutils.parseStyle(token_span.get("style"))
                    color: str = span_style.getPropertyValue("color")[1:]
                    color = self.normalize_color(color)
                    italic: bool = "italic" in span_style.getPropertyValue("font-style")
                    new_token: Token = Token(text, color, italic)
                    tokens.append(new_token)
            else:
                warnings.warn(
                    f'Unhandled tag found in HTML structure: "{line_element.name}"!'
                )
            new_line: Line = Line(tokens)
            lines.append(new_line)
        page: Page = Page(lines, font, bg_color)
        return page

    def normalize_color(self, color: str) -> str:
        match len(color):
            case 6:
                return color
            case 3:
                return "".join([2 * value for value in color])
            case _:
                warnings.warn(
                    f'Invalid hex color code: "{color}"! May cause LaTeX compilation issues.'
                )
                return color


class LatexFormatter:
    def __init__(self, page: Page) -> None:
        self.page: Page = page

    def get_color_definitions(self) -> str:
        definitions: str = ""
        for n, color in enumerate(self.page.colors):
            definitions += f"\\definecolor{{{color}}}{{HTML}}{{{color}}}"
            if n < len(self.page.colors) - 1:
                definitions += "\n"
        return definitions

    def escape_special_chars(self) -> None:
        for line in self.page.lines:
            for token in line.tokens:
                token.text = token.text.replace(
                    " ", " "
                )  # Non-breaking space which causes issues in .tex file
                token.text = token.text.replace("\\", "\\char92")
                token.text = token.text.replace("{", "\\char123")
                token.text = token.text.replace("}", "\\char125")

    def get_verbatim_text(self) -> str:
        text: str = ""
        for n, line in enumerate(self.page.lines):
            for token in line.tokens:
                if token.text.strip():
                    text += f"\\textcolor{{{token.color}}}{{{token.text}}}"
                else:
                    text += token.text
            if n < len(self.page.lines) - 1:
                text += "\n"
        return text

    def construct(self, template_file_path: str) -> str:
        template: str = ""
        with open(template_file_path, encoding="utf8") as f:
            template = f.read()
        output: str = template.replace(
            "DEFINITIONS_PLACEHOLDER", self.get_color_definitions()
        )
        output: str = output.replace("VERBATIM_PLACEHOLDER", self.get_verbatim_text())
        output: str = output.replace("BG_COLOR_PLACEHOLDER", self.page.bg_color)
        output: str = output.replace("FONT_PLACEHOLDER", self.page.font)
        return output

    def count_leading_spaces(self, text: str) -> int:
        return len(text) - len(text.lstrip(" "))

    def normalize_indents(self) -> None:
        # Count leading spaces in line with least leading spaces
        min_leading_spaces: int = -1
        for line in self.page.lines:
            if line.tokens:
                leading_token: Token = line.tokens[0]
                if (
                    not leading_token.text.strip()
                    and self.count_leading_spaces(leading_token.text) > 0
                ):
                    new_min_leading_spaces: int = self.count_leading_spaces(
                        leading_token.text
                    )
                    if (
                        min_leading_spaces == -1
                        or new_min_leading_spaces < min_leading_spaces
                    ):
                        min_leading_spaces = new_min_leading_spaces
                else:
                    break
        # Remove common leading spaces
        if min_leading_spaces > 0:
            for line in self.page.lines:
                if line.tokens:
                    line.tokens[0].text = line.tokens[0].text.removeprefix(
                        min_leading_spaces * " "
                    )
                    if not line.tokens[0].text:
                        line.tokens.pop(0)


def main() -> None:
    # Check if filepath to template .tex file was provided
    template_file_path: str = ""
    if len(sys.argv) > 1:
        template_file_path = sys.argv[1]
    else:
        raise ValueError(
            "Filepath to template .tex file was not passed as an argument when running main.py!"
        )

    win32clipboard.OpenClipboard()
    data: bytes = win32clipboard.GetClipboardData(CF_HTML)
    win32clipboard.CloseClipboard()

    parser: Parser = Parser(data)
    page: Page = parser.parse_data()
    page.set_colors()

    formatter: LatexFormatter = LatexFormatter(page)
    formatter.escape_special_chars()
    formatter.normalize_indents()
    output: str = formatter.construct(template_file_path)
    print(output)


if __name__ == "__main__":
    main()
