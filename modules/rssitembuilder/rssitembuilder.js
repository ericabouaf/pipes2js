
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    var item = {};

    if (input.title) {
        item.title = input.title;
        item["y:title"] = input.title;
    }
    if (input.description) {
        item.description = input.description;
    }
    if (input.link) {
        item.link = input.link;
    }
    if (input.pubdate) {
        item.pubDate = input.pubdate;
    }
            // TODO: y:published
    if (input.guid) {
        item.guid = input.guid;
        item["y:id"] = {value: input.guid};
    }
    if (input.author) {
        item.author = input.author;
    }
    if (input.mediaContentURL) {
        item["media:content"] = {
            "url": input.mediaContentURL,
            "type": input.mediaContentType,
            "width": input.mediaContentWidth,
            "height": input.mediaContentHeight
        };
    }
    if (input.mediaThumbURL) {
        item["media:thumbnail"] = {
            "url": input.mediaThumbURL,
            "width": input.mediaThumbWidth,
            "height": input.mediaThumbHeight
        };
    }

    task.respondCompleted({
        _OUTPUT: [item]
    });

};
