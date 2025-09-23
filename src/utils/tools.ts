export function fileSizeFormat(bytes: number | undefined) {
    if (bytes === 0 || typeof bytes === 'undefined') return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const size = bytes / Math.pow(k, i);

    let displaySize;

    // 判断单位是否大于 MB
    if (i <= 2) { // 0:B, 1:KB, 2:MB
        displaySize = Math.round(size).toString();
    } else {
        displaySize = size.toFixed(1);
    }

    return `${displaySize} ${sizes[i]}`;
}

export function percentParse(finishSize: number | undefined, size: number | undefined){
    if (size == 0 || size < finishSize) {
        return 0
    } else {
        return parseInt((finishSize / size * 100).toFixed(1).replace(/\.?0+$/, ''));
    }
}


/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}


/**
 * @param {Object} json
 * @returns {String}
 */
export function objToURLParam(json: any) {
    if (!json) return ''
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return ''
            return key + '=' + json[key]
        })
    ).join('&')
}
