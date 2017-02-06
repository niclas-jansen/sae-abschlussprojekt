// jshint esversion: 6
// (function(){
// TODO: Sanetize output

// helper functions
let objDeepCopy = function(source) { 
    JSON.parse(JSON.stringify(source));
}
let insertAfter = function(newNode, referenceNode){
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
let leftPad = function(source, padLength, padType) {
    if (source.length != padLength) {
        let padding = ``;
        for(let i = source.length; i < padLength; i++) {
            padding += padType;
        }
        let paddedString = padding + source;
        return paddedString;
    }
    // if (source.length == 3) {
    //     return source;
    // } else if (source.length == 2) {
    //     return ' ' + source;
    // } else {
    //     return '  ' + source;
    // }
}
// app config
let debugging = true;


var lastElementCreated;

// ------------------------------------------------------------------
// Objects / data
// ------------------------------------------------------------------
// var objecto = {
//     metadata: {uidPosition: 4},
//     elements: [
//         {element: 'section', params: {uid: 0, class:'sectionClass'}, elements: [
//             {element: 'section', params: {uid: 2, class:'sectionClass'}, elements: [
//                 {element: 'button', content: 'click me', params: {uid: 3, class:'bttnClass'}},
//                 {element: 'input', params: {uid: 4, class:'inputClass', type: 'text', value: 10}}
//             ]}
//         ]},
//         {element: 'button', params: {uid: 1, class:'bttnClass'}, content: 'click me'}
//     ]
// };
var objecto = {
    metadata: {uidPosition: 0},
    elements: [
        {element: 'section', params: {uid: 0, class:'sectionClass'}},
    ]
};

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

/**
 * elementEngine
 * @type {Object}
 */
var elementEngine = {
    localStorageObjectName: 'obj',
    localStorageTarget: 'obj',
    getLocalS () {
        console.log(JSON.parse(localStorage.getItem(this.localStorageTarget)));
    },
    uid: {
        find: function(source, uid){
            
        },
        getPosition: function(source){
            return source.metadata.uidPosition;
        },
        setNewPosition: function(source, newUidPosition) {
            source.metadata.uidPosition = newUidPosition;
            return newUidPosition;
        },
        incrementPosition: function(source){
            return this.setNewPosition(source, this.getPosition(source) + 1);
        },
    },
    /**
     * This function finds and returns a key refference in an object based on 
     * the given uid key value
     * @param {Object} source Object to serach in
     * @param {number} uid number that is being searched for
     * @returns {Object} a refference of the position in the searched object where the uid was found
     */
    findUid (source, uid) {
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
    
    /**
     * [addElement description]
     * @param {[type]} target  [description]
     * @param {[type]} element [description]
     */
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
    /**
     * [logToDataV2 description]
     * @param  {Object} elementData The Object that is getting logged to the data target.
     * @param  {number} nodeTarget  Which node in the dataTarget the elementData is getting appended to.
     * @param  {[type]} dataTarget  Where the new data is getting put.
     * @param  {boolean} jsonBool    If the dataTarget is Json and needs to be parsed.
     * @return {number}             Returns the new uid that got assigned to the elementData
     */
    logToDataV2: function(elementData, nodeTarget, dataTarget, jsonBool) {
        // var dataTargetValidated;
        // 
        // if (jsonBool) {
        //     console.log(dataTarget);
        //     dataTargetValidated = JSON.parse(dataTarget);
        // } else {
        //     dataTargetValidated = dataTarget;
        // }
        // debugger;
        // var elementDataUid = this.incrementUidPosition(dataTarget);
        // elementData.params.uid = elementDataUid;
        // 
        // if (typeof nodeTarget == 'undefined') {
        //     console.log('nodeTarget is not defined');
        //     dataTargetValidated.elements.push(newElementData);
        // } else {
        //     this.addElement(this.findUid(dataTargetValidated, nodeTarget), elementData);
        // }
        // if (jsonBool) {
        //     elementDataJSONified = JSON.stringify(elementData);
        //     localStorage.setItem(this.localStorageTarget, elementDataJSONified);
        // }
        // return elementDataUid;
        // dataTarget = localStorage.getItem('obj');
        // jsonBool = true;
        let dataTargetValidated = jsonBool === true
            ? JSON.parse(localStorage.getItem(dataTarget))
            // ? JSON.parse(dataTarget) 
            // : objdataTarget;
            : objDeepCopy(objdataTarget);
            
        // let newUid = dataTargetValidated.metadata + 1;
        // let newUid = this.setNewUidPosition(dataTargetValidated, this.getUidPosition(dataTargetValidated) + 1);
        let newUid = this.incrementUidPosition(dataTargetValidated);
        elementData.params.uid = newUid;
        // dataTargetValidated.metadata += 1;
        this.addElement(this.findUid(dataTargetValidated, nodeTarget), elementData);
        // this.findUid(dataTargetValidated, nodeTarget).elements.push(elementData);
        
        localStorage.setItem('obj', JSON.stringify(dataTargetValidated));
        return newUid;
        
    },
    htmlFromData (elementData, logBool, nodeTarget) {
        // make deep copy of elementData for further processing
        var deepElementData = JSON.parse(JSON.stringify(elementData));
        // console.log(deepElementData);
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
        
        // create new element and asign values
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
                // var newElementUid = this.logToDataV2(deepElementData, nodeTarget, d, true);
                // let newElementUid = 
                //     this.logToDataV2(deepElementData, nodeTarget, 
                //                 localStorage.getItem(this.localStorageTarget), true);
                let newElementUid = 
                    this.logToDataV2(deepElementData, nodeTarget, 
                                this.localStorageTarget, true);
                // var newElementUid = this.incrementUidPosition(objecto);
                newElement.setAttribute("uid", newElementUid);
            }
        }
        
        if (nodeTarget) {
            document.querySelector('[uid="' + nodeTarget + '"]').appendChild(newElement);
        } else {
            document.getElementsByClassName('contentArea')[0].appendChild(newElement);
        }
        
        if (childElements != null) {
            // console.log(`childElements: ${childElements}`);
            // console.log(`${deepElementData} has childElements: ${childElements} `);
            for (var i = 0; i < childElements.length; i++) {
                if (deepElementData.params != null && deepElementData.params.uid != null){
                    this.htmlFromData(childElements[i], true, deepElementData.params.uid)
                } else {
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
    getUidPosition (source) {
        return source.metadata.uidPosition;
    },
    setNewUidPosition (source, newUidPosition) {
        source.metadata.uidPosition = newUidPosition;
        return newUidPosition;
    },
    incrementUidPosition (source) {
        return this.setNewUidPosition(source, this.getUidPosition(source) + 1);
    },
    buildHtml (source) {
        for (var i = 0; i < source.elements.length; i++) {
            if (source.elements[i].hasOwnProperty('element')) {
                this.htmlFromData(source.elements[i], false)
            }
        }

    },
    pseudoElements: {
        create () {
            let nodeList = document.querySelectorAll('[uid]');
            nodeList.forEach(function(e) {
                // if (e.parentNode.childNodes.length < 1) {
                //     console.log("has only one child");
                // }
                console.log(e.tagName);
                if (e.tagName != 'INPUT' ) {
                    let pseudoElement = document.createElement('DIV');
                    pseudoElement.setAttribute('class', 'pseudoEle');
                    let referenceNode = 
                        document.querySelector('[uid="' + e.getAttribute('uid') + '"]');
                    insertAfter(pseudoElement, referenceNode);
                }
                
            })
        },
        destroy () {
            if (document.getElementsByClassName('psuedoEle') 
                && document.getElementsByClassName('pseudoEle')[0] 
                && document.getElementsByClassName('pseudoEle')[0].parentNode) 
            {
                document.getElementsByClassName('pseudoEle')[0].parentNode
                .removeChild(document.getElementsByClassName('pseudoEle')[0]);
                this.destroy();
            }
        },
    },
}
let elementEngingeConfig = {
    
}

let makeDraggable = function() {
    var elements = document.querySelectorAll('[uid]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('draggable', 'true');
    }
}

let makeUnDraggable = function() {
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
    elementEngine.htmlFromData(elementBase.section, true, 0);
});
clearBttn.addEventListener('click', function() {
    clearData();
});
inputBttn.addEventListener('click', function(lastElementCreated) {
    elementEngine.htmlFromData(elementBase.input, true, 0);
});
buttonBttn.addEventListener('click', function() {
    elementEngine.htmlFromData(elementBase.button, true, 0);
});
resetBttn.addEventListener('click', function() {
    resetData();
});
logBttn.addEventListener('click', function() {
    console.log(JSON.parse(localStorage.getItem('obj')));
});
if (debugging) {
    let logClickedElement = function(){
        document.getElementsByClassName('contentArea')[0].addEventListener('click', function(e) {
            var nodeList = document.querySelectorAll(':hover');
            var lastNode = {
                element: nodeList[nodeList.length - 1],
                uid: function() {
                    return leftPad(this.element.getAttribute('uid'), 3, ` `);
                },
                tagName: function() {
                    return this.element.tagName
                }
            };
            lastCalledNode = lastNode.uid();
            console.table(`uid: ${lastNode.uid()} tagName: ${lastNode.tagName()}`);
        })
    }
    logClickedElement();
}
var lastCalledNode;
// })();