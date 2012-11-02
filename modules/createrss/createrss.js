
var subkey = require('../../lib/subkey').subkey;

exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var items = input._INPUT;

    items.forEach(function (item) {

        if (input.title) {
            item.title = subkey(item, input.title);
            item["y:title"] = item.title;
        } else if (item.title && !item["y:title"]) {
            item["y:title"] = item.title;
        }
        if (input.description) { item.description = subkey(item, input.description); }
        if (input.link) { item.link = subkey(item, input.link); }

        if (input.pubdate) { item.pubdate = subkey(item, input.pubdate); }
        if (input.author) { item.author = subkey(item, input.author); }
        if (input.guid) { item.guid = subkey(item, input.guid); }

        if (input.mediaContentURL) {
            if (!item["media:content"]) {
                item["media:content"] = {};
            }
            item["media:content"].url = subkey(item, input.mediaContentURL);

            if (input.mediaContentType) { item["media:content"].type = subkey(item, input.mediaContentType); }
            if (input.mediaContentWidth) { item["media:content"].width = subkey(item, input.mediaContentWidth); }
            if (input.mediaContentHeight) { item["media:content"].height = subkey(item, input.mediaContentHeight); }
        }

        if (input.mediaThumbURL) {
            if (!item["media:thumbnail"]) {
                item["media:thumbnail"] = {};
            }
            item["media:thumbnail"].url = subkey(item, input.mediaThumbURL);

            if (input.mediaThumbWidth) { item["media:thumbnail"].width = subkey(item, input.mediaThumbWidth); }
            if (input.mediaThumbHeight) { item["media:thumbnail"].height = subkey(item, input.mediaThumbHeight); }
        }

    });

    task.respondCompleted({
        _OUTPUT: items
    });

};

