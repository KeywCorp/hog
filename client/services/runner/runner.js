/*
 * @license MIT
 * @file
 * @copyright KeyW Corporation 2016
 */


'use strict';

angular.module('hog')
  .service('Runner',
    function (Pig, $rootScope, $timeout, $log, $q, uuid4)
    {

      var holdData = {};

      $rootScope.$on('pig-error',
        function(msg)
        {
          console.log('error-msg', msg);
        });

      var args = [];
      var processes = {};
      var service = {
        process: list,
        procList: processes,
        args: args,
        list: list,
        simpleList: simpleList,
        create: create,
        get: get,
        getData: getData,
        update: update,
        destroy: destroy,
        kill: kill,
        run: run,
        runAndTrack: runAndTrack,
        save: update,
        bumpVersion: bump,
        recent: getMostRecent
      };

      return service;

      /**
       * Description
       * @method getData
       */
      function getData()
      {
        var temp =   list()
          .then(
            function(data)
            {
              // Might Need to Parse it
              var script = data.json;
            });
          return temp;
      }



      /**
       * Description
       * @method getMostRecent
       * @param {} _count
       * @param {} _type
       */
      function getMostRecent(_count, _type)
      {
        var deferred = $q.defer();
        Pig.emit('recent', {count: _count, type: _type});
        Pig.on('recents-'+_type,
          function(indata)
          {
            deferred.resolve(indata);
          });
        return deferred.promise;
      }



      /**
       * Description
       * @method bump
       * @param {} id
       */
      function bump(id)
      {
        var deferred = $q.defer();
        Pig.emit('bump', id);
        Pig.on('bumped',
          function(data)
          {
            deferred.resolve(data);

          });
        Pig.on('error',
          function(err)
          {
            $log.debug('error in saving data: ', err);
            deferred.reject(err);
          });
        return deferred.promise;
      }



      /**
       * Description
       * @method save
       * @param {} data
       */
      function save(data)
      {
        var deferred = $q.defer();
        Pig.emit('save', data);
        Pig.on('saved',
          function(indata)
          {
            if(indata._id == data._id)
              $log.debug('Script saved', data.name);
            deferred.resolve(indata);
          });
        Pig.on('error',
          function(err)
          {
            $log.debug('error in saving data: ', err);
            deferred.reject(err);
          });
        return deferred.promise;
      }



      /**
       * Description
       * @method list
       */
      function list()
      {
        var deferred = $q.defer();
        Pig.emit('index');
        $log.debug('requested index data');
        Pig.on('index',
          function(data)
          {
            $log.debug('returned index with data: ', data);

            deferred.notify({type: 'list', data: data});
            deferred.resolve(data);
          });
        Pig.on('error',
          function(err)
          {
            $log.debug('error in index data: ', err);
            deferred.reject(err);
          });
        return deferred.promise;
      }



      /**
       * Description
       * @method simpleList
       */
      function simpleList()
      {
        var deferred = $q.defer();
        Pig.emit('simpleIndex');
        $log.debug('requested simple index data');
        Pig.on('simpleIndex',
          function(data)
          {
            $log.debug('returned index with data: ', data);

            deferred.notify({type: 'list', data: data});
            deferred.resolve(data);
          });
        Pig.on('error',
          function(err)
          {
            $log.debug('error in index data: ', err);
            deferred.reject(err);
          });
        return deferred.promise;
      }



      /**
       * Description
       * @method create
       * @param {} procData
       */
      function create(procData)
      {
        var deferred = $q.defer();
        Pig.emit('create', angular.toJson(procData));
        Pig.on('server:create',
          function(data)
          {
            deferred.resolve(data);
            deferred.notify({type: 'create', data: data});
          });
        Pig.on('error',
          function(err)
          {
            deferred.reject(err);
          });
        return deferred.promise;
      }



      /**
       * Description
       * @method update
       * @param {} procData
       */
      function update(procData)
      {
        holdData = procData;
        var deferred = $q.defer();
        Pig.emit('update', {id: procData._id, obj: angular.toJson(procData)});
        Pig.on('update',
          function(data)
          {
            deferred.resolve(data);
          });
        Pig.on('error',
          function(err)
          {
            deferred.reject(err);
          });
        return deferred.promise;
      }



      /**
       * Description
       * @method destroy
       * @param {} id
       */
      function destroy(id)
      {
        var deferred = $q.defer();
        Pig.emit('destroy', id);
        Pig.on('destroy',
          function(data)
          {
            deferred.resolve(data);
          });
        Pig.on('error',
          function(err)
          {
            deferred.reject(err);
          });
        return deferred.promise;
      }



      /**
       * Description
       * @method get
       * @param {} id
       */
      function get(id)
      {
        var deferred = $q.defer();
        Pig.emit('show', id);
        Pig.on('show',
          function(data)
          {
            deferred.resolve(data);
          });
        Pig.on('error',
          function(err)
          {
            deferred.reject(err);
          });
        return deferred.promise;
      }



      /**
       * Description
       * @method kill
       * @param {} id
       */
      function kill(id)
      {
        var deferred = $q.defer();
        Pig.emit('kill', id);
        deferred.resolve({type: 'data', data: id});
        return deferred.promise;
      }



      /**
       * Description
       * @method run
       * @param {} id
       */
      function run(id)
      {
        var deferred = $q.defer();
        Pig.emit('run', id);

        Pig.on('run:end',
          function(data)
          {
            deferred.resolve({type: 'end', data: data});
          });

        Pig.on('run:progress',
          function(percent)
          {
            deferred.notify({type: 'progress', data: percent});
          });

        Pig.on('run:log',
          function(log)
          {
            deferred.notify({type: 'log', data: log});
          });

        Pig.on('run:warning',
          function(warning)
          {
            deferred.notify({type: 'warning', data: warning});
          });

        Pig.on('run:output',
          function(output)
          {
            deferred.notify({type: 'output', data: output});
          });

        Pig.on('pig:error',
          function(err)
          {
            deferred.notify({type: 'error', data: err});
          });

        return deferred.promise;
      }



      /**
       * Description
       * @method runAndTrack
       * @param {} id
       */
      function runAndTrack(id)
      {
        var deferred = $q.defer();
        Pig.emit('run:track', id);

        Pig.on('run:end',
          function(data)
          {
            deferred.resolve({type: 'end', data: data});
          });

        Pig.on('run:progress',
          function(percent)
          {
            deferred.notify({type: 'progress', data: percent});
          });

        Pig.on('run:log',
          function(log)
          {
            deferred.notify({type: 'log', data: log});
          });

        Pig.on('run:warning',
          function(warning)
          {
            deferred.notify({type: 'warning', data: warning});
          });

        Pig.on('run:output',
          function(output)
          {
            deferred.notify({type: 'output', data: output});
          });

        Pig.on('pig:error',
          function(err)
          {
            deferred.notify({type: 'error', data: err});
          });

        return deferred.promise;
      }



      /**
       * Description
       * @method createProc
       * @param {} args
       * @param {} data
       * @param {} procCB
       * @param {} updCB
       * @param {} endCB
       */
      function createProc(args, data, procCB, updCB, endCB)
      {
        var id = uuid4.generate();
        processes[id] = {
          args: args,
          data: data,
          pCB: procCB,
          uCB: updCB,
          eCB: endCB,
          id: id
        };

        Pig.emit('execute', {id: id, args: args, data: data});
        Pig.on('update',
          function(d)
          {
            if(uuid4.vaildate(d.id))
            {
              processes[d.id].uCB(d);
            }
          });

        Pig.on('progress',
          function(d)
          {
            if(uuid4.validate(d.id) && angular.isDefined(processes[d.id]))
            {
              processes[d.id].pCB(d);
            }
          });

        Pig.on('close',
          function(d)
          {
            if(uuid4.vaildate(d.id))
            {
              processes[d.id].eCB(d);
            }
          });
      }
    });

