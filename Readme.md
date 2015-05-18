npm package webix-mongo.
================================

Handling data for MongoDB.

How to use
-----------

### Installation

```sh
npm install webix-mongo
```

### API

```js
//Init handler.
var webix_mongo = require("webix-mongo");
```

```js
//Update value of "order" property
webix_mongo.changeOrderData(id, targetId, details);
```

- id - id of item for which new order value will be set.
- targetId - id of item after which you want to place the item.
- details - look below.

Method returns fulfilment promise.

```js
//Insert data into database.
webix_mongo.insertData(data, details);
```

- data - hash of data which will be inserted into database.
- details - look below.

Method returns fulfilment promise.

```js
//Update data in database.
webix_mongo.updateData(id, data, details);
```

- id - id of data which will be updated.
- data - hash of data which you use for updating.
- details - look below.

Method returns fulfilment promise.

```js
//Remove data by id.
webix_mongo.removeData(id, details);
```

- id - id of data which will be removed.

Method returns fulfilment promise.

```js
//Get data from database.
webix_mongo.getData(collectionState);

Method returns fulfilment promise.

```js
//Common parameters
- details - optional, can be used to specify a custom name for "order" property for example `{field_order: "my_order"}`
```

That is it.

License
----------

Webix is published under the GPLv3 license.

All other code is released under the MIT License:

Copyright (c) 2015

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.