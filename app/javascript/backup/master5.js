// jshint esversion: 6
// (function(){
// TODO: Sanetize output

// var objecto = {
//     metadata: {uidPosition: 4},
//     elements: [
//         {element: 'section', params: {uid: 0, class:'sectionClass'}, elements: [
//             {element: 'section', params: {uid: 2, class:'sectionClass'}, elements: [
//                 {element: 'button', content: 'click me', params: {uid: 3, class:'bttnClass'}},
//                 {element: 'input', params: {uid: 4, class:'inputClass', type: 'text'}}
//             ]}
//         ]},
//         {element: 'button', params: {uid: 1, class:'bttnClass'}, content: 'click me'}
//     ]
// };

var objecto = {
    metadata: {uidPosition: 4},
    elements: [
        {element: 'section', params: {uid: 0, class:'sectionClass'}, elements: [
            {element: 'section', params: {uid: 2, class:'sectionClass'}, elements: [
                {element: 'button', content: 'click me', params: {uid: 3, class:'bttnClass'}},
                {element: 'input', params: {uid: 4, class:'inputClass', type: 'text', value: 10}}
            ]}
        ]},
        {element: 'button', params: {uid: 1, class:'bttnClass'}, content: 'click me'}
    ]
};

var lastElementCreated;

// ------------------------------------------------------------------
// Objects / data
// ------------------------------------------------------------------

// let objecto = {
//     metadata: {
//         uidPosition: 6
//     },
//     elements: [
//         {element: 'section', params: {uid: 0, class:'sectionClass'}, elements: [
//             {element: 'section', params: {uid: 2, class:'sectionClass'}, elements: [
//                 {
//                     element: 'button',
//                     content: 'click me',
//                     params: {
//                         uid: 5,
//                         class: 'bttnClass'
//                     },
//                 },
//                 {
//                     element: 'button',
//                     content: 'click me',
//                     params: {
//                         uid: 6,
//                         class: 'bttnClass'
//                     },
//                 },
//             ]}
//         ]},
//         {
//             element: 'button',
//             content: 'click me',
//             params: {
//                 uid: 3,
//                 class: 'bttnClass'
//             }
//         }, {
//             element: 'input',
//             params: {
//                 uid: 4,
//                 class: 'inputClass',
//                 type: 'text',
//                 value: 10
//             }
//         }, {
//             element: 'button',
//             params: {
//                 uid: 1,
//                 class: 'bttnClass'
//             },
//             content: 'click me'
//         }
//     ]
// };

