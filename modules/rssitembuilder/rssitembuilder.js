
exports.worker = function (task, config) {

    var input = JSON.parse(task.config.input);

    task.respondCompleted({
        _OUTPUT: [{
            "title": input.title,
            "y:title": input.title,
            "description": input.description,
            "link": input.link,
            "pubDate": input.pubdate,
            // TODO: y:published
            "author": input.author,
            "guid": input.guid,
            "y:id": { value: input.guid },

            "media:content": {
                "url": input.mediaContentURL,
                "type": input.mediaContentType,
                "width": input.mediaContentWidth,
                "height": input.mediaContentHeight
            },

            "media:thumbnail": {
                "url": input.mediaThumbURL,
                "width": input.mediaThumbWidth,
                "height": input.mediaThumbHeight
            }
        }]
    });

};
