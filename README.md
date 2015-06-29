Starbow website
==============================

Code base for the Starbow website: http://starmodbow.com

* Server-side framework: [Node.js](https://nodejs.org/) with [`express`](https://www.npmjs.com/package/express)
* Database: [RethinkDB](http://rethinkdb.com/docs/install/)
* Client-side framework: [React](http://facebook.github.io/react/)

# Get started

**Prerequisites:**

1. [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. [Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint-elementary-os)
3. [RethinkDB](http://rethinkdb.com/docs/install/)

## Installation

1. Create/go to the directory on your machine from which you want to run the website code.
2. Clone repository: `git clone https://github.com/Starbow/website`
3. Run `npm install` to get all dependencies which are stored in the folder `node_modules`
4. Clone/download the live Rethink database and import it into your local environment. (**Note:** We should probably consider doing an automated script for this purpose)

## Configuring SSH-key for git

If you don't feel like writing your Git password every time you want to push to the GitHub repository, you should configure an SSH-key.

1. Generate SSH-key on your computer (https://help.github.com/articles/generating-ssh-keys/).
2. Add public SSH-key (default `id_rsa.pub`) to GitHub (https://github.com/settings/ssh).

## Running the application

1. In the root folder (`/website`), run `sudo node server.js` to start the application. (**Note:** Using port numbers below 3000, which 443 is, requires `sudo` privileges)
2. In your browser, go to: [https://localhost](https://localhost)

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

**Demo app:** For a good demo application/skeleton, see: https://github.com/madhums/node-express-mongoose-demo/

## Application workflow

1. The server receives a request, processes it through the MVC framework, and returns a response, most commonly being JSON to be received and processed by React. However, the response can also be XML, HTML, pure text, etc.
2. The client receives the response and React updates the view layer/UI.

## Server-side

We use `express` (https://www.npmjs.com/package/express) for managing the server app (ran through `server.js`).

## Database

(TODO)

## Client-side

(TODO)

## Application folder structure

The folders are structured as follows:

* [`/client`](#folder-client)
  * [`/layouts`](#folder-client-layouts)
  * [`/views`](#folder-client-views)
* [`/node_modules`](#folder-node_modules)
* [`/private`](#folder-private)
  * [`/app`](#folder-private-app)
  * [`/ssl`](#folder-private-ssl)
* [`/public`](#folder-public)
  * [`/app`](#folder-public-app)
  * [`/cdn`](#folder-public-cdn)
* [`/server`](#folder-server)
  * [`/boostrap`](#folder-server-bootstrap)
    * [`/config`](#folder-server-bootstrap-config)
      * [`/env`](#folder-server-bootstrap-config-env)
  * [`/mvc`](#folder-server-mvc)
    * [`/controllers`](#folder-server-mvc-controllers)
    * [`/models`](#folder-server-mvc-models)
    * [`/views`](#folder-server-mvc-views)
  * [`/scripts`](#folder-server-scripts)

### Folder structure details

---

<a name="folder-client"></a>
#### /client

Contains logic and views for the client, exclusively. I.e. it contains the shell UI React needs to update a view layer, based on e.g. a JSON response.

---

<a name="folder-client-layouts"></a>
##### /client/layouts

Layout files (also referred to as "page type templates") to be used and displayed in the client. These files are commonly HTML files functioning as wrappers with `head` and `body` tags.

Updated by React.

---

<a name="folder-client-views"></a>
##### /client/views

View files (or "content templates") to be used and displayed in the client. Commonly HTML files displaying page content a [layout](#folder-client-layouts) file.

Updated by React.

---

<a name="folder-node_modules"></a>
#### /node_modules

Do **not manually modify** the contents of this folder.

The list of Node.js modules as listed in `package.json`.

To **install** (add) a package:

```
npm install <package_name> --save
```

To **uninstall** (remove) a package:

```
npm uninstall <package_name> --save
```

---

<a name="folder-private"></a>
#### /private

Contains sensitive server-side assets, as opposed to the [`/public`](#folder-public) folder within which public assets (images, css, etc.) are stored.

---

<a name="folder-private-ssl"></a>
### /private/ssl

Contains SSL key and certificate.

**TODO:** Move this to nginx.

---

<a name="folder-private-app"></a>
##### /private/app

Contains unprocessed/uncompiled or source code files. These raw, unprocessed files may be Javascripts, CSS, image sprites, etc. which after being processed become available in the [`/public/app`](#folder-public-app) as their minified, optimized, and/or image sprite counterparts.

---

<a name="folder-public"></a>
#### /public

A publicly accessible folder within which assets (images, css, etc.) are stored.

All files in this folder are directly accessible in the URL by removing the `/public` namespace. E.g. if on the server the path is `/public/img.jpg`, the corresponding URL is: `https://localhost/img.jpg`

**DO NOT STORE SENSITIVE ASSETS HERE!** For sensitive assets which are used internally in the application, or source code, use the [`/private`](#folder-private) folder.

---

<a name="folder-public-app"></a>
##### /public/app

Contains compiled, minified, and/or optimized Javascript code, sprite images, etc.

Corresponds to the folder: [`/private/app`](#folder-private-app)

Do **not manually modify** the contents of this folder. Instead, compile the files through the [`/private/app`](#folder-private-app) folder.

---

<a name="folder-public-cdn"></a>
##### /public/cdn

Common libraries, e.g. Twitter Bootstrap.

**TODO:** Should be delivered through a trusted CDN website. For now, though, we store them ourselves.

---

<a name="folder-server"></a>
#### /server

Server logic, exclusively.

---

<a name="folder-server-bootstrap"></a>
##### /server/bootstrap

The server's bootstrap/startup code. Configures `express`, passport, routing, etc.

---

<a name="folder-server-bootstrap-config"></a>
###### /server/bootstrap/config

Contains server configurations such as database connection information and other authentication data.

---

<a name="folder-server-bootstrap-config-env"></a>
####### /server/bootstrap/config/env

Environment specific configurations ("production", "development", or "test").

---

<a name="folder-server-mvc"></a>
##### /server/mvc

Model-View-Controller (MVC) files.

---

<a name="folder-server-mvc-controllers"></a>
###### /server/mvc/controllers

Controller files. Corresponds to the specified router paths.

---

<a name="folder-server-mvc-models"></a>
###### /server/mvc/models

Models. They do the hard number crunching and communicates with the database.

---

<a name="folder-server-mvc-views"></a>
###### /server/mvc/views

View templates. Not used often since React will generally take care of the view layer/UI.

---
