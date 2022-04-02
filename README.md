# Open issue in Linear

VS Code extension that opens the Linear issue you're currently working on based on the Git branch name you're currently on.

Once installed, just go to the command menu with:

`Cmd + Shift + P`

And type "Open issue". You'll see a command called "Linear: Open issue" appear.

This extension uses our VS Code Linear API authentication provider that is exposed by the [linear-connect](https://marketplace.visualstudio.com/items?itemName=Linear.linear-connect) extension. Feel free to use that in your own extensions!

---

## Developing & Contributing

After cloning the repo, use `yarn` to install all the package dependencies.

In VS Code you change the code and run the extension in a separate app window to test with F5 (Run > Start Debugging).

### Publishing

To publish a new version of the extension, first install the [vsce](https://www.npmjs.com/package/vsce) package, that is used to build VS Code extension packages.

```bash
npm i -g vsce
```

Then make sure to:

1. Update the version in `package.json` according to semver
2. Add appropriate changes to `CHANGELOG.md`

Build the new extension package.

```bash
vsce package
```

This produces a new file `linear-open-issue-1.0.1.vsix`, if your version was set to 1.0.1 in `package.json`.

You can use this file to release a new version of the extension on the [VS Code marketplace](https://marketplace.visualstudio.com/manage/publishers/Linear).
