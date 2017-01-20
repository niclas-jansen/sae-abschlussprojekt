var _this = this;
var objecto = {
    metadata: { uidPosition: 4 },
    elements: [
        { element: 'section', params: { uid: 0, class: 'sectionClass' }, elements: [
                { element: 'section', params: { uid: 2, class: 'sectionClass' }, elements: [
                        { element: 'button', content: 'click me', params: { uid: 3, class: 'bttnClass' } },
                        { element: 'input', params: { uid: 4, class: 'inputClass', type: 'text', value: 10 } }
                    ] }
            ] },
        { element: 'button', params: { uid: 1, class: 'bttnClass' }, content: 'click me' }
    ]
};
var lastElementCreated;
var emptyData = {
    metadata: {
        uidPosition: 0
    },
    elements: [
        {
            element: 'section',
            params: {
                uid: 0,
                class: 'sectionClass'
            }
        }
    ]
};
var elementBase = {
    section: {
        element: 'section',
        params: {
            class: 'sectionClass'
        }
    },
    button: {
        element: 'button',
        content: 'click Me',
        params: {
            class: 'bttnClass'
        }
    },
    input: {
        element: 'label',
        content: 'INPUT',
        params: {
            class: 'labelClass'
        },
        elements: [
            {
                element: 'input',
                params: {
                    class: 'inputClass',
                    type: 'text'
                },
                metadata: {
                    relation: 'label'
                }
            },
        ],
    },
};
var elementEngine = {
    localStorageObjectName: 'obj',
    localStorageTarget: 'obj',
    findUid: function (source, uid) {
        if (source.params != null && source.params.uid != null && source.params.uid === uid) {
            return source;
        }
        else {
            if (Array.isArray(source.elements)) {
                for (var i = 0; i < source.elements.length; i++) {
                    var newTarget = source.elements[i];
                    var result = this.findUid(newTarget, uid);
                    if (result != null) {
                        return result;
                    }
                }
            }
        }
    },
    addElement: function (target, element) {
        if (typeof target !== 'undefined') {
            if (typeof target.elements !== 'undefined') {
                target.elements.push(element);
            }
            else {
                target.elements = [element];
            }
        }
    },
    logToData: function (elementObj, nodeTarget) {
        var dataObj = JSON.parse(localStorage.getItem(this.localStorageObjectName));
        var currentUidPosition = dataObj['metadata']['uidPosition'];
        var newUidPosition = currentUidPosition + 1;
        var newElementData = elementObj;
        dataObj.metadata.uidPosition = newUidPosition;
        newElementData.params.uid = newUidPosition;
        if (typeof nodeTarget == 'undefined') {
            console.log('nodeTarget is not defined');
            dataObj.elements.push(newElementData);
        }
        else {
            this.addElement(this.findUid(dataObj, nodeTarget), newElementData);
        }
        localStorage.setItem(this.localStorageObjectName, JSON.stringify(dataObj));
    },
    createElement: function (elementObj, logBool, nodeTargetIdentifier) {
        console.log(elementObj);
        var elementObjCleaned;
        if (elementObj.elements) {
            console.log('obj has children');
            var tempObj;
            tempObj = elementObj;
            delete tempObj.elements;
            elementObjCleaned = tempObj;
        }
        else {
            elementObjCleaned = elementObj;
        }
        var newElement = document.createElement(elementObjCleaned.element);
        if (elementObjCleaned.hasOwnProperty('content')) {
            newElement.innerHTML = elementObjCleaned.content;
        }
        if (elementObjCleaned.hasOwnProperty('params')) {
            for (var key in elementObjCleaned.params) {
                newElement.setAttribute(key, elementObjCleaned.params[key]);
            }
        }
        if (typeof nodeTargetIdentifier == 'undefined') {
            document.getElementsByClassName('contentArea')[0].appendChild(newElement);
        }
        else {
            document.querySelector('[uid="' + nodeTargetIdentifier + '"]').appendChild(newElement);
        }
        if (elementObj.hasOwnProperty('elements')) {
            for (var i = 0; i < elementObj.elements.length; i++) {
                if (logBool === true) {
                    if (elementObj.elements[i].params.uid) {
                        this.createElement(elementObj.elements[i], true, elementObj.params.uid);
                    }
                    else {
                        this.createElement(elementObj.elements[i], true, 0);
                    }
                }
                else {
                    if (elementObj.elements[i].params.uid) {
                        this.createElement(elementObj.elements[i], false, elementObj.params.uid);
                    }
                    else {
                        this.createElement(elementObj.elements[i], false, 0);
                    }
                }
            }
        }
        if (logBool === true) {
            this.logToData(elementObjCleaned, nodeTargetIdentifier);
        }
        var createdElementInfo = {
            uid: elementObjCleaned.params.uid
        };
        lastElementCreated = createdElementInfo;
        return createdElementInfo;
    },
    htmlFromData: function (elementData, logBool, nodeTarget) {
        var deepElementData = JSON.parse(JSON.stringify(elementData));
        console.log(deepElementData);
        var newElement;
        var childElements;
        if (deepElementData.elements) {
            childElements = deepElementData.elements;
            delete deepElementData.elements;
        }
        if (deepElementData.element) {
            newElement = document.createElement(deepElementData.element);
        }
        if (deepElementData.content) {
            newElement.innerHTML = deepElementData.content;
        }
        if (deepElementData.params) {
            for (var key in deepElementData.params) {
                newElement.setAttribute(key, deepElementData.params[key]);
            }
        }
        if (logBool === true) {
            if (!deepElementData.params.uid && isNaN(deepElementData.params.uid)) {
                var newElementUid = this.incrementUidPosition(objecto);
                newElement.setAttribute("uid", newElementUid);
            }
        }
        if (nodeTarget) {
            document.querySelector('[uid="' + nodeTarget + '"]').appendChild(newElement);
        }
        else {
            document.getElementsByClassName('contentArea')[0].appendChild(newElement);
        }
        if (childElements != null) {
            console.log("childElements: " + childElements);
            for (var i = 0; i < childElements.length; i++) {
                if (deepElementData.params != null && deepElementData.params.uid != null) {
                    console.log('bye');
                    console.log('uid is defined');
                    this.htmlFromData(childElements[i], true, deepElementData.params.uid);
                }
                else {
                    console.log("hi");
                    this.htmlFromData(childElements[i], true, newElementUid);
                }
            }
        }
    },
    getUidPosition: function (source) {
        return source.metadata.uidPosition;
    },
    setNewUidPosition: function (source, newUidPosition) {
        source.metadata.uidPosition = newUidPosition;
        return newUidPosition;
    },
    incrementUidPosition: function (source) {
        return this.setNewUidPosition(source, this.getUidPosition(source) + 1);
    },
    buildHtml: function (source) {
        for (var i = 0; i < source.elements.length; i++) {
            if (source.elements[i].hasOwnProperty('element')) {
                this.htmlFromData(source.elements[i], false);
            }
        }
    },
};
var elementEngingeConfig = {};
var elementEngineV3 = {
    dataInterface: {
        getSource: function (dataSource) {
            this.source = dataSource;
            return this;
        },
        uidInterface: {
            getPosition: function () {
                return this.parent.source.metadata.uidPosition;
            },
            setPosition: function (uidPositionX) {
                this.source.metadata.uidPosition = uidPositionX;
            },
            advancePosition: function () {
                this.setPosition(this.getPosition() + 1);
                return this;
            },
            findUid: function (uid, source) {
                if (!source) {
                    var source = this.source;
                }
                if (source.params != null &&
                    source.params.uid != null &&
                    source.params.uid === uid) {
                    return source;
                }
                else {
                    if (Array.isArray(source.elements)) {
                        for (var i = 0; i < source.elements.length; i++) {
                            var newTarget = source.elements[i];
                            var result = this.findUid(uid, newTarget);
                            if (result != null) {
                                return result;
                            }
                        }
                    }
                }
            }
        },
        createDataElement: function () { },
        logToData: function () {
            console.log(this.uidInterface.source);
        },
    },
    htmlInterface: {
        findElementByUid: function (uid) {
            return document.querySelector("[uid=\"" + uid + "\"]");
        },
        createHtmlElement: function () { },
    },
    buildHtmlFromData: function () { },
    test: {
        test: function () {
            console.log(_this);
        },
    }
};
var elementEngineV2 = {
    dataInterface3: {
        uidInterface: {
            source: undefined,
            getSource: function (dataSource) {
                this.source = dataSource;
                return this;
            },
            getPosition: function () {
                return this.source.metadata.uidPosition;
            },
            setPosition: function (uidPositionX) {
                this.source.metadata.uidPosition = uidPositionX;
            },
            advancePosition: function () {
                this.setPosition(this.getPosition() + 1);
                return this;
            }
        },
    },
    dataInterface2: function () {
        var getPosition = function (source) { return source.metadata.uidPosition; };
        var setPosition = function (source, newUid) { return source.metadata.uidPosition = newUid; };
        var advancePostion = function (source) {
            return elementEngineV2.dataInterface.uidInterface.getPosition(source);
        };
    },
    dataInterface: {
        uidInterface: {
            _this: this,
            getPosition: function (source) { return source.metadata.uidPosition; },
            setPosition: function (source, newUid) { return source.metadata.uidPosition = newUid; },
            advancePostion: function (source) {
                return elementEngineV2.dataInterface.uidInterface.getPosition(source);
            },
        },
        createDataElement: function () { },
        logToData: function () { },
    },
    htmlInterface: {
        findElementByUid: function () { },
        createHtmlElement: function () { },
    },
    buildHtmlFromData: function () { },
    test: {
        test: function () {
            console.log(_this);
        },
    }
};
var makeDraggable = function () {
    var elements = document.querySelectorAll('[uid]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('draggable', 'true');
    }
};
var makeUnDraggable = function () {
    var elements = document.querySelectorAll('[uid]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('draggable', 'false');
    }
};
elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
var resetData = function () {
    localStorage.setItem('obj', JSON.stringify(objecto));
    var myNode = document.getElementsByClassName('contentArea')[0];
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
};
var clearData = function () {
    localStorage.setItem('obj', JSON.stringify(emptyData));
    var myNode = document.getElementsByClassName('contentArea')[0];
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
};
var sectionBttn = document.getElementsByClassName('sectionBttn')[0];
var clearBttn = document.getElementsByClassName('clearBttn')[0];
var inputBttn = document.getElementsByClassName('inputBttn')[0];
var buttonBttn = document.getElementsByClassName('buttonBttn')[0];
var resetBttn = document.getElementsByClassName('resetBttn')[0];
var logBttn = document.getElementsByClassName('logBttn')[0];
sectionBttn.addEventListener('click', function () {
    elementEngine.htmlFromData(elementBase.section, true, 0);
});
clearBttn.addEventListener('click', function () {
    clearData();
});
inputBttn.addEventListener('click', function (lastElementCreated) {
    elementEngine.htmlFromData(elementBase.input, true, 0);
});
buttonBttn.addEventListener('click', function () {
    elementEngine.htmlFromData(elementBase.button, true, 0);
});
resetBttn.addEventListener('click', function () {
    resetData();
});
logBttn.addEventListener('click', function () {
    console.log(JSON.parse(localStorage.getItem('obj')));
});
var lastCalledNode;
document.getElementsByClassName('contentArea')[0].addEventListener('click', function (e) {
    var leftPad = function (source) {
        if (source.length == 3) {
            return source;
        }
        else if (source.length == 2) {
            return ' ' + source;
        }
        else {
            return '  ' + source;
        }
    };
    var nodeList = document.querySelectorAll(':hover');
    var lastNode = {
        element: nodeList[nodeList.length - 1],
        uid: function () {
            return leftPad(this.element.getAttribute('uid'));
        },
        tagName: function () {
            return this.element.tagName;
        }
    };
    lastCalledNode = lastNode.uid();
    console.table('uid:' + lastNode.uid() + ' tagName:' + lastNode.tagName());
});
var createPseudoElements = function () {
    var nodeList = document.querySelectorAll('[uid]');
    nodeList.forEach(function (e) {
        var pseudoElement = document.createElement('DIV');
        pseudoElement.setAttribute('class', 'pseudoEle');
        var referenceNode = document.querySelector('[uid="' + e.getAttribute('uid') + '"]');
        referenceNode.parentNode.insertBefore(pseudoElement, referenceNode);
    });
};
var destroyPseudoElements = function () {
    if (document.getElementsByClassName('psuedoEle') && document.getElementsByClassName('pseudoEle')[0] && document.getElementsByClassName('pseudoEle')[0].parentNode) {
        document.getElementsByClassName('pseudoEle')[0].parentNode.removeChild(document.getElementsByClassName('pseudoEle')[0]);
        destroyPseudoElements();
    }
};
