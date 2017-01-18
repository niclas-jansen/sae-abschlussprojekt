function findUid(source, uid) {
    if (source.params != null && source.params.uid === uid) {
        return source;
    } else {
        if (Array.isArray(source.elements)) {
            for (var i = 0; i < source.elements.length; i++) {
                var el = source.elements[i];
                var result = findUid(el, uid)
                if (result) 
                    return result
            }
        }
    }
}