// jshint browser : true
// jshint esversion: 6
'use strict';
// TODO: Sanetize output
// TODO: change on enter and stuff like that to change

// -----------------------------------------------------------------------------
// App Config
// -----------------------------------------------------------------------------

let debugging = false;
let editing = false;
let editingInterface = false;

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
let insertAfter = function(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

/**
 * Left pads string
 * @param  {string | number} source
 * The string or number that is supposed to be left padded
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
        for (let i = source.length; i < padLength; i++) {
            padding += padType;
        }
        let paddedString = padding + source;
        return paddedString;
    }
};


let lastElementCreated;

let objecto = {
    metadata: {
        uidPosition: 0,
    },
    elements: [
    ],
};
let dragInfoThing;
const emptyData = {
    metadata: {
        uidPosition: 0,
    },
    elements: [{
        element: 'section',
        params: {
            uid: 0,
            class: 'sectionClass',
        },
    }],
};

const elementBase = {
    button: {
        element: 'button',
        content: 'click Me',
        params: {
            // uid: -1,
            class: 'bttnClass',
        },
        functions: {
            edit: {
                general: {
                    makeDraggable: true,
                },
                evListener: {
                    // mouseover: {
                    //     functions: {
                    //         createDeleteButton: true,

                    //     },
                    // },
                },
            },
        },
    },


    textSmall: {
        element: 'INPUT',
        params: {
            // uid: -2,
            type: 'text',
            class: 'textSmall',
        },
        events: {
            edit: {
                mouseover: {
                    functions: {
                        createDeleteButton: true,

                    },
                },
            },
        },
    },
    textBig: {
        element: 'div',
        params: {
            // uid: -3,
            class: 'textBigContainer',
        },
        events: {
            edit: {
                mouseover: {
                    functions: {
                        createDeleteButton: true,

                    },
                },
            },
        },
        elements: [{
                element: 'div',
                params: {
                    // uid: -4,
                    class: 'textBigTitle',
                },
                content: 'Title',
            },
            {
                element: 'textarea',
                params: {
                    // uid: -5,
                    class: 'textBigContent',
                },
            },
        ],
    },
    section: {
        element: 'section',
        params: {
            class: 'sectionContainer',
        },
        functions: {
            edit: {
                evListener: {
                    // mouseover: {
                    //     functions: {
                    //         createDeleteButton: true,
                    //     },
                    // },
                },
            },
        },
        elements: [{
                element: 'div',
                content: 'SECTION',
                params: {
                    // uid: -7,
                    class: 'sectionTitle',
                },
                functions: {
                    edit: {
                        evListener: {
                            click: {
                                functions: {
                                    turnElementIntoInput: true,
                                },
                            },
                        },
                    },
                },
            },
            {
            element: 'div',
            params: {
                    // uid: -8,
                class: 'sectionBody',
            },
            functions: {
                edit: {
                    evListener: {
                        dragenter: {
                            functions: {
                                baseElementsDragEnterBehaviour: true,
                            },
                        },
                        // dragleave: {
                        //     functions: {
                        //         sectionDragLeaveCheck: true,
                        //     },
                        // },
                    },
                },
                // mouseover: {
                //     functions: {
                //         createDeleteButton: true,
                //     },
                // },
            },
        },
            // },
        ],
    },
    subSection: {
        element: 'section',
        params: {
            class: 'subSection',
        },
        functions: {
            edit: {
                evListener: {
                    mouseover: {
                        // functions: {
                        //     createDeleteButton: true,
                        //     // removeEventListener: true,
                        // },
                    },
                    dragenter: {
                        functions: {
                            baseElementsDragEnterBehaviour: true,
                        },
                    },
                    // dragleave: {
                    //     functions: {
                    //         pseudoElementsDestroy: true,
                    //     },
                    // },
                },
            },
        },
    },
    spacer: {
        element: 'div',
        params: {
            class: 'contentSpacer',
        },
        events: {
            edit: {
                // mouseover: {
                //     functions: {
                //         createDeleteButton: true,

                //     },
                // },
            },
        },
    },


    input: {
        element: 'div',
        params: {
            class: 'inputContainer',
        },
        events: {
            edit: {
                // mouseover: {
                //     functions: {
                //         createDeleteButton: true,

                //     },
                // },
            },
        },
        elements: [{
                element: 'DIV',
                content: 'INPUT',
                params: {
                    class: 'labelClass',
                },
                functions: {
                    edit: {
                        evListener: {
                            click: {
                                functions: {
                                    turnElementIntoInput: true,
                                },
                            },
                        },
                    },
                },
            },
            {
                element: 'input',
                params: {
                    class: 'inputClass',
                    type: 'text',
                    value: '',
                },
                metadata: {
                    relation: 'label',
                },
                functions: {
                    play: {
                        evListener: {
                            keypressEnter: {
                                functions: {
                                    blurThis: true,
                                },
                            },
                            blur: {
                                functions: {
                                    saveInputToData: true,
                                },
                            },
                        },
                    },
                },
            },
        ],
    },
};
const newTemplateBase = '{"metadata":{"uidPosition":3},"elements":[{"element":"section","params":{"class":"sectionContainer","uid":1},"functions":{"edit":{"evListener":{}}},"elements":[{"element":"div","content":"SECTION","params":{"class":"sectionTitle","uid":2},"functions":{"edit":{"evListener":{"click":{"functions":{"turnElementIntoInput":true}}}}}},{"element":"div","params":{"class":"sectionBody","uid":3},"functions":{"edit":{"evListener":{"dragenter":{"functions":{"baseElementsDragEnterBehaviour":true}}}}}}]}]}';

let baseElementsDragEnterBehaviour = function(e, dropInfo){
    e.preventDefault();
    e.stopPropagation();

    e.cancelBubble = true;
    let targetNode = this;
    console.log(this);
    console.log(dropInfo);
        let nodeList = Array.from(targetNode.childNodes);
        let deleteButtonFilter = function(element){
            return element.className != 'deleteButton';
        }
        nodeList = nodeList.filter(deleteButtonFilter);
        if (targetNode.getElementsByClassName('pseudoEle')[0]) {

        } else if (targetNode.childNodes.length > 0){
            let cssClass = 'something';
            for (let i = 0; i < nodeList.length; i++) {
                let pe = createPElement(cssClass);
                targetNode.insertBefore(pe, nodeList[i])
            }
            insertAfter(createPElement(cssClass), nodeList[nodeList.length - 1])
        } else {
            let cssClass = 'something';
            let pe = createPElement(cssClass);
            targetNode.appendChild(pe);
        }
}

// ------------------------------------------------------------------
// ElementEngine
// ------------------------------------------------------------------

/**
 * @type {Object} elementEngine
 */
let elementEngine = {
    localStorageObjectName: 'obj',
    localStorageTarget: 'obj',
    server: 'http://saeap.dev:80',

    getLocalStorage() {
        return JSON.parse(localStorage.getItem(this.localStorageTarget));
    },

    setLocalStorage(content) {
        localStorage.setItem(this.localStorageTarget, JSON.stringify(content));
    },

    /**
     * This function finds and returns a key refference in an object based on
     * the given uid key value
     * @memberof elementEngine
     * @param {Object} source Object to serach in
     * @param {number} uid number that is being searched for
     * @return {Object} a refference of the position in
     * the searched object where the uid was found
     */

    findUid(source, uid) {
        if (source.params != null
            && source.params.uid != null
            && source.params.uid === uid) {
            return source;
        } else {
            if (Array.isArray(source.elements)) {
                for (let i = 0; i < source.elements.length; i++) {
                    let newTarget = source.elements[i];
                    let result = this.findUid(newTarget, uid);
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
     * @param {[number]} insertPosition [description]
     */

    addElement(target, element, insertPosition) {
        if (typeof target !== 'undefined') {
            if (typeof insertPosition == 'number') {
                // console.log('insertPosition -------------');
                // console.log(insertPosition);
                // console.log('target -------------');
                // console.log(target);
                // console.log('target -------------');
                console.log('addElement' + insertPosition);
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
     * @param  {Object} elementData
     * The Object that is getting logged to the data target.
     * @param  {number} nodeTarget
     * Which node in the dataTarget the elementData is getting appended to.
     * @param  {Object|string} dataTarget
     * Where the new data is getting put.
     * @param  {boolean} jsonBool
     * If the dataTarget is Json and needs to be parsed.
     * @param  {number} insertPosition
     * If the dataTarget is Json and needs to be parsed.
     * @return {number}
     * Returns the new uid that got assigned to the elementData
     */

    logToDataV2: function(
        elementData, nodeTarget, dataTarget, jsonBool, insertPosition) {
        let dataTargetValidated = jsonBool === true ?
            JSON.parse(localStorage.getItem(dataTarget)) :
            objDeepCopy(objdataTarget);
        let newUid = this.incrementUidPosition(dataTargetValidated);
        elementData.params.uid = newUid;
        if (isNaN(nodeTarget)) {
            this.addElement(dataTargetValidated, elementData, insertPosition);
        } else {
            this.addElement(
                this.findUid(dataTargetValidated, nodeTarget),
                     elementData, insertPosition
                );
        }
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

    // removeFromData(uid) {
    //     let data = this.getLocalStorage();
    //     delete this.findUid(data, uid);
    //     // delete target;
    //     console.log(data);
    // },

    removeFromData(uid) {
        let data = this.getLocalStorage();
        let result;
        let filterUid = function(uid) {
            return function(element) {
                if (element.elements) {
                    element.elements = element.elements.filter(
                        filterUid(uid)
                    );
                }
                if (Number(element.params.uid) != uid) {
                    return element;
                }
            };
        };
        if (data.elements) {
            result = data;
            result.elements = data.elements.filter(filterUid(uid));
        } else {
            result = data.filter(filterUid(uid));
        }
        this.setLocalStorage(result);
    },

    // removeId(object, uid) {
    //     return Object.keys(object).map(function (key) {
    //         if (Array.isArray(object[key])) {
    //             let returnValue = {};
    //             returnValue[key] =  object[key]
    //             .filter(function (item) {
    //                 return 'uid' in item && item.uid !== uid;
    //             })
    //             .map(item => removeId(item, uid));
    //         } else {
    //             let returnValue = {};
    //             returnValue[key] = object[key];
    //         }
    //         return returnValue;
    //         })
    //         .reduce(function (finalObject, currentObject) {
    //             return Object.assign(finalObject, currentObject);
    //         }, {});
    // },

    /**
     * Turns a given object that contains data describing a html element into a
     * HTML element, inserts it into the Webpage at a specified position and
     * logs it to a data target
     * @memberof elementEngine
     * @param  {Object} elementData
     * Takes the Object that is getting turned into a html element
     * @param  {boolean} logBool
     * If the object gets logged to data
     * @param  {number} nodeTarget
     * Where the new HTML element gets inserted/appended
     */

    htmlFromData(elementData, logBool, nodeTarget, insertPosition, customUid) {
        // TODO: check if further calls of htmlFromData
        //  need insertPosition as an argument
        // TODO: write logic to insert html elements at nodelist position
        //  using insertPosition parameter
        // make deep copy of elementData for further processing
        let deepElementData = JSON.parse(JSON.stringify(elementData));
        if (logBool) {
            // console.log(deepElementData);
        }
        let newElement;
        let childElements;
        let newElementUid;
        // let childElements;
        if (isNaN(nodeTarget)) {
            nodeTarget = document.getElementsByClassName(nodeTarget)[0];
            // if (logBool !== false) {
            //     logBool = false;
            // }
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
            for (let key in deepElementData.params) {
                newElement.setAttribute(key, deepElementData.params[key]);
            }
        }
        if (deepElementData.functions) {
            let eventFunctionsCheck = {
                // createDeleteButton: elementEngine.createDeleteButton,
                turnElementIntoInput: turnElementIntoInput,
                saveInputToData: saveInputToData,
                blurThis: blurThis,
                baseElementsDragEnterBehaviour: baseElementsDragEnterBehaviour,
                pseudoElementsDestroy: elementEngine.pseudoElements.destroy,
                sectionDragLeaveCheck: sectionDragLeaveCheck,
            };
            let generalFunctionsCheck = {
                makeDraggable: makeDraggable,
            }
            let keyPressTypes = {
                keypressEnter: function(func){
                    let key = event.which || event.keyCode;
                    if (key === 13) {
                        func;
                    }
                },
            };

            let addEvListener = function(object) {
                for (let evListener in object) {
                    for (let func in object[evListener].functions) {
                        // if (keyPressTypes.hasOwnProperty(evListener) && eventFunctionsCheck.hasOwnProperty(func)) {
                        //     newElement.addEventListener('keypress', keyPressTypes[evListener](func));
                        // }
                        if (eventFunctionsCheck.hasOwnProperty(func)) {
                            // newElement.addEventListener(evListener, function(){
                            //     eventFunctionsCheck[func](this);
                            //     // console.log(true);
                            // });
                            newElement.addEventListener(String(evListener), eventFunctionsCheck[func], false);
                        }
                    }
                }
            };

            if (deepElementData.functions.general) {
                
            }
            if (deepElementData.functions.play) {
                if (deepElementData.functions.play.general) {
                    // makeDraggable
                }
                if (deepElementData.functions.play.evListener) {
                    addEvListener(deepElementData.functions.play.evListener);
                }
            }
            // let editing = true;
            if (editing) {
                if (deepElementData.functions.edit) {
                    if (deepElementData.functions.edit.general) {
                        // for (let generalFunction in deepEleementsData.functions.edit.gerneral) {
                        //     if (general)
                        // }
                    }
                    if (deepElementData.functions.edit.evListener) {
                        addEvListener(deepElementData.functions.edit.evListener);
                    }
                }
            }
        }

        if (logBool === true) {
            if (!deepElementData.params.uid &&
                    isNaN(deepElementData.params.uid)) {
                newElementUid = this.logToDataV2(deepElementData, nodeTarget,
                    this.localStorageTarget, true, insertPosition
                );
                newElement.setAttribute('uid', newElementUid);
                if (deepElementData.params.uid) {
                    console.log('uid: ' + deepElementData.params.uid);
                }
            }
        }

        // if (customUidCounter) {
        //     customUid.uidPosition += 1;
        //     newElement.setAttribute("uid", customUid.uidPosition);
        //     
        //     if (childElements != null) {
        //         for (let i = 0; i < childElements.length; i++) {
        //             if (deepElementData.params != null && deepElementData.params.uid != null){
        //                 this.htmlFromData(
        //                     childElements[i], 
        //                     logBool,
        //                     deepElementData.params.uid
        //                 );
        //             } else {
        //                 this.htmlFromData(
        //                     childElements[i], 
        //                     logBool, 
        //                     newElementUid
        //                 );
        //             }
        //         }
        //     }
        // }

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
                if (typeof insertPosition == 'number') {
                    // insertAfter(newElement, document.querySelector('[uid="' + nodeTarget + '"]'));
                    // console.log('insertPosition: ' + insertPosition)
                    // if (insertPosition) {
                        // console.log('insertPosition is bigger than 0');
                        // console.log("insertAfter:" + insertPosition);
                        // console.log(nodeTargetElement.childNodes[insertPosition]);
                        // console.log(nodeTargetElement.childNodes);
                        console.log(insertPosition);
                        console.log('wtf');
                        if (insertPosition <= 0) {
                            if (nodeTargetElement.childNodes) {
                                nodeTargetElement.insertBefore(newElement, nodeTargetElement.childNodes[0]);
                            } else {
                                nodeTargetElement.parentNode.appendChild(newElement);
                            }
                            console.log('boom');
                            // nodeTargetElement.insertBefore(newElement, nodeTargetElement.childNodes[0]);
                        } else {
                            console.log('leeeel');
                            insertAfter(newElement, nodeTargetElement.childNodes[insertPosition * 2]);
                        } 
                        
                    // }
                } else {
                    document.querySelector('[uid="' + nodeTarget + '"]').appendChild(newElement);
                }
            }

        } else {
            document.getElementsByClassName('contentArea')[0].appendChild(newElement);
        }
        if (childElements != null) {
            for (let i = 0; i < childElements.length; i++) {
                if (deepElementData.params != null && deepElementData.params.uid != null) {
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
    getUidPosition(source) {
        return source.metadata.uidPosition;
    },
    setNewUidPosition(source, newUidPosition) {
        source.metadata.uidPosition = newUidPosition;
        return newUidPosition;
    },
    incrementUidPosition(source) {
        return this.setNewUidPosition(source, this.getUidPosition(source) + 1);
    },
    changeParameter(target, key, value) {
        let element = this.findUid(this.getLocalStorage(), target);
        element[key] = value;
    },
    // sendDataToServer(){
    //     var ajax = new XMLHttpRequest();
    //     ajax.open("POST", 'localhost', true);
    //     
    //     ajax.setRequestHeader('Content-type', "application/x-www-from-urlencoded");
    //     
    //     ajax.onreadystatechange = function(){};
    //     
    // },
    sendDataPromise(requestType, data){
        // let promise = new Promise((resolve, reject) => {
        //     resolve('Good To Go');
        // });
        requestType = requestType.toUpperCase();

        // let doXhrRequest = new Promise((resolve, reject) => {
        //     let xhr = new XMLHttpRequest();
        //     xhr.open(requestType, this.server, true);
        //     if (requestType == 'POST') {
        //         xhr.setRequestHeader(
        //             'Content-type',
        //             'application/x-www-form-urlencoded'
        //         );
        //     }
        //     xhr.onreadystatechange = function() {
        //         if (xhr.readyState === XMLHttpRequest.DONE
        //                 && xhr.status == 200) {
        //             resolve(true);
        //         } else {
        //             reject('error');
        //         }
        //     };
        //     xhr.send(data);
        // });
        // doXhrRequest.then((res) => {
        //     
        // });

        let xhr = new XMLHttpRequest();
        xhr.open(requestType, this.server, true);
        if (requestType == 'POST') {
            xhr.setRequestHeader(
                'Content-type',
                'application/x-www-form-urlencoded'
            );
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
            } else {
            }
        };
        xhr.send(data);
    },
    buildHtml(source, target = 'contentArea') {
        for (let i = 0; i < source.elements.length; i++) {
            if (source.elements[i].hasOwnProperty('element')) {
                this.htmlFromData(source.elements[i], false, target);
            }
        }

    },
    buildEditingInterface(source) {
        // let uidIdentifier = "edit";
        editing = true;
        let uidCounter = 0;
        let elementsObj = objDeepCopy(elementBase);
        for (let key in elementsObj) {
            uidCounter -= 1;
            elementsObj[key].params.elementData = String(key);
            elementsObj[key].params.uid = uidCounter;
            elementsObj[key].params.draggable = 'true';
            elementsObj[key].params.ondragstart = `elementEngine.pseudoElements.create('${elementsObj[key].params.class}'), editingOnDrag(event, this)`;
            elementsObj[key].params.ondragend = "elementEngine.pseudoElements.destroy()";
            // if (elementsObj[key].elements){
            //     for (let childKey in elementsObj[key].elements) {
            //         uidCounter += 1;
            //          elementsObj[key].elements[childKey].params.uid = uidIdentifier + uidCounter;
            //     }
            // }
            // console.log(elementsObj[key]);
            // this.htmlFromData(elementsObj[key], false, 'elementsList');
            this.htmlFromData(elementsObj[key], false, 'elementsList');
        }
        let templatesTitles = {
            bttnClass: "Button",
            textBigContainer: "Big Text Field",
            sectionContainer: "Section",
            subSection: "subSection",
            input: "Input Field"
        }
        let editingTemplates = Array.from(document.getElementsByClassName('elementsList')[0].childNodes);
        editingTemplates.forEach(function(e){
            let className = e.className;
            let titleElement = document.createElement('div');
            titleElement.classNam = 'editingElementTitle';
            if (templatesTitles.hasOwnProperty(className)) {
                titleElement.innerHTML = templatesTitles[className];
            }
            e.parentNode.insertBefore(titleElement, e);
            // console.log(className);

        });


    },
    deleteButtonBack() {
        let nodeList = document.getElementsByClassName('contentArea')[0].querySelectorAll('[uid]');
        let checkList = [];
        for (let key in elementBase) {
            checkList.push(elementBase[key].params.class);
        }
        console.log(checkList);
        nodeList.forEach(function(e) {
            if (checkList.indexOf(e.className) > -1) {
                let newElement = document.createElement('div');
                newElement.className = 'deleteButton';
                newElement.innerHTML = '&#10799';
                newElement.addEventListener('click', function(e) {
                    let parent = this.parentNode;
                    let parentUid = parent.getAttribute('uid');
                    if (confirm('This will delete this element and all the elements inside of it, are you sure you want to proceed')) {
                        while (parent.firstChild) {
                            parent.removeChild(parent.firstChild);
                        }
                        parent.parentNode.removeChild(parent);
                        elementEngine.removeFromData(Number(parentUid));
                    }

                });
                if (e.firstChild) {
                    e.insertBefore(newElement, e.firstChild);
                } else {
                    e.appendChild(newElement);
                }
            }
        });
    },
    // deleteButton(x) {
    //         let newElement = document.createElement('div');
    //         newElement.className = 'deleteButton';
    //         newElement.innerHTML = '&#10799';
    //         newElement.addEventListener('click', function(e){
    //             let parent = this.parentNode;
    //             let parentUid = parent.getAttribute('uid');
    //             if (confirm('This will delete this element and all the elements inside of it, are you sure you want to proceed')) {
    //                 while (parent.firstChild) {
    //                     parent.removeChild(parent.firstChild);
    //                 }
    //                 parent.parentNode.removeChild(parent);
    //                 elementEngine.removeFromData(Number(parentUid));
    //             }
    //             
    //         });
    //         x.appendChild(newElement);
    // },
    createDeleteButton(e) {
        // console.log(e.getElementsByClassName('deleteButton').length[0]);
        let element = e.target;
        let parent = element.parentNode;
        let index = parent.getElementsByClassName('deleteButton').length;
        // console.log('index: ' + index);
        // console.log(parent);
        // console.log(element.parentNode);
        // console.log(parent.childNodes.length)
        if (index == 0) {
            let newElement = document.createElement('div');
            newElement.className = 'deleteButton';
            newElement.innerHTML = '&#10799';
            let removeElement = function(e) {
                let element = e.target;
                let parent = element.parentNode;
                let parentUid = parent.getAttribute('uid');
                // console.log(parent);
                if (confirm('This will delete this element and all the elements inside of it, are you sure you want to proceed')) {
                    while (parent.firstChild) {
                        parent.removeChild(parent.firstChild);
                    }
                    parent.parentNode.removeChild(parent);
                    elementEngine.removeFromData(Number(parentUid));
                }
            };
            newElement.addEventListener('click', removeElement);
            if (parent.childNodes.length > 0) {
                parent.insertBefore(newElement, parent.firstChild);
            } else {
                 parent.appendChild(newElement);
            }
        }
    },
    pseudoElements: {
        create(cssClass) {
            console.log(cssClass);
            let pseudoElementUid = 0;
            let createPElement = function(cssClass) {
                let pseudoElement = document.createElement('DIV');
                pseudoElement.setAttribute('class', 'pseudoEle');
                pseudoElement.addEventListener('click', function() {
                    pE(this);
                });
                pseudoElement.addEventListener('drop', function() {
                    editingOnDrop(event, this);
                });
                pseudoElement.addEventListener('dragover', function() {
                    allowDrop(event);
                });
                
                if (cssClass) {
                    pseudoElement.className += ` ${cssClass}`;
                }
                return pseudoElement;
            };
            let container = ['sectionContainer', 'subSection'];
            let items = ['textBigContainer', 'inputContainer', 'bttnClass'];
            if (container.includes(cssClass)) {
                let parentNode = document.getElementsByClassName('contentArea')[0]
                let nodeList = parentNode.childNodes;
                nodeList = Array.from(nodeList);
                console.log(nodeList);
                parentNode.insertBefore(createPElement(cssClass), nodeList[0]);
                nodeList.forEach(function(e) {
                    let pe = createPElement(cssClass);
                    insertAfter(pe, e)
                });
            }  else {

            }
            // if (container.includes(cssClass) || items.includes(cssClass)) {
            //     let nodeList = document.getElementsByClassName('contentArea')[0];
            //     for (let i = 0; i < nodeList.length; i++) {
            //         insertAfter(createPElement(cssClass), nodeList[i]);
            //     }
            // } else if (items.includes(cssClass)) {

            // }
        },
        // create(cssClass) {
        //     let nodeList = document.getElementsByClassName('contentArea')[0].querySelectorAll('[uid]');
        //     // console.log(nodeList);
        //     // let filterFunc = function(input) {
        //         // return input.className == 'sectionBody' && 'subSection';
        //     // }
        //     // let filteredNodeList = Array.from(nodeList);
        //     // let filteredNodeList = Array.from(nodeList).filter(filterFunc);
        //     // filteredNodeList.forEach(function(e){
        //     //     console.log(e.className);
        //     // });
        //     // console.log(filteredNodeList);
        //     let pseudoElementUid = 0;
        //     let createPElement = function(cssClass) {
        //         let pseudoElement = document.createElement('DIV');
        //         pseudoElement.setAttribute('class', 'pseudoEle');
        //         pseudoElement.addEventListener('click', function() {
        //             pE(this);
        //         });
        //         pseudoElement.addEventListener('drop', function() {
        //             editingOnDrop(event, this);
        //         });
        //         pseudoElement.addEventListener('dragover', function() {
        //             allowDrop(event);
        //         });
                
        //         if (cssClass) {
        //             pseudoElement.className += ` ${cssClass}`;
        //         }
        //         return pseudoElement;
        //     };
        //     // console.log(nodeList);
        //     // let nodeArray = Array.from(nodeList);
        //     // function filterClass(class) {
        //     //     if ()
        //     // }
        //     // console.log(nodeArray);
        //     // nodeArray.filter

        //     nodeList.forEach(function(e) {
        //         let checkCssClass = function(cssClass) {
        //             cssClass = cssClass.toLowerCase();
        //             switch (cssClass) {
        //                 case 'sectionbody':
        //                 case 'inputcontainer':
        //                 case 'textbigcontainer':
        //                 case 'subsection':
        //                     return true;
        //                 default:
        //                     return false;
        //             }
        //         };
                
        //         if (!e.firstChild) {
        //             console.log(e);
        //             console.log('has no children');
        //         }
        //         if (checkCssClass(e.className)) {
        //             let referenceNode =
        //                 document.querySelector(
        //                     '[uid="' + e.getAttribute('uid') + '"]'
        //                 );
        //             if (Array.prototype.indexOf.call(e.parentNode.childNodes, e) === 0) {
        //                 let firstPseudoElement = createPElement(cssClass);
        //                 e.parentNode.insertBefore(firstPseudoElement, referenceNode);
        //             }
        //             let pseudoElement = createPElement(cssClass);
        //             // let referenceNode = 
        //             //     document.querySelector('[uid="' + e.getAttribute('uid') + '"]');
        //             insertAfter(pseudoElement, referenceNode);
        //         }
        //     });
        // },
        // create(cssClass) {
        //     let nodeList;
        //     if (cssClass == 'sectionContainer') {
        //         nodeList = document.getElementsByClassName('contentArea')[0];
        //     } else {
        //         nodeList = document.getElementsByClassName('contentArea')[0].getElementsByClassName('sectionBody');
        //     }
        //     console.log(nodeList);

        // },
        // create(cssClass) {
        //     let nodeList = document.getElementsByClassName('contentArea')[0].querySelectorAll('[uid]');
        //     let pseudoElementUid = 0;
        //     let createPElement = function(cssClass) {
        //         let pseudoElement = document.createElement('DIV');
        //         pseudoElement.setAttribute('class', 'pseudoEle');
        // 
        //         pseudoElement.addEventListener('click', function() {
        //             pE(this);
        //         });
        //         pseudoElement.addEventListener('drop', function() {
        //             editingOnDrop(event, this);
        //         });
        //         pseudoElement.addEventListener('dragover', function() {
        //             allowDrop(event);
        //         });
        // 
        //         // pseudoElement.setAttribute('onclick', 'pE(this)');
        //         // pseudoElement.setAttribute('ondrop', 'editingOnDrop(event, this)');
        //         // pseudoElement.setAttribute('ondragover', 'allowDrop(event)');
        //         if (cssClass) {
        //             // console.log('cssClass:' + cssClass);
        //             pseudoElement.className += ` ${cssClass}`;
        //         }
        //         return pseudoElement;
        //     };
        //     nodeList.forEach(function(e) {
        //         let checkCssClass = function(cssClass) {
        //             cssClass = cssClass.toLowerCase();
        //             switch (cssClass) {
        //                 case 'sectionbody':
        //                 case 'inputcontainer':
        //                 case 'textbigcontainer':
        //                 case 'subsection':
        //                 // case 'sectioncontainer':
        //                 // case 'sectionitle':
        //                 // case 'labelclass':
        //                 // case '':
        //                     return true;
        //                 default:
        //                     return false;
        //             }
        //         };
        //         // let checkCssClass = function(cssClass) {
        //         //     cssClass = cssClass.toLowerCase();
        //         //     switch (cssClass) {
        //         //         case 'inputclass':
        //         //         case 'sectioncontainer':
        //         //         case 'sectionitle':
        //         //         case 'labelclass':
        //         //         case '':
        //         //             return false;
        //         //         default:
        //         //             return true;
        //         //     }
        //         // };
        //         // if ((e.tagName != 'INPUT') &&
        //         //  (e.className != 'labelClass') && ('')) {
        //         if (checkCssClass(e.className)) {
        //             let referenceNode =
        //                 document.querySelector(
        //                     '[uid="' + e.getAttribute('uid') + '"]'
        //                 );
        //             if (Array.prototype.indexOf.call(e.parentNode.childNodes, e) === 0) {
        //                 let firstPseudoElement = createPElement(cssClass);
        //                 e.parentNode.insertBefore(firstPseudoElement, referenceNode);
        //             }
        //             let pseudoElement = createPElement(cssClass);
        //             // let referenceNode = 
        //             //     document.querySelector('[uid="' + e.getAttribute('uid') + '"]');
        //             insertAfter(pseudoElement, referenceNode);
        //         }
        //     });
        // },
        destroy() {
            if (document.getElementsByClassName('psuedoEle') &&
                document.getElementsByClassName('pseudoEle')[0] &&
                document.getElementsByClassName('pseudoEle')[0].parentNode) {
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
    let elements = document.querySelectorAll('[uid]');
    for (let i = 0; i < elements.length; i++) {
        elements[i].setAttribute('draggable', 'true');
    }
};

let makeUnDraggable = function() {
    let elements = document.querySelectorAll('[uid]');
    for (let i = 0; i < elements.length; i++) {
        elements[i].setAttribute('draggable', 'false');
    }
};

// elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
// elementEngine.recreateElements(objecto);
let resetData = function() {
    localStorage.setItem('obj', JSON.stringify(objecto));
    let myNode = document.getElementsByClassName('contentArea')[0];
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
};
let clearData = function() {
    localStorage.setItem('obj', JSON.stringify(emptyData));
    let myNode = document.getElementsByClassName('contentArea')[0];
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
};

// ------------------------------------------------------------------
// EVENT-LISTENER
// ------------------------------------------------------------------




if (debugging) {
    let sectionBttn = document.getElementsByClassName('sectionBttn')[0];
    let clearBttn = document.getElementsByClassName('clearBttn')[0];
    let inputBttn = document.getElementsByClassName('inputBttn')[0];
    let buttonBttn = document.getElementsByClassName('buttonBttn')[0];
    let resetBttn = document.getElementsByClassName('resetBttn')[0];
    let logBttn = document.getElementsByClassName('logBttn')[0];

    sectionBttn.addEventListener('click', function() {
        // lastElementCreated =
        elementEngine.htmlFromData(elementBase.section2, true, 'contentArea');
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

    let logClickedElement = function() {
        document.getElementsByClassName('contentArea')[0].addEventListener('click', function(e) {
            let nodeList = document.querySelectorAll(':hover');
            let lastNode = {
                element: nodeList[nodeList.length - 1],
                uid: function() {
                    return leftPad(this.element.getAttribute('uid'), 3, ` `);
                },
                tagName: function() {
                    return this.element.tagName;
                },
                class: function() {
                    return this.element.className;
                }

            };
            lastCalledNode = lastNode.uid();
            // console.log(lastNode.uid());
            console.log(`uid: ${lastNode.uid()}` + ` tagName: ${lastNode.tagName()}` + ` class: ${lastNode.class()}`);
        });
    };
    logClickedElement();
}

let getPositionInNodeList = function(source) {

}
let lastCalledNode;

let rollDice = function(sides) {
    return Math.floor(Math.random() * sides + 1);
};

let rollTest = function(sides, times) {
    let diceRolls = {};
    for (let i = 0; i < times; i++) {

        let rolled = rollDice(sides);
        if (!diceRolls[rolled]) {
            diceRolls[rolled] = 1;
        } else {
            diceRolls[rolled] += 1;
        }
    }
    console.log(diceRolls);
};


let searchChat = function(target) {
    // TODO: does not work if letiable is at end of string
    let nodeList = document.querySelectorAll('[class="labelClass"]');
    let stringArray = target;
    let tempString = '';
    let letH = '';
    for (i = 0; i < stringArray.length; i++) {
        if (stringArray[i].match(/[a-zA-Z]/g)) {
            letH += stringArray[i];
            if (i == stringArray.length - 1 && letH) {
                tempString += eval(letH);
            }
        } else {
            if (letH) {
                console.log(letH);
                nodeList.forEach(function(e) {
                    if (e.firstChild.nodeValue == letH) {
                        if (e.childNodes[1].value && !isNaN(e.childNodes[1].value)) {
                            console.log('value:' + e.childNodes[1].value);
                            tempString += e.childNodes[1].value;
                        }
                    }
                });
            }
            tempString += stringArray[i];
            letH = '';
        }
    }
    console.log(tempString);
    console.log(math.eval(tempString));
};
// console.log(elementBase.lengt);

let pseudoEve = function() {
    let nodeList = document.getElementsByClassName('pseudoEle');
    for (let i = 0; i < nodeList.length; i++) {
        document.getElementsByClassName('pseudoEle')[i].addEventListener('click', function(e) {
            e.style.backgroundColor = 'red';
        });
    }
};

let pE = function(x) {
    // console.log(x);
    let info = {};
    info.parentNode = x.parentNode.getAttribute('uid');
    info.index = Array.prototype.indexOf.call(x.parentNode.childNodes, x);
    info.insertAfter = x.parentNode.childNodes[info.index - 1].getAttribute('uid');
    // console.log(x.parentNode.childNodes[info.index - 1]);
    console.log(info);
    return info;
};

let dropEvent = function(e) {
    e.preventDefault();

    console.log(e);
};

let dragEvent = function(e) {
    e.preventDefault();
    let data = e.dataTransfer.setData("test");
    // console.log(data);
};

let allowDrop = function(e) {
    e.preventDefault();
};


let insertAfterUid = function(info) {
    let target;

};

let editingOnDrag = function(e, element) {
    // e.preventDefault();
    // console.log(element.getAttribute('elementData'));
    e.dataTransfer.setData('elementData', element.getAttribute('elementdata'));
    dragInfoThing = element.className;
    // console.log(e));
    // e.dataTransfer.setData('element', e.getAttribute('data'));
    // console.log(e.getAttribute('data'));
};

let editingOnDrop = function(e, dropInfo) {
    // let elementData = e.dataTransfer.getData('elementData');
    // if (typeof elementData != 'object') {
    //     elementData = elementBase[elementData];
    // }
    // // console.log(elementData);

    // let info = {};
    // // console.log('this.parentNode ----------------');
    // // console.log(dropInfo.parentNode.getAttribute('uid'));
    // info.parentNode = dropInfo.parentNode.getAttribute('uid');
    // info.index = Array.prototype.indexOf.call(dropInfo.parentNode.childNodes, dropInfo);
    // // console.log('insertAfter ----------------')
    // // console.log((Number(info.index) / 2 ) - 1);
    // if (((Number(info.index)) / 2) > 0) {
    //     // info.insertAfterUid = dropInfo.parentNode.childNodes[info.index - 1].getAttribute('uid');
    //     info.insertAtPosition = (Number(info.index)) / 2;
    // } else {
    //     info.insertAtFirstPosition = true;
    // }
    // // info.insertAfterUid = dropInfo.parentNode.childNodes[info.index - 1].getAttribute('uid');

    // // console.log(info);
    // elementEngine.htmlFromData(elementData, true, Number(info.parentNode), Number(info.insertAtPosition));


    let elementData = e.dataTransfer.getData('elementData');
    if (typeof elementData != 'object') {
        elementData = elementBase[elementData];
    }
    let info = {};
    let parentNode;
    let parentNodeUid;
    console.log(dropInfo);
    console.log('dropInfo.parentNode');
    console.log(dropInfo.parentNode);
    if (dropInfo.parentNode.className == 'contentArea') {
        // let targetNode = dropInfo.parentNode;
        parentNode = 'contentArea';
    } else {
        // console.log('here we go')
        parentNode = dropInfo.parentNode;
        parentNodeUid = Number(dropInfo.parentNode.getAttribute('uid'));
        // info.parentNode = dropInfo.parentNode.getAttribute('uid');
        // console.log(dropInfo);
        // console.log(this);
        // let targetNode = document.querySelector('[uid="' + info.parentNode + '"]');
        // let x = targetNode.childNodes.length;
        console.log('parent uid ' + parentNodeUid);
    }
    // console.log('wulwwueli' + info.parentNode);
    // console.log('typeOf' + typeof targetNode);
    console.log('--------------');
    // console.log(parentNode.childNodes.length);
    console.log('--------------');
    if ((typeof parentNodeUid == 'number') && (parentNode.childNodes.length > 1)) {
        let index = Array.prototype.indexOf.call(parentNode.childNodes, dropInfo);
        let insertAfter = ((index)/ 2 - 1);
        let insertAtPosition = (Number(index)) / 2;
        console.table([['parentNodeUid', 'insertAtPosition', 'elementData'], [parentNodeUid, insertAtPosition, elementData]]);
        elementEngine.htmlFromData(elementData, true, Number(parentNodeUid), Number(insertAtPosition));
    } else {
        if (parentNode == 'contentArea') {
            elementEngine.htmlFromData(elementData, true, parentNode);
        } else {
            elementEngine.htmlFromData(elementData, true, Number(parentNodeUid));
        }
        
    }
    // console.log(`length: ${x}`)
    
    // if (((Number(info.index)) / 2) > 0) {
    //     info.insertAfterUid = dropInfo.parentNode.childNodes[info.index - 1].getAttribute('uid');
    //     info.insertAtPosition = (Number(info.index)) / 2;
    // } else {
    //     info.insertAtFirstPosition = true;
    // }
};
let saveInputToData = function(e) {
    let element = e.target;
    let uid = element.getAttribute('uid');
    let value = element.value;
    
    elementEngine.updateData(Number(uid), value, 'value');
};

let turnElementIntoInput = function(e) {
    let element = e.target;
    let parent = element.parentNode;
    let parentLength = parent.length
    let elementIndex = Array.prototype.indexOf.call(parent.childNodes, element);
    let value = element.innerHTML;
    let uid = element.getAttribute('uid');
    let tempEle = document.createElement('input');
    
    let revertInfo = {
        tagName: element.tagName,
        cssClass: element.className,
    };
    
    if (value == '&nbsp;') {
        console.log('value is &nbsp;');
    } else {
        tempEle.value = value;
    }
    
    tempEle.setAttribute('uid', uid);
    // tempEle.className = 'inputClass inputEdit';
    tempEle.className = 'inputEdit' + ' ' + element.className;
    tempEle.setAttribute('revertInfo', JSON.stringify(revertInfo));
    // // tempEle.addEventListener('blur', function(event){
    // //     elementEngine.updateData(Number(this.getAttribute('uid')), this.value);
    // //     event.preventDefault();
    // //     event.stopImmediatePropagation();
    // //     event.stopPropagation();
    // //     event.cancelBubble = true;
    // //     turnInputIntoLabel(this);
    // // });
    tempEle.addEventListener('change', function(event) {
        // let key = event.which || event.keyCode;
        // if (key === 13) {
            // elementEngine.updateData(Number(this.getAttribute('uid')), this.value);
             // event.preventDefault();
            // event.stopImmediatePropagation();
            turnInputIntoElement(this);
        // }
    });
    parent.removeChild(element);
    
    if (parentLength == 'undefined') {
        parent.appendChild(tempEle);
    } else {
        parent.insertBefore(tempEle, parent.childNodes[elementIndex]);
    }
    tempEle.focus();
};
let turnInputIntoElement = function(e) {
    let revertInfo = JSON.parse(e.getAttribute('revertInfo'));
    let parent = e.parentNode;
    let parentLength = parent.length;
    let elementIndex = Array.prototype.indexOf.call(parent.childNodes, e);
    let value = e.value;
    if (value === '') {
        console.log('value is empty');
        value = '&nbsp;';
    }
    let uid = e.getAttribute('uid');
    elementEngine.updateData(Number(uid), value);
    let tempEle = document.createElement(revertInfo.tagName);

    tempEle.innerHTML = value;
    tempEle.setAttribute('uid', uid);
    tempEle.className = revertInfo.cssClass;
    tempEle.addEventListener('click', turnElementIntoInput);
    
    parent.removeChild(e);
    
    if (parentLength == 'undefined') {
        parent.appendChild(tempEle);
    } else {
        parent.insertBefore(tempEle, parent.childNodes[elementIndex]);
    }
};

let blurThis = function(e){
    console.log('yo whattup dog');
    e.target.blur();
}
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

    // let nodeList = document.querySelectorAll('.labelClass, .sectionTitle');
    let nodeList = document.getElementsByClassName('labelClass');
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].addEventListener('click', function() {
            turnLabelIntoInput(this);
        });
    }
};
makeInputEditable();

if (editingInterface) {
    elementEngine.buildEditingInterface(elementBase);
}


// -----------------------------------------------------------------------------
// TESTING
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------

if (!localStorage.getItem('obj')) {
    localStorage.setItem('obj', JSON.stringify(objecto));
}

let playPage = function() {
    // document.getElementsByClassName('appContainer')[0].innerHTML = '';
    let node = document.getElementsByClassName('appContainer')[0];
    console.log(node);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    let mainContainer = document.createElement('div');
    mainContainer.className = 'mainContainer';
    let spacer = document.createElement('div');
    spacer.className = 'spacer';
    let spacer2 = document.createElement('div');
    spacer2.className = 'spacer';
    let contentAreaContainer = document.createElement('div');
    contentAreaContainer.className = 'contentAreaContainer';
    let contentArea = document.createElement('div');
    contentArea.className = 'contentArea';

    mainContainer.appendChild(spacer);
    contentAreaContainer.appendChild(contentArea);
    mainContainer.appendChild(contentAreaContainer);
    mainContainer.appendChild(spacer2);

    node.appendChild(mainContainer);

    elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
};

// elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));


let ajaxRequest = function(requestType, dataObj){
    if (typeof dataObj == 'undefined' || dataObj == null) {
        let dataObj = false;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://saeap.dev', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (dataObj != false) {
        let requestData = JSON.stringify(dataObj);
        xhr.send('requestType='+ requestType + '&requestData='+ requestData );
    } else {
        xhr.send('requestType=' + requestType);
    }
    return new Promise(function(resolve,reject){ 
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = JSON.parse(xhr.responseText);
                if (response.hasOwnProperty('location')) {
                    return window.location.href = response.location;
                } else {
                    resolve(response);
                }
            } else {
            }
        };
    });
}

let testosteron = function() {
    let data = localStorage.getItem('obj');
    ajaxRequest('createTemplate', data)
        .then((data) => {
            console.log(data);
        });
}


let getUrlPath = function() {
    let path = window.location.pathname;
    return path;
}

let checkUrlPath = function(){
    let path = getUrlPath();
    switch (path) {
        case '/app/userSettings.html':
            emptyAppContainer();
            fillAPPsettings();
            setTimeout(function(){ userSettings(); }, 1000);
            break;
        case '/app/play.html':
            elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
            break;
        case '/app/edit.html':
            editing = true;
            editingInterface = true;
            debugging = true;
            elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')));
            break;
        default:
            break;
    }
}

checkUrlPath();
let pseudoElementUid = 0;
let createPElement = function(cssClass) {
                let pseudoElement = document.createElement('DIV');
                pseudoElement.setAttribute('class', 'pseudoEle');
                pseudoElement.addEventListener('click', function() {
                    pE(this);
                });
                pseudoElement.addEventListener('drop', function() {
                    editingOnDrop(event, this);
                });
                pseudoElement.addEventListener('dragover', function() {
                    allowDrop(event);
                });
                
                if (cssClass) {
                    pseudoElement.className += ` ${cssClass}`;
                }
                return pseudoElement;
            };
let teeeeet = Array.from(document.getElementsByClassName('subSection'));

// teeeeet.push(Array.from(document.getElementsByClassName('subSection')));
// teeeeet.forEach(function(e) {
//     e.addEventListener('dragenter', function() {
//         let targetNode = this;
//         let nodeList = Array.from(targetNode.childNodes);
//         if (targetNode.getElementsByClassName('pseudoEle')[0]) {

//         } else if (targetNode.childNodes.length > 0){
//             let cssClass = 'something';
//             for (let i = 0; i < nodeList.length; i++) {
//                 let pe = createPElement(cssClass);
//                 targetNode.insertBefore(pe, nodeList[i])
//             }
//             insertAfter(createPElement(cssClass), nodeList[nodeList.length - 1])
//         } else {
//             let cssClass = 'something';
//             let pe = createPElement(cssClass);
//             targetNode.appendChild(pe);
//         }
//         // console.log('hi');
        
//         // let pe = createPElement(cssClass);
//         // console.log(this);
//         // insertAfter(pe, teeeeet[0].childNodes[0]);

//         // this.childNodes.forEach(function(e) {
//             // let cssClass = 'something'
//             // let pe = createPElement(cssClass);
//             // insertAfter(pe, e)
//             // console.log(e)
//         // });
//     });
// });
let deleteMode = false;
let deleteModeFunction = function(){

}

let emptyAppContainer = function(){
    let appContainer = document.getElementsByClassName('appContainer')[0];
    while(appContainer.firstChild){
        appContainer.removeChild(appContainer.firstChild);
    }
}
let fillAPPsettings = function(){
    let appContainer = document.getElementsByClassName('appContainer')[0]
    ajaxRequest('getHTML', 'settings')
        .then((data) => {
            appContainer.innerHTML = data;
        })
}







let userSettings = function() {
    // ----------------------------------------------
    // Target Declaration
    // ----------------------------------------------
    let myGamesBttn = document.getElementsByClassName('myGames')[0];
    let createGameBttn = document.getElementsByClassName('createGame')[0];
    let myTemplatesBttn = document.getElementsByClassName('myTemplates')[0];
    let createTemplateBttn = document.getElementsByClassName('createTemplate')[0];
    let changeInfoBttn = document.getElementsByClassName('changeInfo')[0];
    let setProfileImageBttn = document.getElementsByClassName('setProfileImage')[0];

    let myGamesContent = document.getElementsByClassName('myGamesContent')[0];
    let createGameContent = document.getElementsByClassName('createGameContent')[0];
    let myTemplatesContent = document.getElementsByClassName('myTemplatesContent')[0];
    let createTemplateContent = document.getElementsByClassName('createTemplateContent')[0];
    let changeInfoContent = document.getElementsByClassName('changeInfoContent')[0];
    let setProfileImageContent = document.getElementsByClassName('setProfileImageContent')[0];

    let dataObj = {
            username: 'username',
            password: 'password',
    };

    let getUserCharactersheets = function(){
        while (myGamesContent.firstChild){
            myGamesContent.removeChild(myGamesContent.firstChild);
        };

        ajaxRequest('getGamesListFromUser', "")
            .then((data) => {
                let x = document.createElement('div');
                    x.innerHTML = 'joined';
                    myGamesContent.appendChild(x);
                data.joined.forEach(function(element){
                    myGamesContent.appendChild(createGameCollumn(element.id, element.name));
                });
                let y = document.createElement('div');
                    y.innerHTML = 'owned';
                    myGamesContent.appendChild(y);
                data.owned.forEach(function(element){
                    myGamesContent.appendChild(createGameCollumn(element.id, element.name));
                });
            });
    };

    let playGame = function(id) {
        let requestType = 'getCharacterSheetFromUser'
        ajaxRequest(requestType, id)
            .then((data) => {
                console.log(data);
                localStorage.setItem('obj', JSON.stringify(data));
                playPage();
            });
    }
    let displayMyGames = function() {
        let requestType = '';
        ajaxRequest(requestType);
    }
    let createGameCollumn = (id, name) => {

        let createResultRowCol = function(element, className, innerHTML, target,
            name = false, type = false, value = false)
        {
            // if (element != false) {
            let newElement = document.createElement(element);
            // }
            if (className != false) {
                newElement.className = className;
            }
            if (innerHTML != false) {
                newElement.innerHTML = innerHTML;
            }
            if (name != false) {
                newElement.name = name
            }
            if (type != false) {
                newElement.type = type;
            }
            if (value != false) {
                newElement.value = value;
            }
            if (target != false) {
                target.appendChild(newElement);
            }
            return newElement;
        };
        let testFunc = function(){
            let body = document.getElementsByTagName('BODY')[0];
            let testOverlay = createResultRowCol('div', 'testOverlay', false, body)
            let testContent = createResultRowCol('div', 'testContent', false, testOverlay)
            return testContent;
        }



        let newElement = document.createElement('div');
        newElement.className = "gameRow";

        let gameInfoRow = document.createElement('div');
        gameInfoRow.className = 'gameInfoRow'
        let gameEditRow = document.createElement('div');
        gameEditRow.className = 'gameEditRow'

        let settingsBttn = document.createElement('button');
        settingsBttn.innerHTML = '&#9881';
        settingsBttn.type = 'button';
        settingsBttn.className = 'gameSettingsBttn'
        // settingsBttn.addEventListener('click',function() {
        //     this.parentNode.parentNode.getElementsByClassName('gameEditRow')[0].style.display = 'flex';
        //     for (let i = 0; i < this.parentNode.parentNode.childNodes.length; i++) {
        //         if (this.parentNode.parentNode.childNodes[i].className == 'gameEditRow') {

        //         }
        //     }
        // })
        let createPlayersList = () => {

        }
        settingsBttn.addEventListener('click', function(){
            let editBox = testFunc();
            let dataObj = {
                gameId: id,
            };
            let getGamePlayers = ajaxRequest('getGamePlayers', dataObj)
                .then((data) =>{
                    let playersListWrapper = createResultRowCol('div', 'playersListWrapper', 'players', editBox)
                    for (let i = 0; i < data.length; i++) {
                        let player = createResultRowCol('div', 'player', data[i].username, playersListWrapper);
                        console.log(data[i].username);
                    }
                });
            // ajaxRequest('getGameMasters', 'dataObj')
            //     .then((data) => {
            //         console.log(data);
            //     });
            let getFriends = ajaxRequest('getFriends', '')
                .then((data) =>{
                    let friendsListWrapper = createResultRowCol('div', 'friendsListWrapper', 'friends', editBox)
                    // for (let i = 0; i < data.length; i++) {
                    data.forEach(function(e){
                        let friendRow = createResultRowCol('div', 'friendRow', false, friendsListWrapper)
                        let friendName = createResultRowCol('div', 'friendName', e.username, friendRow);
                        let friendSelect = createResultRowCol('input', 'friendSelect', false, friendRow, 'friendSelect', 'radio', e.username);

                        console.log(e.username);
                    });
                });
            Promise.all([getGamePlayers, getFriends])
                .then( () => {
                    console.log('all finished')
                });

        });
        
        let col1 = document.createElement('div');
        col1.innerHTML = id;
        col1.className = "gameId";
        
        let col2 = document.createElement('div');
        col2.innerHTML = name;
        col2.className = "gameName";

        let playButton = document.createElement('button');
        playButton.innerHTML = 'Play';
        playButton.type = 'button';
        playButton.className = 'gamePlayBttn';
        playButton.addEventListener('click', function() {
            let dataObj = {
                id: id,
            }
            console.log(id);
            playGame(dataObj);
            
        });


        // game settings
        //leave game


        // add player /add gamemaster
        //  - get friends
        
        let addUserInterface = createResultRowCol('div', 'addUserInterface', false, gameEditRow);
        let userTypeSelector = createResultRowCol('div', 'userTypeSelector', false, addUserInterface);
        let userTypeTag = createResultRowCol('div', 'userTypeTag', 'Add User As', userTypeSelector);
        let userTypePlayer = createResultRowCol('div', 'userTypePlayer', 'Player', userTypeSelector);
        let userTypeGameMaster = createResultRowCol('div', 'userTypeGameMaster', 'GameMaster', userTypeSelector);
        let searchFriendsInterface = createResultRowCol('div', 'searchFriendsInterface', false, addUserInterface);
        let searchFriends = function(){
            ajaxRequest('getFriends', '')
                .then((data) => {
                    for (let i = 0; i < data.friends.length; i++){
                        createResultRowCol('div', 'friendName', data.friends[i], searchFriendsInterface);
                    }
                });
        }
        // 
        // join as player
        // join as gamemaster
        // delete


        // newElement.appendChild(col1);
        gameInfoRow.appendChild(settingsBttn);
        gameInfoRow.appendChild(col2);
        gameInfoRow.appendChild(playButton);
        newElement.appendChild(gameInfoRow);
        newElement.appendChild(gameEditRow);
        // newElement.appendChild(settingsBttn);
        // newElement.appendChild(col2);
        // newElement.appendChild(playButton);

        return newElement;
    }

    let createGameInterface = function() {

    }

    // getUserCharactersheets();
    // getUserCharactersheets()
    //     .then((data) => {
        //     console.log(data);
        // });

    let createTemplate = function(){
        emptyAppContainer();
        let getEdit = ajaxRequest('getHTML', 'edit')
            .then((data) => {
                // localStorage.setItem('obj', JSON.stringify(newTemplateBase));
                localStorage.setItem('obj', newTemplateBase);
                document.getElementsByClassName('appContainer')[0].innerHTML = data;
                // let base = newTemplateBase;
                elementEngine.buildHtml(JSON.parse(localStorage.getItem('obj')), 'contentArea');
                elementEngine.buildEditingInterface(elementBase);
            });

    }


    let collapseOthers = function(view){
        let defaultDisplay = 'flex';
        if (view == "myGamesContent") {
            myGamesContent.style.display = defaultDisplay;
        } else {
            myGamesContent.style.display = 'none';
        }
        if (view == 'createGameContent') {
            createGameContent.style.display = defaultDisplay;
        } else {
            createGameContent.style.display = 'none';
        }
        if (view == 'myTempaltesContent') {
            myTemplatesContent.style.display = defaultDisplay;
        } else {
            myTemplatesContent.style.display = 'none';
        }
        if (view == 'createTemplateContent') {
            createTemplateContent.style.display = defaultDisplay;
        } else {
            createTemplateContent.style.display = 'none';
        }
        
        // myGamesContent.style.display = 'none';
        // createGameContent.style.height = '0px';
        // myTemplatesContent.style.height = '0px';
        // createTemplateContent.style.height = '0px';
        // changeInfoContent.style.height = '0px';
        // setProfileImageContent.style.height = '0px';
    };


    myGamesBttn.addEventListener('click', getUserCharactersheets);
    myGamesBttn.addEventListener('click', function(){collapseOthers('myGamesContent')});
    createGameBttn.addEventListener('click', function(){collapseOthers('createGameContent')});
    myTemplatesBttn.addEventListener('click', function(){collapseOthers('myTemplatesContent')});
    createTemplateBttn.addEventListener('click', createTemplate);
    createTemplateBttn.addEventListener('click', function(){collapseOthers('createTemplateBttn')});
    let templateSearchInput = document.getElementsByClassName('templateSearchInput')[0];
    let templateSearchResult = document.getElementsByClassName('templateSearchResult')[0];
    let templateNameColumn = document.getElementsByClassName('templateNameColumn')[0];
    let templateAuthorColumn = document.getElementsByClassName('templateAuthorColumn')[0];
    let templateCreatedColumn = document.getElementsByClassName('templateCreatedColumn')[0];
    let templateLastEditColumn = document.getElementsByClassName('templateLastEditColumn')[0];
    let templateDescriptionColumn = document.getElementsByClassName('templateDescriptionColumn')[0];
    let templateUseForm = document.getElementsByClassName('templateUseForm')[0];
    let createNewGameSubmitBttn = document.getElementsByClassName('createNewGameSubmitBttn')[0];
    // let  = document.getElementsByClassName('')[0];
    let searchTemplates = function() {
        let searchValue = document.getElementsByClassName('templateSearchInput')[0].value;
        let searchResultColumns = document.getElementsByClassName('templateSearchResultColumn');
        while (templateSearchResult.firstChild) {
            templateSearchResult.removeChild(templateSearchResult.firstChild);
        }
        ajaxRequest('searchTemplates', searchValue)
            .then((data) => {
                for (let i = 0; i < data.templates.length; i++){
                    let createResultRowCol = function(element, className, innerHTML, target, name = false, type = false, value = false){
                        // if (element != false) {
                        let newElement = document.createElement(element);
                        // }
                        if (className != false) {
                            newElement.className = className;
                        }
                        if (innerHTML != false) {
                            newElement.innerHTML = innerHTML;
                        }
                        if (name != false) {
                            newElement.name = name
                        }
                        if (type != false) {
                            newElement.type = type;
                        }
                        if (value != false) {
                            newElement.value = value;
                        }
                        if (target != false) {
                            target.appendChild(newElement);
                        }
                        return newElement;
                    };
                    let resultRow = createResultRowCol('div', 'resultRow', false, templateSearchResult);

                    createResultRowCol('div', 'templateName', data.templates[i].name, resultRow);

                    createResultRowCol('div', "templateAuthor", data.templates[i].author, resultRow);

                    createResultRowCol('div', 'templateCreated', 
                        (new Date(Number(data.templates[i].creationDate.$date.$numberLong))).toLocaleDateString('de-DE'), 
                        resultRow
                    );

                    createResultRowCol('div', 'templateLastEdit',
                        (new Date(Number(data.templates[i].lastEdit.$date.$numberLong))).toLocaleDateString('de-DE'),
                        resultRow
                    );
                    let templateLastEdit = document.createElement('div');
      
                    createResultRowCol('div', 'templateDescription', data.templates[i].description, resultRow);

                    createResultRowCol('input', 'radio', false, resultRow, 'templateId', 'radio', data.templates[i]['_id']['$oid'])

                    let templatePreviewButton = createResultRowCol('button', 'templatePreview', 'Preview', resultRow, 'previewBttn', false, data.templates[i]['_id']['$oid']);
                    let createPreview = function() {
                        
                        let previewContainer = createResultRowCol('div', 'previewContainer', false, document.getElementsByTagName('BODY')[0]);
                        previewContainer.addEventListener('click', function(){
                            while (this.firstChild) {
                                this.removeChild(this.firstChild);
                            }
                            this.parentNode.removeChild(this);
                        });
                        let previewContentArea = createResultRowCol('div', 'previewContentArea', false, previewContainer);
                        let templateId = this.value;
                        // console.log(templateId);
                        let requestData = {
                            templateId: templateId,
                        };
                        ajaxRequest('getTemplate', requestData)
                            .then((data) => {
                                let template = data.versions[data.versions.length - 1].data;
                                let buildPreview = function(template, target) {
                                    for (let i = 0; i < template.elements.length; i++) {
                                        if (template.elements[i].hasOwnProperty('element')) {
                                            elementEngine.htmlFromData(template.elements[i], false, target);
                                        }
                                    }
                                }
                                buildPreview(template, 'previewContentArea')
                                // elementEngine.buildHtml(template, previewContentArea);
                            });
                    }
                    templatePreviewButton.addEventListener('click', createPreview);
                }
            });
    }

    templateSearchInput.addEventListener('change', searchTemplates);


    let getTemplateId = function() {
        // console.log(templateUseForm.value);
        let target = Array.from(document.getElementsByName('templateId'));
        // console.log(target);
        // let target = document.getElementsByClassName('templateUseForm')[0];
        // let children = target.childNodes;
        for (let i = 0; i < target.length; i++) {
            if (target[i].checked) {
                return target[i].value;
            }
        }
    }
// templateUseForm.addEventListener('change', getTemplateId);
// templateUseForm.addEventListener('change', getTemplateId);

    let createNewGame = function(){
        let gameName = document.getElementsByClassName('newGameNameValue')[0].value;
        let templateId = getTemplateId();
        // console.log(templateId);
        let requestData = {
            gameName: gameName,
            templateId: templateId,
        }
        ajaxRequest('createGame', requestData);
            // .then((data) => {
            //     console.log('finished');
            // });
    };
    createNewGameSubmitBttn.addEventListener('click', createNewGame);


    // testFunc();
}
let loginPage = function() {
    let loginRegisterBttn = document.getElementsByClassName('loginRegisterBttn')[0];

let loginSwitchBttn = document.getElementsByClassName('loginSwitch')[0];
let registerSwitchBttn = document.getElementsByClassName('registerSwitch')[0];

let loginSubmitBttn = document.getElementsByClassName('loginSubmitBttn')[0];
let registerSubmitBttn =
    document.getElementsByClassName('registerSubmitBttn')[0];


// loginSubmitBttn.addEventListener('click', function() {
//     let username = document.getElementsByClassName('loginUsername')[0].value;
//     let password = document.getElementsByClassName('loginPassword')[0].value;

//     let dataObj = {
//         username: username,
//         password: password,
//     };
//     // let dataJson = JSON.stringify(data);

//     let xhr = new XMLHttpRequest();
//     xhr.open('POST', 'http://saeap.dev', true);
//     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             let response = JSON.parse(xhr.responseText);
//             window.location.href = response.location;
//             // console.log(xhr.responseText);
//         } else {
//         }
//     };
//     let data = JSON.stringify(dataObj);
//     // let string = 'test='
//     xhr.send('requestType=login' + '&requestData='+ data );
// });

let loginFunc = function() {
    let username = document.getElementsByClassName('loginUsername')[0].value;
    let password = document.getElementsByClassName('loginPassword')[0].value;
    let dataObj = {
        username: username,
        password: password,
    };
    ajaxRequest('login', dataObj)
        .then((data) => {
            if (data == 'loginSuccess') {
                // window.location.pathname = 'app/userSettings.html';
                emptyAppContainer();
                fillAPPsettings();
                setTimeout(function(){ userSettings(); }, 1000);
                // userSettings();
            }
        });
}
loginSubmitBttn.addEventListener('click', loginFunc);




registerSubmitBttn.addEventListener('click', function() {
    let username = document.getElementsByClassName('registerUsername')[0].value;
    let email = document.getElementsByClassName('registerEmail')[0].value;
    let password = document.getElementsByClassName('registerPassword')[0].value;

    let dataObj = {
        username: username,
        email: email,
        password: password,
    };
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://saeap.dev', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        } else {
        }
    };
    let data = JSON.stringify(dataObj);
    xhr.send('requestType=register' + '&requestData='+ data );
});

loginRegisterBttn.addEventListener('click', function() {
    if (document.getElementsByClassName(
        'sidebarContainer sidebarContainerZeroWidth')[0]) {
            document.getElementsByClassName('sidebarContainer')[0]
            .className = 'sidebarContainer';
    } else {
        document.getElementsByClassName('sidebarContainer')[0].className =
        'sidebarContainer sidebarContainerZeroWidth';
    }
});

registerSwitchBttn.addEventListener('click', function() {
    document.getElementsByClassName('loginSwitch')[0].className = 'loginSwitch';
    document.getElementsByClassName('registerSwitch')[0].className = 'registerSwitch loginRegisterSwitchActive';
    document.getElementsByClassName('loginForm')[0].style.display = 'none';
    document.getElementsByClassName('registerForm')[0].style.display = 'block';
});
loginSwitchBttn.addEventListener('click', function() {
    document.getElementsByClassName('registerSwitch')[0].className = 'registerSwitch';
    document.getElementsByClassName('loginSwitch')[0].className = 'loginSwitch  loginRegisterSwitchActive';
    document.getElementsByClassName('registerForm')[0].style.display = 'none';
    document.getElementsByClassName('loginForm')[0].style.display = 'block';
});
}
loginPage();