let emptyData = {
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

// TODO: elements in elements don't have uid yet!!!!!!
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

// ------------------------------------------------------------------
// ElementEngine
// ------------------------------------------------------------------

var elementEngine = {
    localStorageObjectName: 'obj',
    localStorageTarget: 'obj',

    findUid: function(source, uid) {
        if (source.params != null && source.params.uid != null && source.params.uid === uid) {
            return source;
        } else {
            if (Array.isArray(source.elements)) {
                for (var i = 0; i < source.elements.length; i++) {
                    var newTarget = source.elements[i];
                    var result = this.findUid(newTarget, uid)
                    if (result != null) {
                        return result;
                    }
                }
            }
        }
    },
    addElement: function(target, element) {
        if (typeof target !== 'undefined') {
            if (typeof target.elements !== 'undefined') {
                target.elements.push(element);
            } else {
                target.elements = [element];
            }
        }
    },

    logToData: function(elementObj, nodeTarget) {
        var dataObj = JSON.parse(localStorage.getItem(this.localStorageObjectName));
        var currentUidPosition = dataObj['metadata']['uidPosition'];
        var newUidPosition = currentUidPosition + 1;

        var newElementData = elementObj;

        dataObj.metadata.uidPosition = newUidPosition;

        newElementData.params.uid = newUidPosition;

        if (typeof nodeTarget == 'undefined') {
            console.log('nodeTarget is not defined');
            //if no uid is specified then add to outer layer
            dataObj.elements.push(newElementData);
        } else {
            this.addElement(this.findUid(dataObj, nodeTarget), newElementData);
        }

        localStorage.setItem(this.localStorageObjectName, JSON.stringify(dataObj));
    },
    logToDataV2: function(elementData, nodeTarget, dataTarget, jsonBool) {
        var dataTargetValidated;
        
        if (jsonBool) {
            console.log(dataTarget);
            dataTargetValidated = JSON.parse(dataTarget);
        } else {
            dataTargetValidated = dataTarget;
        }
        var elementDataUid = incrementUidPosition(dataTarget);
        elementData.params.uid = elementDataUid;
        
        if (typeof nodeTarget == 'undefined') {
            console.log('nodeTarget is not defined');
            dataTargetValidated.elements.push(newElementData);
        } else {
            this.addElement(this.findUid(dataTargetValidated, nodeTarget), elementData);
        }
        if (jsonBool) {
            elementDataJSONified = JSON.stringify(elementData);
            localStorage.setItem(this.localStorageTarget, elementDataJSONified);
        }
        return elementDataUid;
    },

    createElement: function(elementObj, logBool, nodeTargetIdentifier) {
        console.log(elementObj);
        // create base Element
        var elementObjCleaned;
        if (elementObj.elements) {
            console.log('obj has children');
            var tempObj;
            tempObj = elementObj;
            delete tempObj.elements;
            elementObjCleaned = tempObj;
            // tempObj = undefined;
        } else {
            elementObjCleaned = elementObj;
        }
        // elementObjCleaned = elementObj;
        var newElement = document.createElement(elementObjCleaned.element);
        // set innerHTML
        if (elementObjCleaned.hasOwnProperty('content')) {
            newElement.innerHTML = elementObjCleaned.content;
        }

        // set params from object as html attributes
        if (elementObjCleaned.hasOwnProperty('params')) {
            for (var key in elementObjCleaned.params) {
                newElement.setAttribute(key, elementObjCleaned.params[key]);
            }
        }
        
        // check if nodeTargetIdentifier is given (is child element) else default
        if (typeof nodeTargetIdentifier == 'undefined') {
            document.getElementsByClassName('contentArea')[0].appendChild(newElement);
        } else {
            document.querySelector('[uid="' + nodeTargetIdentifier + '"]').appendChild(newElement);
        }
        // if the element has children, create those elements and add them to the parent
        if (elementObj.hasOwnProperty('elements')) {
            // console.log('element has children');
            for (var i = 0; i < elementObj.elements.length; i++) {
                if (logBool === true) {
                    if(elementObj.elements[i].params.uid){
                        this.createElement(elementObj.elements[i], true, elementObj.params.uid);
                    } else {
                        this.createElement(elementObj.elements[i], true, 0);
                    }
                } else {
                    if(elementObj.elements[i].params.uid){
                        this.createElement(elementObj.elements[i], false, elementObj.params.uid);
                    } else {
                        this.createElement(elementObj.elements[i], false, 0);
                    }
                }
                
            }
        }

        // Logging to data structure
        if (logBool === true) {
            this.logToData(elementObjCleaned, nodeTargetIdentifier);
        }

        // return info about the created element
        var createdElementInfo = {
            uid: elementObjCleaned.params.uid
        };
        lastElementCreated = createdElementInfo;
        return createdElementInfo;

    },
    htmlFromData: function(elementData, logBool, nodeTarget){
        // make deep copy of elementData for further processing
        var deepElementData = JSON.parse(JSON.stringify(elementData));
        console.log(deepElementData);
        var newElement;
        var childElements;
        // var childElements;
        
        if (deepElementData.elements) {
            childElements = deepElementData.elements;
            // potential child elements in the elementObj need to be
            // removed so they can be individualy processed and don't get
            // pushed into the data target without getting assigned a uid and
            // incrementing the uidPosition
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
                // TODO: needs correct target, also rewrite 
                // var newElementUid = this.logToDataV2(deepElementData, nodeTarget, d, true);
                var newElementUid = this.incrementUidPosition(objecto);
                newElement.setAttribute("uid", newElementUid);
            }
        }
        if (nodeTarget) {
            document.querySelector('[uid="' + nodeTarget + '"]').appendChild(newElement);
        } else {
            document.getElementsByClassName('contentArea')[0].appendChild(newElement);
        }
        
        // console.log(childElements);
        if (childElements != null) {
            console.log(`childElements: ${childElements}`);
            // console.log(`${deepElementData} has childElements: ${childElements} `);
            for (var i = 0; i < childElements.length; i++) {
                if (deepElementData.params != null && deepElementData.params.uid != null){
                    console.log('bye');
                    console.log('uid is defined');
                    this.htmlFromData(childElements[i], true, deepElementData.params.uid)
                } else {
                    console.log(`hi`);
                    this.htmlFromData(childElements[i], true, newElementUid)
                }
                
                // if (logBool === true) {
                //     if(childElements[i].params.uid){
                //         
                //         this.createElement(childElements[i], true, elementObj.params.uid);
                //     } else {
                //         this.createElement(childElements[i], true, 0);
                //     }
                // } else {
                //     if(childElements[i].params.uid){
                //         this.createElement(childElements[i], false, elementObj.params.uid);
                //     } else {
                //         this.createElement(childElements[i], false, 0);
                //     }
                // }
                
            }
        }
        
    },
    // recreateElements: function(source) {
    //     for (var i = 0; i < source.elements.length; i++) {
    //         if (source.elements[i].hasOwnProperty('element')) {
    //             this.createElement(source.elements[i], false)
    //         }
    //     }
    // 
    // },
    getUidPosition: function(source){
        return source.metadata.uidPosition;
    },
    setNewUidPosition: function(source, newUidPosition){
        source.metadata.uidPosition = newUidPosition;
        return newUidPosition;
    },
    incrementUidPosition: function(source){
        return this.setNewUidPosition(source, this.getUidPosition(source) + 1);
    },
    // createElementV2: function(elementObj, logBool, nodeTargetIdentifier) {
    //     if ELEMENTOBJ.elements === true 
    //         CHILDELEMENTS = ELEMENTOBJ.elements
    //         delete ELEMENTOBJ.elements
    //     new ELEMENT
    //     set ELEMENT.innerHTML
    //     set ELEMENT.properties
    //     if LOG === true
    //         ELEMENT.getNewUID()
    //     nodeTargetIdentifier.append(ELEMENT)
    //     
    //     
    //     
    //     if CHILDELEMENTS === true
    //         CHILDELEMENTS.forEach(
    //             createELement(CHILDELEMNTS.element)
    //         )
    //     else if ELEMENT.nodeTargetIdentifier === true
    //         get NODE.nodeTargetIdentifier
    //         .append ELEMENT
    //     else
    //         get defult NODE
    //         .append ELEMENT
    // },
    
    
    // recreateElements: function(source) {
    //     for (var i = 0; i < source.elements.length; i++) {
    //         if (source.elements[i].hasOwnProperty('element')) {
    //             this.createElement(source.elements[i], false)
    //         }
    //     }
    // 
    // },
    buildHtml: function(source) {
        for (var i = 0; i < source.elements.length; i++) {
            if (source.elements[i].hasOwnProperty('element')) {
                this.htmlFromData(source.elements[i], false)
            }
        }

    },
    // fakeAjax : function(){
    //     console.log(JSON.stringify(obj));
    // },
    // saveToLocalStorage : function(value){
    //     localStorage.setItem("obj", value)
    // }
}
let elementEngingeConfig = {
    
}
// 
// function elementEngineV3 () {
//     dataInterface () => {
//         uidInterface () => {
//             
//         }
//     }
// }
// 
// let uidInterface = {
//     getPosition: (source) => source.metadata.uidPosition,
//     setPosition: (source, newUid) => source.metadata.uidPosition = newUid
// }
// function uidInterface() {
//   getPosition(source) => source.metadata.uidPosition
//   setPosition: (source, newUid) => source.metadata.uidPosition = newUid
//   advancePostion: (source) => 
//   this.elementEngineV2.dataInterface.uidInterface.getPosition(source)
// }
let elementEngineV3 = {
    dataInterface: {
        getSource: function(dataSource) { 
            this.source = dataSource;
            return this;
        },
        uidInterface: {
            getPosition: function(){
                return this.parent.source.metadata.uidPosition;
            },
            setPosition: function(uidPositionX){
                this.source.metadata.uidPosition = uidPositionX;
                // return this;
            },
            advancePosition: function() {
                this.setPosition(this.getPosition() + 1);
                return this;
            },
            findUid: function(uid, source) {
                if (!source) {
                    var source = this.source;
                }
                if (source.params != null && 
                    source.params.uid != null && 
                    source.params.uid === uid) 
                {
                    return source;
                } else {
                    if (Array.isArray(source.elements)) {
                        for (var i = 0; i < source.elements.length; i++) {
                            var newTarget = source.elements[i];
                            var result = this.findUid(uid, newTarget)
                            if (result != null) {
                                return result;
                            }
                        }
                    }
                }
            }
        },
        createDataElement: function(){},
        logToData: function(){
            console.log(this.uidInterface.source);
            // var dataObj = JSON.parse(localStorage.getItem(this.localStorageObjectName));
            // 
            // var currentUidPosition = dataObj['metadata']['uidPosition'];
            // var newUidPosition = currentUidPosition + 1;
            // 
            // var newElementData = elementObj;
            // 
            // dataObj.metadata.uidPosition = newUidPosition;
            // 
            // newElementData.params.uid = newUidPosition;
            // 
            // if (typeof nodeTargetIdentifier == 'undefined') {
            //     console.log('nodeTargetIdentifier is not defined');
            //     //if no uid is specified then add to outer layer
            //     dataObj.elements.push(newElementData);
            // } else {
            //     this.addElement(this.findUid(dataObj, nodeTargetIdentifier), newElementData);
            // }
            // 
            // localStorage.setItem(this.localStorageObjectName, JSON.stringify(dataObj));
        },
    },
    htmlInterface: {
        findElementByUid: function(uid){
            return document.querySelector(`[uid="${uid}"]`);
            // console.log(`[uid="${uid}"]`);
        },
        createHtmlElement: function(){},
    },
    buildHtmlFromData: function(){},
    test: {
        test: () => {
            console.log(this);
        },
    }
};
let elementEngineV2 = {
    dataInterface3: {
        uidInterface: {
            source: undefined,
            // uidPosition: undefined,
            getSource: function(dataSource) { 
                this.source = dataSource;
                return this;
            },
            getPosition: function(){
                return this.source.metadata.uidPosition;
            },
            setPosition: function(uidPositionX){
                this.source.metadata.uidPosition = uidPositionX;
                // return this;
            },
            advancePosition: function() {
                this.setPosition(this.getPosition() + 1);
                return this;
            }
        },
    },
    dataInterface2(){
        let getPosition = (source) => source.metadata.uidPosition;
        let setPosition = (source, newUid) => source.metadata.uidPosition = newUid;
        let advancePostion = (source) => 
            elementEngineV2.dataInterface.uidInterface.getPosition(source);
    },
    dataInterface: {
        uidInterface: {
            _this: this,
            getPosition: (source) => source.metadata.uidPosition,
            setPosition: (source, newUid) => source.metadata.uidPosition = newUid,
            advancePostion: (source) => 
                elementEngineV2.dataInterface.uidInterface.getPosition(source),
        },
        createDataElement: function(){},
        logToData: function(){},
    },
    htmlInterface: {
        findElementByUid: function(){},
        createHtmlElement: function(){},
    },
    buildHtmlFromData: function(){},
    test: {
        test: () => {
            console.log(this);
        },
    }
}
// console.log(elementEngineV2.dataInterface.uidInterface.advancePostion2(objecto));




