module.exports = function($, options) {

    var namespace = options.namespace || 'docs';

    $.statics.paginate = function(finder, paging, callback) {
        var limit = parseInt(paging.pageSize);

        if (!limit) {
            return finder.exec(function(err, docs) {
                if (err) {
                    return callback(err);
                }
                var count = docs.length;
                var result = {
                    paging: {
                        total: count,
                        pageSize: count,
                        page: 1,
                        pages: 1
                    }
                };
                result[namespace] = docs;
                callback(null, result);
            });
        }

        var page = parseInt(paging.page) || 1;
        var skip = (page-1) * limit;

        var op = finder.op;
        finder.count(function(err, count) {
            if (err) {
                return callback(err);
            }
            var result = {
                paging: {
                    total: count,
                    pageSize: limit,
                    page: page,
                    pages: Math.ceil(count / limit) || 1
                }
            };
            if (count > 0) {
                finder.op = op;
                return finder.skip(skip).limit(limit).exec(function(err, docs) {
                    if (err) {
                        return callback(err);
                    }
                    result[namespace] = docs;
                    callback(null, result);
                });
            }
            result[namespace] = [];
            return callback(null, result);
        });
    };

    return $;
};