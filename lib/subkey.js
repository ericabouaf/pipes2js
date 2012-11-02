

exports.subkey = function (item, subkey) {
    var src = item;

    var pathItems = subkey.split('.'), i;

    if (pathItems.length > 1) {
        for (i = 0; i < pathItems.length - 1; i += 1) {
            src = src[pathItems[i]];
        }
    }

    return src[pathItems[pathItems.length - 1]];
};

