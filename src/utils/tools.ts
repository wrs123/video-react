export function fileSizeFormat(bytes: number | undefined) {
    return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
}

export function percentParse(finishSize: number | undefined, size: number | undefined){
    if (size == 0 || size < finishSize) {
        return 0
    } else {
        return (finishSize / size * 100).toFixed(2).replace(/\.?0+$/, '');
    }
}