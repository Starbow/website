Starbow website
==============================

Code base for the Starbow website: http://starbowmod.com

* Server-side framework: [Node.js](https://nodejs.org/) with [`express`](https://www.npmjs.com/package/express)
* Database: [RethinkDB](http://rethinkdb.com/docs/install/)
* Client-side framework: [React](http://facebook.github.io/react/)

## Stack

Below is a list of the most prominent software and libraries used to build this application.

* [Node.js](https://nodejs.org/)
  * [`express`](https://www.npmjs.com/package/express)
  * [`passport`](https://www.npmjs.com/package/passport)
  * [Grunt](http://gruntjs.com/) (task runner)
* [RethinkDB](http://rethinkdb.com/docs/install/)
  * [Thinky](http://thinky.io/) (ORM)
* [React](http://facebook.github.io/react/)

# Get started

## Prerequisites

The following stacks/software is needed in order to run the server on your local machine.

1. [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. [Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint-elementary-os)
3. [RethinkDB](http://rethinkdb.com/docs/install/)
4. [Grunt](http://gruntjs.com/) (see more under [Compiling view files and public assets](#compiling-view-files-and-public-assets))
5. [mocha](http://mochajs.org/) (see more under [Tests](#tests))

## Installation

1. Create/go to the directory on your machine from which you want to run the website code.
2. Clone repository: `git clone https://github.com/Starbow/website`
3. Run `npm install` in the root folder (`/website`) to get all dependencies which are stored in the folder `node_modules`
4. Clone/download the live Rethink database and import it into your local environment.
  - **Note:** We should probably consider doing an automated script for this purpose
5. Setup the `env.development.json` file (in `/server/config/env/env.json`).
  - You can base the JSON on the contents in `env.example.json`, and change the values accordingly.
  - **Note:** NEVER add these files to git: [`env.production.json`, `env.development.json`, `env.test.json`]
  - The structure of `env.example.json` must match that of the environment specific `env.*.json` files.
6. Compile view files and public assets. For details, see: [Compiling view files and public assets](#compiling-view-files-and-public-assets).

## Configuring SSH-key for git

If you don't feel like writing your Git password every time you want to push to the GitHub repository, you should configure an SSH-key.

1. Generate SSH-key on your computer (https://help.github.com/articles/generating-ssh-keys/).
2. Add public SSH-key (default `id_rsa.pub`) to GitHub (https://github.com/settings/ssh).

<a name="compiling-view-files-and-public-assets"></a>
## Compiling view files and public assets

Some files we don't store GitHub, e.g. the `node_modules` folder. Certain other files aren't stored in their optimized versions in GitHub, either, but exist only in GitHub as source code. To run the application, said files must first be compiled. Compiling can be done [on command](#compiling-on-command) and by [having a daemon running](#compiling-using-the-daemon).

We use Grunt as compiler. The compiler logic is located in the [`Gruntfile.js`](https://github.com/Starbow/website/blob/master/Gruntfile.js) file.

### Implicated files

The files we compile include:

- React files, `*.jsx`, in the [`server/mvc/views`](#folder-server-mvc-views) (sub-)folders. These are compiled into their counterpart `*.js` files placed within the same directory.
- LESS files, `*.less`, in the [`private/assets`](#folder-private-assets) (sub-)folders. These are compiled into their corresponding optimized and minified `*.css` files at the corresponding file paths under [`public/assets`](#folder-public-assets).
- Javascript source code files for use client-side, `*.src.js`, in the [`private/assets`](#folder-private-assets) (sub-)folders. These are compiled into their corresponding optimized and minified `*.js` files at the corresponding file paths under [`public/assets`](#folder-public-assets).

<a name="compiling-on-command"></a>
### Compiling on command

To compile all files, run:

```bash
grunt [compile]
```

To compile all files within a specific namespace/target folder, run:

```bash
grunt [compile] [less|js|views]
```

<a name="compiling-using-the-daemon"></a>
### Compiling using the daemon

To start a daemon which watches for file changes and compiles them as necessary, run:

```bash
grunt daemon
```

To run the daemon within a specific namespace/target folder:

```bash
grunt daemon [less|js|views]
```

## Running the application

1. Start the database. In a separate tab/window in your terminal write: `rethinkdb`
2. Start the server:
  - Run `sudo node server.js` in the root folder (`/website`) to start the application.
  - **Note:** Using port numbers below 3000, which 443 is, requires `sudo` privileges.
  - If you haven't configured the environment variable `NODE_ENV`, you may need to run: `sudo NODE_ENV=development node server.js`.
3. In your terminal, you'll now see output as the server is being configured or potentially throws errors.
4. In your browser, go to: [https://localhost](https://localhost)

If your browser complains that `https://localhost` isn't secure (certified SSL/HTTPS), just choose (in your browser) to continue anyway.

### Run as background process
If you want to run the server as a background process - i.e. not having the script "hanging" in your terminal - install a background process manager. PM2 (Process Manager 2) is recommended.

```
sudo npm install pm2 -g
```

After installation, run:

```
sudo pm2 start server.js
```

For additional help and information on PM2, see: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-14-04

# The application

## Application workflow

1. The server receives a request, processes it through the MVC framework, and returns a response, most commonly being JSON to be received and processed by React. However, the response can also be XML, HTML, pure text, etc.
2. The client receives the response and React updates the view layer/UI.

## Server-side

We use `express` (https://www.npmjs.com/package/express) for managing the server app (ran through `server.js`).

## Database

(TODO)

## Client-side

(TODO)

<a name="tests"></a>
## Tests

For tests, we use [`mocha`](http://mochajs.org/), which must be installed globally (`sudo npm install mocha -g`).

Implementation via TDD and BDD is **highly** encouraged.

All our tests - server-side, client-side, and otherwise - are located under [`/tests`](#folder-tests). The tests are split up into "unit", "integration", "database", and more.

### Running all tests

To run all tests, simply run the following in your terminal:

```shell
./tests/tests.sh
```

Or use `mocha`'s "glob" logic. E.g.:

```shell
mocha tests/*/**/*Test.js
```

### Running a single test

To run a single test, use:

```
mocha path/to/test.js
```

### Watching and auto-running tests

If you want tests to automatically run when you modify a test file, use the `-w` option in `mocha`. E.g.:

```
mocha -w path/to/test.js
```

This also works with the glob pattern. E.g.:

```
mocha -w tests/*/**/*Test.js
```

**However**, saving one of the matched test files will run **all** tests matched by the glob pattern.

## Application folder structure

The folders are structured as follows:

* [`/client`](#folder-client)
  * [`/views`](#folder-client-views)
    * [`application`](#folder-client-views-application)
    * [`/layouts`](#folder-client-views-layouts)
* [`/node_modules`](#folder-node_modules)
* [`/private`](#folder-private)
  * [`/assets`](#folder-private-assets)
  * [`/ssl`](#folder-private-ssl)
* [`/public`](#folder-public)
  * [`/assets`](#folder-public-assets)
    * [`/cdn`](#folder-public-assets-cdn)
* [`/server`](#folder-server)
  * [`/boostrap`](#folder-server-bootstrap)
  * [`/config`](#folder-server-config)
    * [`/env`](#folder-server-config-env)
  * [`/data`](#folder-server-data)
  * [`/mvc`](#folder-server-mvc)
    * [`/controllers`](#folder-server-mvc-controllers)
    * [`/models`](#folder-server-mvc-models)
    * [`/views`](#folder-server-mvc-views)
  * [`/scripts`](#folder-server-scripts)
* [`tests`](#folder-tests)
  * [`integration`](#folder-tests-integration)
  * [`unit`](#folder-tests-unit)

### Folder structure with details

---

* <a name="folder-client"></a>`/client`<br/>
Contains logic and views for the client, exclusively. I.e. it contains the shell UI React needs to update a view layer, based on e.g. a JSON response.
  * <a name="folder-client-views"></a>`/views`<br/>
  Sub-folders contain view files/templates.
    * <a name="folder-client-views-application"></a>`/application`<br/>
    View files (or "content templates") to be used and displayed in the client. Commonly HTML files displaying page content a [layout](#folder-client-views-layouts) file.<br/>
    Updated by React.
    * <a name="folder-client-views-layouts"></a>`/layouts`<br/>
    Layout files (also referred to as "page type templates") to be used and displayed in the client. These files are commonly HTML files functioning as wrappers with `head` and `body` tags.<br/>
    Updated by React.
* <a name="folder-node_modules"></a>`/node_modules`<br/>
Do **not manually modify** the contents of this folder.<br/>The list of Node.js modules as listed in `package.json`.<br/>
To **install** (add) a package: `npm install <package_name> --save`<br/>
To **uninstall** (remove) a package: `npm uninstall <package_name> --save`
* <a name="folder-private"></a>`/private`<br/>
Contains sensitive server-side assets, e.g. source code, as opposed to the [`/public`](#folder-public) folder within which public assets are stored.
  * <a name="folder-private-assets"></a>`/assets`<br/>
  Contains unprocessed/uncompiled source code files. For details, see [Compiling view files and public assets](#compiling-view-files-and-public-assets).
  * <a name="folder-private-ssl"></a>`/ssl`<br/>
  Contains SSL key and certificate.<br/>
  **TODO:** Move this to nginx. (See: https://github.com/Starbow/website/issues/1) Currently, a bogus key and certificate exists.
* <a name="folder-public"></a>`/public`<br/>
The main, publicly accessible folder within which any file is exposed to the outside world. Files are reach in the URL simply by removing the `/public` namespace. E.g. if on the server the path is `/public/img.jpg`, the corresponding URL is: `https://localhost/img.jpg`<br/>
**DO NOT STORE SENSITIVE ASSETS HERE!** For sensitive assets which are used internally in the application, or source code, use the [`/private`](#folder-private) folder.
  * <a name="folder-public-assets"></a>`/assets`<br/>
  Contains compiled, minified, and/or optimized Javascript code, sprite images, etc.<br/>
  Source code folder: [`/private/assets`](#folder-private-assets)<br/>
  Do **not manually modify** the contents of this folder. Instead, compile the files through the [`/private/assets`](#folder-private-assets) folder. For details, see [Compiling view files and public assets](#compiling-view-files-and-public-assets).
    * <a name="folder-public-assets-cdn"></a>`/public/assets/cdn`<br/>
    Common libraries, e.g. Twitter Bootstrap.<br/>
    This folder is unique since it is **not** compiled like other assets from the [`/private/assets`](#folder-private-assets).
    **TODO:** Should be delivered through a trusted CDN website. For now, though, we store them ourselves. (See: https://github.com/Starbow/website/issues/2)
* <a name="folder-server"></a>`/server`<br/>
Server logic, exclusively.
  * <a name="folder-server-bootstrap"></a>`/bootstrap`
  The server's bootstrap/startup code. Runs for each worker spawned by the `cluster` module. Configures `express`, `passport`, routing, etc.
  * <a name="folder-server-config"></a>`/config`<br/>
  Contains server configurations such as log settings, database connection information, authentication data, etc.<br/>
  These configurations apply to Master as well as all Worker processes spawned by `cluster`.
    * <a name="folder-server-config-env"></a>`/env`<br/>
    Environment specific configurations ("production", "development", or "test").
  * <a name="folder-server-data"></a>`/data`<br/>
  Data folder containing logs, cached data, and temporarily stored files. The folder is excluded from Git, but will automatically be generated on system startup (in the bootstrap).
  * <a name="folder-server-mvc"></a>`/mvc`<br/>
  Model-View-Controller (MVC) files.
    * <a name="folder-server-mvc-controllers"></a>`/controllers`<br/>
    Controller files. Corresponds to the specified router paths.
    * <a name="folder-server-mvc-models"></a>`/models`<br/>
    Models. They do the hard number crunching and communicates with the database.<br/>
    Please implement models in a way that supports [integration](#folder-tests-integration) and [unit](#folder-tests-unit) tests. Often, this means heavy use of dependency injection.
    * <a name="folder-server-mvc-views"></a>`/views`<br/>
    React view templates. The source code templates, `*.jsx`, must be compiled before running the application. For details, see [Compiling view files and public assets](#compiling-view-files-and-public-assets).
  * <a name="folder-tests"></a>`/tests`<br/>
  Contains tests written the verify the logic in the application, e.g. for models like "User".
    * <a name="folder-tests-integration"></a>`/integration`<br/>
    Integration tests. I.e. verify that different modules work together and produce expected outcome.
    * <a name="folder-tests-unit"></a>`/unit`<br/>
    Unit tests. I.e. verify that a single module works and the internal logic produces expected results.

---

# Resources

## Good demo/skeleton apps

1. https://github.com/madhums/node-express-mongoose-demo/
2. https://github.com/meanjs/mean