var makeDraggable = function() {
    var elements = document.querySelectorAll('[uid]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('draggable', 'true');
    }
}

var makeUnDraggable = function() {
    var elements = document.querySelectorAll('[uid]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('draggable', 'false');
    }
}

elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
// elementEngine.recreateElements(objecto);
var resetData = function() {
    localStorage.setItem('obj', JSON.stringify(objecto));
    var myNode = document.getElementsByClassName('contentArea')[0];
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
};
var clearData = function() {
    localStorage.setItem('obj', JSON.stringify(emptyData));
    var myNode = document.getElementsByClassName('contentArea')[0];
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    elementEngine.recreateElements(JSON.parse(localStorage.getItem('obj')));
};

// ------------------------------------------------------------------
// EVENT-LISTENER
// ------------------------------------------------------------------

var sectionBttn = document.getElementsByClassName('sectionBttn')[0];
var clearBttn = document.getElementsByClassName('clearBttn')[0];
var inputBttn = document.getElementsByClassName('inputBttn')[0];
var buttonBttn = document.getElementsByClassName('buttonBttn')[0];
var resetBttn = document.getElementsByClassName('resetBttn')[0];
var logBttn = document.getElementsByClassName('logBttn')[0];

sectionBttn.addEventListener('click', function() {
    // lastElementCreated =
    elementEngine.createElement(elementBase.section, true);
});
clearBttn.addEventListener('click', function() {
    clearData();
});
inputBttn.addEventListener('click', function(lastElementCreated) {
    elementEngine.htmlFromData(elementBase.input, true, 0);
});
buttonBttn.addEventListener('click', function() {
    elementEngine.createElement(elementBase.button, true);
});
resetBttn.addEventListener('click', function() {
    resetData();
});
logBttn.addEventListener('click', function() {
    console.log(JSON.parse(localStorage.getItem('obj')));
});

