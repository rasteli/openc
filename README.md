# OpenC

OpenC is a CLI tool to create, open and remove projects in Visual Studio Code.

### Features

- Recursive listing
- Recursive directory creation
- Specify location to create project
- Create these projects
  - Vite
  - Next.js
  - Node.js

### Installation

```bash
npm install -g @rasteli/openc
```

### Usage

```bash
$ openc
```

### How it works

OpenC will search recursively for specific files or folders in the default directory `~/www`
to determine if it or any of its children is a root directory. A root directory, i.e. a project,
is a directory that contains any file or folder whose name includes any of these:
`"index", "main", "src", "config", "package"`, called root conditions. As of now, there's no way
to change the default directory or the root conditions unless you edit the source code. If you're
willing to do so, you can change the former [here](https://github.com/rasteli/openc/blob/89f5b7de1caa78c10ae4c22fa3829a3bf98541ed/src/index.ts#L25) and the latter [here](https://github.com/rasteli/openc/blob/89f5b7de1caa78c10ae4c22fa3829a3bf98541ed/src/utils/check-root-dir.ts#L4).
