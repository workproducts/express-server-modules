var _ = require('underscore');

module.exports = function($, defaultOptions) {

    $.statics.paginate = function(query, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        var Model = this;
        query = query || {};
        options = _.extend({}, defaultOptions, options);
        var namespace = options.namespace || 'docs';
        var select = options.select;
        var sort = options.sort;
        var populate = options.populate;
        var lean = !!options.lean;
        var limit = parseInt(options.limit) || 99999999;
        var page, offset, skip;

        if (options.offset) {
            offset = options.offset;
            skip = offset;
        } else if (options.page) {
            page = parseInt(options.page);
            skip = (page - 1) * limit;
        } else {
            page = 1;
            offset = 0;
            skip = offset;
        }

        //console.log('!!!query = ', query);
        var docsQuery = Model.find(query)
            .select(select)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(lean);
        if (populate) {
            _.each([].concat(populate), function(item) {
                docsQuery.populate(item);
            });
        }

        docsQuery.exec(function(err, docs) {
            if (err) {
                return callback(err);
            }
            Model.count(query, function(err, count) {
                if (err) {
                    return callback(err);
                }
                var result = {};
                var paging = {
                    total: count,
                    limit: limit
                };
                result[namespace] = docs;
                if (offset !== undefined) {
                    paging.offset = offset;
                }
                if (page !== undefined) {
                    paging.page = page;
                    paging.pages = Math.ceil(count / limit) || 1;
                }
                result.paging = paging;
                return callback(null, result);
            });
        });
    };

    return $;
};