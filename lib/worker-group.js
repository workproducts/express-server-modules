var $ = module.exports = {};

var es = require('express-server');

var async = require('async');
var _ = require('underscore');
var workerFarm = require('worker-farm');

$.run = function(opts, callback) {

    var items = opts.items;
    var itemKey = opts.itemKey;
    var workerFilePath = opts.workerFilePath;
    var concurrency = opts.concurrency;
    var jobDataKey = opts.jobDataKey;
    var workerMethodName = opts.workerMethodName;
    var additionalData = opts.additionalData;

    var itemIds = _.pluck(items, itemKey);
    var workers = workerFarm({ maxConcurrentWorkers: concurrency }, workerFilePath, [ workerMethodName ]);

    var itemGroups = [];
    _.times(concurrency, function(i) {
        itemGroups.push([]);
    });

    _.each(itemIds, function(pid, index) {
        var bucket = index % concurrency;
        itemGroups[ bucket ].push(pid);
    });

    async.each(
        itemGroups,
        function(itemIdGroup, groupDone) {
            if(itemIdGroup.length == 0) {
                return groupDone();
            }
            var jobData = additionalData ? additionalData : {};
            jobData[ jobDataKey ] = itemIdGroup;

            workers[ workerMethodName ](jobData, function(err) {
                if(err) {
                    return groupDone(err);
                }
                return groupDone();
            });
        },
        function(err) {
            workerFarm.end(workers);
            if(err) {
                return callback(err);
            }
            return callback();
        }
    );

};