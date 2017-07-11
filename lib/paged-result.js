module.exports = function(namespace, paging, callback) {
    if (typeof paging === 'function') {
        callback = paging;
        paging = namespace;
        namespace = 'docs';
    }

    return function(err, result) {
        if (err) {
            return callback(err);
        }

        var data = {};

        var pageSize = parseInt(paging.pageSize);
        if (!pageSize) {
            data[namespace] = result;

            data.paging = {
                total: result.length,
                pages: 1,
                page: 1,
                pageSize: result.length
            };
            return callback(null, data);
        }

        var page = parseInt(paging.page) || 1;

        data[namespace] = result.slice((pageSize * (page - 1)), page * pageSize);

        data.paging = {
            total: result.length,
            pages: Math.ceil(result.length / pageSize) || 1,
            page: page,
            pageSize: pageSize
        };

        return callback(err, data);
    };
};