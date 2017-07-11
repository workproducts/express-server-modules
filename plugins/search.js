var _ = require('underscore');

module.exports = function($, options) {

    options = options || {};
    var namespace = options.namespace || 'search';
    var fields = options.fields || [];

    var field = {};
    field[namespace] = String;

    $.add(field);

    $.pre('validate', function(next) {
        var model = this;
        var terms = _.map(fields, function(field) {
            var value = model.get(field);
            return _.isArray(value) ? value.join(' ') : value;
        }).join(' ');

        model[namespace] = terms;
        return next();
    });

    $.statics.searchQuery = function(find, search) {
        find = find || {};

        if (typeof find == 'string') {
            search = find;
            find = {};
        }
        if (search) {
            find[namespace] = new RegExp(search, 'i');
        }
        return find;
    };

    $.statics.findBySearch = function(find, search, options, callback) {
        this.find(this.searchQuery(find, search), {}, options, callback);
    };

    $.statics.paginateBySearch = function(find, search, options, callback) {
        if (typeof options == 'function') {
            callback = options;
            options = search;
            search = find;
            find = undefined;
        }
        this.paginate(this.searchQuery(find, search), options, callback);
    };

    return $;
};