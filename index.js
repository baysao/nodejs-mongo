var Mongo = require("mongoskin"),
    Promise = require("bluebird");

function _getDataCollection(db, collectionState) {
    var collection = db.collection(collectionState.handling);
    return Promise.promisifyAll(collection);
}

function Model() {
    this._db = null;

    this.setDb = function(db) {
        if(typeof db == "string")
            db = Mongo.db(db, {native_parser: true});

        this._db = db;
        return this;
    };

    this.getDb = function() {
        return this._db;
    };
}

Model.prototype.changeOrderData = function(idFrom, idTo, collectionState) {

    var objFrom = null,
        objTo = null,
        db = _getDataCollection(this._db, collectionState),
        fieldOrder = collectionState.field_order;

    if(!fieldOrder) {
        return new Promise(function(resolve) {
            resolve(null);
        });
    }

    return db.findByIdAsync(idFrom).then(function(dataObj) {
        objFrom = dataObj;
        var incrementObj = {};
        incrementObj[fieldOrder] = -1;

        return db.updateAsync({$where: "this." + fieldOrder + " >= " + objFrom[fieldOrder]}, {$inc: incrementObj}, {multi: true});
    }).then(function() {
        return db.findByIdAsync(idTo);
    }).then(function(dataObj) {
        objTo = dataObj;

        if(!objTo) {
            return new Promise(function(resolve, reject) {
                var incrementObj = {};
                incrementObj[fieldOrder] = -1;
                db.find({}, {sort: incrementObj}).limit(1).toArray(function(error, data) {
                    if(error)
                        reject(error);
                    else {
                        data = data[0];
                        data[fieldOrder] += 1;
                        objTo = data;
                        resolve(true);
                    }
                });
            });
        }
        else {
            var incrementObj = {};
            incrementObj[fieldOrder] = 1;
            return db.updateAsync({$where: "this." + fieldOrder + " >= " + objTo[fieldOrder]}, {$inc: incrementObj}, {multi: true});
        }
    }).then(function() {
        var setObj = {};
        setObj[fieldOrder] = objTo[fieldOrder];
        return db.updateByIdAsync(objFrom._id, {$set: setObj});
    });
};

Model.prototype.insertData = function(data, collectionState) {
    var db = _getDataCollection(this._db, collectionState),
        fieldOrder = collectionState.field_order;

    return new Promise(function(resolve, reject) {
        if(fieldOrder) {
            var sortObj = {};
            sortObj[fieldOrder] = -1;

            db.find({}, {sort: sortObj}).limit(1).toArray(function(error, dataArray) {
                if(error)
                    reject(error);
                else {
                    var nextOrder = (dataArray[0]) ? (dataArray[0][fieldOrder] + 1) : 0;
                    resolve(nextOrder);
                }
            });
        }
        else {
            resolve(null);
        }
    }).then(function(nextOrder) {
            if(fieldOrder)
                data[fieldOrder] = nextOrder;

            return db.insertAsync(data);
        }).then(function(insertedData) {
            insertedData = insertedData[0];
            insertedData.id = insertedData._id.toString();
            delete insertedData._id;
            delete insertedData[fieldOrder];
            return insertedData;
        });
};

Model.prototype.updateData = function(dataId, data, collectionState) {
    var db = _getDataCollection(this._db, collectionState);
    return db.updateByIdAsync(dataId, {$set: data});
};

Model.prototype.removeData = function(dataId, collectionState) {
    var db = _getDataCollection(this._db, collectionState),
        fieldOrder = collectionState.field_order;

    return db.findByIdAsync(dataId).then(function(data) {
        return new Promise(function(resolve, reject) {
            if(fieldOrder) {
                var incrementObj = {};
                incrementObj[fieldOrder] = -1;

                db.updateAsync({$where: "this." + fieldOrder + " >= " + data[fieldOrder]}, {$inc: incrementObj}, {multi: true}).then(function() {
                    resolve(true);
                }).error(function(error) {
                    reject(error);
                });
            }
            else
                resolve(true);
        });
    }).then(function() {
        return db.removeByIdAsync(dataId);
    });
};

Model.prototype.getData = function(collectionState) {
    var db = _getDataCollection(this._db, collectionState),
        fieldOrder = collectionState.field_order;

    return new Promise(function(resolve, reject) {
        var sortObj = {};
        sortObj[fieldOrder] = 1;

        db.find({}, {sort: sortObj}).toArray(function(error, dataArray) {
            if(error)
                reject(error);
            else {
                for(var i = 0; i < dataArray.length; i++) {
                    dataArray[i].id = dataArray[i]._id.toString();
                    delete dataArray[i]._id;
                    delete dataArray[i][fieldOrder];
                }
                resolve(dataArray);
            }
        });
    });
};

module.exports = new Model();