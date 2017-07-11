var _ = require('underscore');

module.exports = function($) {

    $.add({
        tags: [{
            type: String,
            lowercase: true,
            trim: true
        }]
    });

    $.pre('validate', function(next) {
        var model = this;

        if (model.isModified('tags')) {
            model.tags = _.compact(_.unique(model.tags));
        }
        return next();
    });

    $.statics.tagsQuery = function(tags) {
        return {
            tags: {
                $in: tags
            }
        }
    };

    $.statics.findByTags = function(tags, callback) {
        this.find(this.tagsQuery(tags), callback);
    };

    return $;
};