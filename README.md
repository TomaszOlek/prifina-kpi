# Instructions

- First make your own fork


# Resources 

- Repository is a so called monorepo, [more information](https://lerna.js.org/)

- Package client used is "Yarn" not npm, [more information](https://yarnpkg.com/). Using the incorrect package manager will break the monorepo.

- Get familiar with Storybook, [more information](https://storybook.js.org/)

## Your own package, component

- First run... 


```sh
$ lerna create <your packagename>
```
- The new package is created under /packages folder.

- Modify the default package.json... see example on core package. 

- Setup your own storybook environment.... see example on core package.

- Test new package by running... 

```sh
$ yarn storybook
```