// var lastCalledNode;
document.getElementsByClassName('contentArea')[0].addEventListener('click', function(e) {
    var leftPad = function(source) {
        if (source.length == 3) {
            return source;
        } else if (source.length == 2) {
            return ' ' + source;
        } else {
            return '  ' + source;
        }
    }

    var nodeList = document.querySelectorAll(':hover');
    var lastNode = {
        element: nodeList[nodeList.length - 1],
        uid: function() {
            return leftPad(this.element.getAttribute('uid'))
        },
        tagName: function() {
            return this.element.tagName
        }
    };

    lastCalledNode = lastNode.uid();
    console.table('uid:' + lastNode.uid() + ' tagName:' + lastNode.tagName());
})

var createPseudoElements = function() {

    var nodeList = document.querySelectorAll('[uid]');
    nodeList.forEach(function(e) {
        var pseudoElement = document.createElement('DIV');
        pseudoElement.setAttribute('class', 'pseudoEle');
        // console.log(e.getAttribute('uid'));
        referenceNode = document.querySelector('[uid="' + e.getAttribute('uid') + '"]');
        // console.log(referenceNode);
        referenceNode.parentNode.insertBefore(pseudoElement, referenceNode)
        // referenceNode.parentNode.insertBefore(pseudoElement, referenceNode.nextSibling);
    })

    // forEach(function(e){
    //     e.parrentNode.insertBefore(pseudoElement, e.nextSibling);
    //
    // });
}

var destroyPseudoElements = function() {
    // console.log(document.getElementsByClassName("pseudoEle")[].parrentNode);
    if (document.getElementsByClassName('psuedoEle') && document.getElementsByClassName('pseudoEle')[0] && document.getElementsByClassName('pseudoEle')[0].parentNode) {
        document.getElementsByClassName('pseudoEle')[0].parentNode.removeChild(document.getElementsByClassName('pseudoEle')[0]);
        destroyPseudoElements();
    }
    // while (document.getElementsByClassName("pseudoEle")) {
    // console.log(document.getElementsByClassName("pseudoEle").parentNode);
    //     document.getElementsByClassName("pseudoEle")[0].parentNode.removeChild(document.getElementsByClassName("pseudoEle")[0]);
    // }
    // var nodeList = document.getElementsByClassName('pseudoEle');
    // for (i = 0; i < nodeList.lenght; i++) {
    //     nodeList[i].innerHTML = "hello world";
    //     // delete nodeList[i];
    // }
    // Array.prototype.forEach.call(nodeList, function(e){
    //     e.parrentNode.removeChild(e)
    // })
    // console.log(document.getElementsByClassName("pseudoEle"));
}
// })();