# External widget template

The project contains template code for creating external web report widgets for Polyanalyst 6.5 distribution.
External widgets allow developers to create thier own visualizations and integrate them into Polyanalyst 6.5 Web Reports.

## What's inside?

The project consist of:
 - scripts for generating widget code;
 - script for creating a widget archive;
 - configuration for the webpack.

## Prerequisites

- [Node.js 18+](https://nodejs.org/),
- [yarn 1+](https://yarnpkg.com/).

Install a required version of Node.js from the link above.

There are two ways to install yarn on your local machine:
- using the `coprepack enable` command;
- using the `npm install yarn global` command.

## Installation

 1. Clone repository with `git clone https://github.com/Megaputer/external-widget-template.git` command;
 2. Go to directory with `cd external-widget-template` command;
 3. Run the following `yarn install` command to install required packages.

## Developing

 To create a widget run the `yarn create:widget` command and specify a widget name.
 For example, you can write `Example` and the `example` directory will be created in the `src` folder. The folder will contain the following files: `model.tsx`, `view.tsx`, `info.json`, `styles.css`.
Structure of the directory `example`:
```
└───example
        info.json
        model.tsx
        styles.css
        view.tsx
```

There are three commands for bundling code:
 - `yarn prod` creates an `example.js` file with code minification without sourcemap inside the `build` folder. It also copies the `info.json` file as an `example.json` file into the `build` folder.
 - `yarn dev` creates an `example.js` file and an `example.js.map` file containing the source code inside the `build` folder. It also copies the `info.json` file as an `example.json` file into the `build` folder.
 - `yarn dev:watch` does the same thing as the `dev` command, but watch the files and recompile whenever they change.

For ease of development, you can specify the `--output-path` parameter to set the output location of the package file.
 Example: `yarn prod --output-path="C:/Megaputer Intelligence/PolyAnalyst 6.5 Server 64-bit/data/externals`.
 In the `externals` folder a folder named by the GUID of the external widget will be created. The folder will contain the following files: `model.tsx`, `view.tsx`, `info.json`, `styles.css`.

# Archivation

To upload an external widget through the administration panel, you need to create an archive with extension `zip`.
 To create an archive use the `yarn archive` command. After the command starts, the `build` folder will contain an archive with the name of the project directory.
