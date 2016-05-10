'use strict';

var fs      = require('fs');
var _       = require('lodash');
var logger  = require('../../config/logger.js');
var path    = require('path');
var ds      = require('nedb');

var collection = new ds({filename: 'server/api/settings/settings.data.db', autoload: true, onload: function (err) { if(err) { logger.error('Error on load: ', err) }}});

exports.create = function(obj, cb)
{
  collection.insert(JSON.parse(obj),cb);
}
exports.list = function(cb)
{
  collection.find({}, cb);
}
exports.find = function(id, cb)
{
  if(typeof(id) == 'Number')
  {
    this.findById(id, cb);
  }
  else if(typeof(id) == 'string')
  {
    this.findByName(id, cb);
  }
}
exports.findByName = function(name, cb)
{
  collection.findOne({name: name}, cb);
}
exports.findById = function(id, cb)
{
  collection.findOne({_id: id}, cb);
}
exports.update = function(id, changes, cb)
{
  collection.update({_id: id}, JSON.parse(changes), {upsert: true},
    function(err, numAffected, affectedDocuments, upsert)
    {
      if(err)
      {
        logger.error(err);
        return cb(err);
      }
      //logger.debug('doc: ', doc, 'Changes: ', changes, 'affected Documents: ', affectedDocuments, 'Error', err, ' num affected: ', numAffected, 'upsert: ', upsert);
      cb(err, upsert);
    });
}
exports.delete = function(id, cb)
{
  collection.remove({_id: id}, cb);
}

