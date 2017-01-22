// jshint esversion: 6

// TODO: Sanetize output

// -----------------------------------------------------------------------------
// Helper functions
// -----------------------------------------------------------------------------

/**
 * Creates deep copy of an Object so the data of that object can be worked on 
 * without changing anything in the original Object
 * @param  {Object} source The object you want a deep copy from
 * @return {Object}        Deep copy of the object
 */
let objDeepCopy = function(source) { 
    return JSON.parse(JSON.stringify(source));
};

/**
 * Function to insert element after a Node instead of before it
 * @param  {Node} newNode       [description]
 * @param  {Node} referenceNode [description]
 */
let insertAfter = function(newNode, referenceNode){
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

/**
 * Left pads string
 * @param  {string | number} source    The string or number that is supposed to be left padded
 * @param  {number} padLength How big the padding is supposed to be
 * @param  {string} padType   What character is used for padding
 * @return {string}           Returns padded String
 * @example
 * // returns '  24'
 * leftPad(24, 4, ' ')
 */
let leftPad = function(source, padLength, padType) {
    if (source.length != padLength) {
        let padding = ``;
        for(let i = source.length; i < padLength; i++) {
            padding += padType;
        }
        let paddedString = padding + source;
        return paddedString;
    }
};
// app config
let debugging = true;
let editing = true;

var lastElementCreated;
// -----------------------------------------------------------------------------
// Objects / data
// -----------------------------------------------------------------------------
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
// var objecto = {
//     metadata: {uidPosition: 0},
//     elements: [
//         {element: 'section', params: {uid: 0, class:'sectionClass'}},
//     ]
// };
var objecto = {
    metadata: {uidPosition: 3},
    elements: [
        {
            element: 'section',
            params: {
                class: 'sectionContainer',
                uid: 1,
            },
            elements: [
                {
                    element: 'div',
                    content: 'SECTION',
                    params: {
                        class: 'sectionTitle',
                        ui: 2,
                    },
                },
                {
                    element: 'div',
                    params: {
                        class: 'sectionBody',
                        ui: 3,
                    },
                },
            ],
        }
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
    
    
    
    
    
    textSmall: {
        element: 'INPUT',
        params: {
            type: 'text',
            class: 'textSmall',
        },
    },
    textBig: {
        element: 'textarea',
        params: {
            class: 'textBig',
        }
    },
    section2: {
        element: 'section',
        params: {
            class: 'sectionContainer',
        },
        elements: [
            {
                element: 'div',
                content: 'SECTION',
                params: {
                    class: 'sectionTitle',
                },
            },
            {
                element: 'div',
                params: {
                    class: 'sectionBody'
                },
            },
        ],
    },
    subSection: {
        element: 'section',
        params: {
            class: 'subSection'
        },
    },
    spacer: {
        element: 'div',
        params: {
            class: 'contentSpacer',
        }
    },
    
    
    input: {
        element: 'div',
        params: {
            class: 'inputContainer'
        },
        elements: [
            {
                element: 'DIV',
                content: 'INPUT',
                params: {
                    class: 'labelClass'
                },
            },
            {
                element: 'input',
                params: {
                    class: 'inputClass',
                    type: 'text'
                },
                metadata: {
                    relation: 'label'
                },
                events: {
                    play: {
                        blur: 'elementEngine.updateData()'
                    },
                    edit: {},
                }
            },
        ],
    },
};

// ------------------------------------------------------------------
// ElementEngine
// ------------------------------------------------------------------

/**
 * @type {Object} elementEngine
 */
var elementEngine = {
    localStorageObjectName: 'obj',
    localStorageTarget: 'obj',
    getLocalStorage () {
        return JSON.parse(localStorage.getItem(this.localStorageTarget));
    },
    setLocalStorage (content) {
        localStorage.setItem(this.localStorageTarget, JSON.stringify(content));
    },
    /**
     * This function finds and returns a key refference in an object based on 
     * the given uid key value
     * @memberof elementEngine
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
                    var result = this.findUid(newTarget, uid);
                    if (result != null) {
                        return result;
                    }
                }
            }
        }
    },
    
    /**
     * [addElement description]
     * @memberof elementEngine
     * @param {[type]} target  [description]
     * @param {[type]} element [description]
     */
    addElement (target, element, insertPosition) {
        if (typeof target !== 'undefined') {
            if (insertPosition) {
                // console.log('insertPosition -------------');
                // console.log(insertPosition);
                // console.log('target -------------');
                // console.log(target);
                // console.log('target -------------');
                target.elements.splice(insertPosition, 0, element);
            } else if (typeof target.elements !== 'undefined') {
                target.elements.push(element);
            } else {
                target.elements = [element];
            }
        }
    },
    /**
     * Logs data
     * 
     * @param  {Object} elementData The Object that is getting logged to the data target.
     * @param  {number} nodeTarget  Which node in the dataTarget the elementData is getting appended to.
     * @param  {Object|string} dataTarget  Where the new data is getting put.
     * @param  {boolean} jsonBool    If the dataTarget is Json and needs to be parsed.
     * @return {number}             Returns the new uid that got assigned to the elementData
     */
    logToDataV2: function(elementData, nodeTarget, dataTarget, jsonBool, insertPosition) {
        let dataTargetValidated = jsonBool === true ?
            JSON.parse(localStorage.getItem(dataTarget))
            : objDeepCopy(objdataTarget);    
        let newUid = this.incrementUidPosition(dataTargetValidated);
        elementData.params.uid = newUid;
        this.addElement(this.findUid(dataTargetValidated, nodeTarget), elementData, insertPosition);
        // TODO: make this part modular
        localStorage.setItem('obj', JSON.stringify(dataTargetValidated));
        return newUid;
    },
    updateData(uidTarget, value, key) {
        // type == params || content
        let object = this.getLocalStorage();
        let element = this.findUid(object, uidTarget);
    
        if (key) {
        element.params[key] = value;
        } else {
        element.content = value;
        }
        
        this.setLocalStorage(object);
    },
    // parameter(target, key, value){
    //     let element = this.findUid(this.getLocalStorage(), target);
    //     element[key] = value;
    // },
    // content(target, value){
    //     let element = this.findUid(this.getLocalStorage(), target);
    // },
    
    /**
     * Turns a given object that contains data describing a html element into a
     * HTML element, inserts it into the Webpage at a specified position and 
     * logs it to a data target
     * @memberof elementEngine
     * @param  {Object} elementData Takes the Object that is getting turned into a html element
     * @param  {boolean} logBool     If the object gets logged to data
     * @param  {number} nodeTarget  Where the new HTML element gets inserted/appended
     */
    htmlFromData (elementData, logBool, nodeTarget, insertPosition) {
        // TODO: check if further calls of htmlFromData need insertPosition as an argument
        // TODO: write logic to insert html elements at nodelist position using insertPosition parameter
        // make deep copy of elementData for further processing
        var deepElementData = JSON.parse(JSON.stringify(elementData));
        var newElement;
        var childElements;
        var newElementUid;
        // var childElements;
        if (isNaN(nodeTarget)){
            nodeTarget = document.getElementsByClassName(nodeTarget)[0];
            if (logBool !== false) {
                logBool = false;
            }
        }
        
        
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
                newElementUid = this.logToDataV2(deepElementData, nodeTarget, this.localStorageTarget, true, insertPosition);
                // var newElementUid = this.incrementUidPosition(objecto);
                newElement.setAttribute("uid", newElementUid);
            }
        }
        if (nodeTarget) {
            // TODO: doesn't work, something is wrong with the position where i insert
            if (isNaN(nodeTarget)) {
                if (insertPosition) {
                    
                } else {        
                    nodeTarget.appendChild(newElement);
                }
            } else {
                // if (insertPosition !== 0) {
                let nodeTargetElement = document.querySelector('[uid="' + nodeTarget + '"]');
                if (insertPosition) {
                    // insertAfter(newElement, document.querySelector('[uid="' + nodeTarget + '"]'));
                    console.log('insertPosition: ' + insertPosition)
                    if (insertPosition) {
                        // console.log('insertPosition is bigger than 0');
                        console.log(nodeTargetElement.childNodes[insertPosition]);
                        insertAfter(newElement, nodeTargetElement.childNodes[insertPosition]);
                    }
                } else {
                document.querySelector('[uid="' + nodeTarget + '"]').appendChild(newElement);
                }
            }
            
        } else {
            document.getElementsByClassName('contentArea')[0].appendChild(newElement);
        }
        if (childElements != null) {
            // if (logBool === true) {
            //     for (var i = 0; i < childElements.length; i++) {
            //         if (deepElementData.params != null && deepElementData.params.uid != null){
            //             console.log(`logBool = ${logBool}`);
            //             this.htmlFromData(childElements[i], true, deepElementData.params.uid)
            //         } else {
            //             console.log(`logBool = ${logBool}`);
            //             this.htmlFromData(childElements[i], true, newElementUid)
            //         }
            //     }
            // } else {
            //     for (var i = 0; i < childElements.length; i++) {
            //         if (deepElementData.params != null && deepElementData.params.uid != null){
            //             console.log(`logBool = ${logBool}`);
            //             this.htmlFromData(childElements[i], false, deepElementData.params.uid)
            //         } else {
            //             console.log(`logBool = ${logBool}`);
            //             this.htmlFromData(childElements[i], false, newElementUid)
            //         }
            //     }
            // }
            for (var i = 0; i < childElements.length; i++) {
                if (deepElementData.params != null && deepElementData.params.uid != null){
                    this.htmlFromData(
                        childElements[i], 
                        logBool,
                        deepElementData.params.uid
                    );
                } else {
                    this.htmlFromData(
                        childElements[i], 
                        logBool, 
                        newElementUid
                    );
                }
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
    changeParameter(target, key, value){
        let element = this.findUid(this.getLocalStorage(), target);
        element[key] = value;
    },
    // changeContent(target, value){
    //     let element = this.findUid(this.getLocalStorage(), target);
    // },
    buildHtml (source) {
        for (var i = 0; i < source.elements.length; i++) {
            if (source.elements[i].hasOwnProperty('element')) {
                this.htmlFromData(source.elements[i], false, 'contentArea');
            }
        }

    },
    buildEditingInterface (source) {
        let uidIdentifier = "edit";
        let uidCounter = 0;
        let elementsObj = objDeepCopy(elementBase);
        for (let key in elementsObj) {
            uidCounter += 1;
            // elementsObj[key].params.data = JSON.stringify(elementsObj[key]);
            // console.log(key);
            elementsObj[key].params.elementData = String(key);
            elementsObj[key].params.uid = uidIdentifier + uidCounter;
            elementsObj[key].params.draggable = 'true';
            elementsObj[key].params.ondragstart = `elementEngine.pseudoElements.create('${elementsObj[key].params.class}'), editingOnDrag(event, this)`;
            // elementsObj[key].params.ondragstart = "console.log(this)";
            elementsObj[key].params.ondragend = "elementEngine.pseudoElements.destroy()";
            // elementsObj[key].params.disabled = "";
            // TODO: for some reason the child element does not get put into it's parent
            // if (elementsObj[key].elements){
            //     for (let childKey in elementsObj[key].elements) {
            //         uidCounter += 1;
            //          elementsObj[key].elements[childKey].params.uid = uidIdentifier + uidCounter;
            //     }
            // }
            // console.log(elementsObj[key]);
            this.htmlFromData(elementsObj[key], false, 'elementsList');
        }        
    },
    pseudoElements: {
        create (cssClass) {
            let nodeList = document.getElementsByClassName('contentArea')[0].querySelectorAll('[uid]');
            let pseudoElementUid = 0;
            let createPElement = function(cssClass){
                let pseudoElement = document.createElement('DIV');
                pseudoElement.setAttribute('class', 'pseudoEle');
                
                pseudoElement.addEventListener('click', function(){pE(this);});
                pseudoElement.addEventListener('drop', function(){editingOnDrop(event, this);});
                pseudoElement.addEventListener('dragover', function(){allowDrop(event);});
                                
                // pseudoElement.setAttribute('onclick', 'pE(this)');
                // pseudoElement.setAttribute('ondrop', 'editingOnDrop(event, this)');
                // pseudoElement.setAttribute('ondragover', 'allowDrop(event)');
                if (cssClass) {
                    // console.log('cssClass:' + cssClass);
                    pseudoElement.className += ` ${cssClass}`;
                }
                return pseudoElement;
            };
            nodeList.forEach(function(e) {
                if ((e.tagName != 'INPUT') && (e.className != 'labelClass')) {
                    let referenceNode = 
                        document.querySelector('[uid="' + e.getAttribute('uid') + '"]');
                    if (Array.prototype.indexOf.call(e.parentNode.childNodes, e) === 0) {
                        firstPseudoElement = createPElement(cssClass);
                        e.parentNode.insertBefore(firstPseudoElement, referenceNode)
                    }
                    pseudoElement = createPElement(cssClass);
                    // let referenceNode = 
                    //     document.querySelector('[uid="' + e.getAttribute('uid') + '"]');
                    insertAfter(pseudoElement, referenceNode);
                }
            });
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
};
let elementEngingeConfig = {
    
};

let makeDraggable = function() {
    var elements = document.querySelectorAll('[uid]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('draggable', 'true');
    }
};

let makeUnDraggable = function() {
    var elements = document.querySelectorAll('[uid]');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('draggable', 'false');
    }
};

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
    elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
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
    let logClickedElement = function() {
        document.getElementsByClassName('contentArea')[0].addEventListener('click', function(e) {
            var nodeList = document.querySelectorAll(':hover');
            var lastNode = {
                element: nodeList[nodeList.length - 1],
                uid: function() {
                    return leftPad(this.element.getAttribute('uid'), 3, ` `);
                },
                tagName: function() {
                    return this.element.tagName;
                }
            };
            lastCalledNode = lastNode.uid();
            console.table(`uid: ${lastNode.uid()} tagName: ${lastNode.tagName()}`);
        });
    };
    logClickedElement();
}

let getPositionInNodeList = function(source) {
    
}
var lastCalledNode;

let rollDice = function(sides) {
    return Math.floor(Math.random() * sides + 1);
};

let rollTest = function(sides, times){
    let diceRolls = {};
    for (var i = 0; i < times; i++) {
        
        let rolled = rollDice(sides);
        if (!diceRolls[rolled]) {
            diceRolls[rolled] = 1;
        } else {
            diceRolls[rolled] += 1;
        }
    }
    console.log(diceRolls);
};


let searchChat = function(target){
    // TODO: does not work if variable is at end of string
    let nodeList = document.querySelectorAll('[class="labelClass"]');
    let stringArray = target;
    let tempString = '';
    let varH = '';
    for (i = 0; i < stringArray.length; i++) {
            if (stringArray[i].match(/[a-zA-Z]/g)) {
                varH += stringArray[i];
                if (i == stringArray.length - 1 && varH) {
                    tempString += eval(varH);
            }
        } else {
            if (varH) {
                console.log(varH);
                nodeList.forEach(function(e){
                    if(e.firstChild.nodeValue == varH) {
                        if (e.childNodes[1].value && !isNaN(e.childNodes[1].value)) {
                            console.log('value:' + e.childNodes[1].value);
                            tempString += e.childNodes[1].value;
                        }
                    }
                });
            }
            tempString += stringArray[i];
            varH = '';
        }
    }
    console.log(tempString);
    console.log(math.eval(tempString));
};

// elementEngine.buildEditingInterface(elementBase);
// console.log(elementBase.lengt);

let pseudoEve = function(){
    let nodeList = document.getElementsByClassName('pseudoEle');
    for (let i = 0; i < nodeList.length; i++) {
        document.getElementsByClassName('pseudoEle')[i].addEventListener('click', function(e){
            e.style.backgroundColor = 'red';
        });
    }
};

let pE = function(x){
    // console.log(x);
    var info = {};
    info.parentNode = x.parentNode.getAttribute('uid');
    info.index = Array.prototype.indexOf.call(x.parentNode.childNodes, x);
    info.insertAfter = x.parentNode.childNodes[info.index - 1].getAttribute('uid');
    // console.log(x.parentNode.childNodes[info.index - 1]);
    console.log(info);
    return info;
};

let dropEvent = function(e){
    e.preventDefault();
    
    console.log(e);
};

let dragEvent = function(e){
    e.preventDefault();
    let data = e.dataTransfer.setData("test");
    console.log(data);
};

let allowDrop = function(e) {
    e.preventDefault();
};


let insertAfterUid = function(info) {
    let target;
    
};

let editingOnDrag = function(e, element){
    // e.preventDefault();
    // console.log(element.getAttribute('elementData'));
    e.dataTransfer.setData('elementData', element.getAttribute('elementdata'));
    // console.log(e));
    // e.dataTransfer.setData('element', e.getAttribute('data'));
    // console.log(e.getAttribute('data'));
};

let editingOnDrop = function(e, dropInfo) {
    let elementData = e.dataTransfer.getData('elementData');
    if (typeof elementData != 'object') {
        elementData = elementBase[elementData];
    }
    // console.log(elementData);
    
    var info = {};
    // console.log('this.parentNode ----------------');
    // console.log(dropInfo.parentNode.getAttribute('uid'));
    info.parentNode = dropInfo.parentNode.getAttribute('uid');
    info.index = Array.prototype.indexOf.call(dropInfo.parentNode.childNodes, dropInfo);
    // console.log('insertAfter ----------------')
    // console.log((Number(info.index) / 2 ) - 1);
    if (((Number(info.index)) / 2 ) > 0) {
        // info.insertAfterUid = dropInfo.parentNode.childNodes[info.index - 1].getAttribute('uid');
        info.insertAtPosition = (Number(info.index)) / 2 ;
    } else {
        info.insertAtFirstPosition = true;
    }
    // info.insertAfterUid = dropInfo.parentNode.childNodes[info.index - 1].getAttribute('uid');
    
    // console.log(info);
    elementEngine.htmlFromData(elementData, true, Number(info.parentNode), Number(info.insertAtPosition));
};

let turnLabelIntoInput = function(e) {
        let parent = e.parentNode;
        let value = e.innerHTML;
        let uid = e.getAttribute('uid');
        let tempEle = document.createElement('input');
        
        tempEle.value = value;
        tempEle.setAttribute('uid', uid);
        tempEle.className = 'inputClass inputEdit';
        // tempEle.addEventListener('blur', function(event){
        //     elementEngine.updateData(Number(this.getAttribute('uid')), this.value);
        //     event.preventDefault();
        //     event.stopImmediatePropagation();
        //     turnInputIntoLabel(this);
        // });
        tempEle.addEventListener('keypress', function(event){
            var key = event.which || event.keyCode;
            if (key === 13) {
                elementEngine.updateData(Number(this.getAttribute('uid')), this.value);
                // event.preventDefault();
                // event.stopImmediatePropagation();
                turnInputIntoLabel(this);
            }
        });
        
        
        parent.removeChild(parent.firstChild);
        parent.insertBefore(tempEle, parent.firstChild);
        tempEle.focus();
};
let turnInputIntoLabel = function(e) {
    let parent = e.parentNode;
    let value = e.value;
    let uid = e.getAttribute('uid');
    let tempEle = document.createElement('div');
    
    tempEle.innerHTML = value;
    tempEle.setAttribute('uid', uid);
    tempEle.className = 'labelClass';
    tempEle.addEventListener('click', function(){
        turnLabelIntoInput(this);
    });
    
    parent.removeChild(parent.firstChild);
    parent.insertBefore(tempEle, parent.firstChild);    
};
// let turnLabelIntoInput = function() {
//     let nodeList = document.getElementsByClassName('labelClass');
//     // console.log(nodeList);
//     // return;
//     for (let i = 0; i < nodeList.length; i++) {
//         // console.log(nodeList[i]);
//         let tempEle = document.createElement('input');
//         tempEle.className = 'inputClass inputEdit';
//         let value = nodeList[i].firstChild.nodeValue;
//         tempEle.value = value;
//         nodeList[i].removeChild(nodeList[i].firstChild);
//         nodeList[i].insertBefore(tempEle, nodeList[i].firstChild);
//         
//     }
// };

let makeInputEditable = function() {
    // let nodeList = document.getElementsByClassName('labelClass');
    
    let nodeList = document.querySelectorAll('.labelClass,.sectionTitle');
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].addEventListener('click', function(){
            turnLabelIntoInput(this);
        });
    }
};
makeInputEditable();