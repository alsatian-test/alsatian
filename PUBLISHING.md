# Publishing alsatian

Publishing has been made as simple as possible. Currently alsatian is only deployed on NPM and a GitHub release is made as a result of this.

## Release Process

1. get a fresh checkout of the alsatian branch that should be published
2. update the version number in package.json
3. commit with message "Release {version number}
4. run `npm install`
5. run `npm publish` this will run all tests necessary and stop if any fail
6. run `git push --follow-tags` this will create the GitHub release by pushing the tags

## Branches

For every new Major and Minor versions published a branch should be cut from master. The master branch will always contain the most up to date code but all released code will be kept stable in separate branches. All fixes should be merged into master then merged back to the appropriate branches if necessary.