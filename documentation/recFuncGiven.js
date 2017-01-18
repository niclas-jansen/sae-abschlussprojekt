function findElementByUID(source, uid) {
    if (source.params != null && source.params.uid === uid) {
        return source
    } else {
        if (Array.isArray(source.elements)) {
            for (var i = 0; i < source.elements.length; i++) {
                var el = source.elements[i]
                var result = findElementByUID(el, uid)
                if (result != null) 
                    return result
            }
        }
    }
}