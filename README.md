# PROMD - PROPHESSOR's template for markdown-it

## Installation

```sh
npm i -g promd
```

## Usage

```sh
promd filename.md > filename.html
```

```sh
cat filename.md | promd
```

```sh
promd
```

## Getting help

```sh
promd --help
```

```text
usage: promd [-h] [-v] [--no-html] [-l] [-t] [-s] [-b] [--trace] [-o OUTPUT]
             [file]

Positional arguments:
  file                  File to read

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  --no-html             Disable embedded HTML
  -l, --linkify         Disable autolink text
  -t, --typographer     Disable smartquotes and other typographic replacements
  -s, --subsup          Disable <sub/> (~text~) and <sup/> (^text^) features
  -b, --breaks          Glue several lines into one (don't put <br/> after
                        every line breaks)
  --trace               Show stack trace on error
  -o OUTPUT, --output OUTPUT
                        File to write
```