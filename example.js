var obj = {
    metadata: {uniqueKeyPosition: 2},
    elements: {
        0: {element: "button", innerHTML: "click me"},
        1: {element: "input", params: {
            type: "text", value: "42"
        }}
    }};
    
var obj3 = {
    metadata: {uniqueKeyPosition: 2},
    elements: {
        0: {element: "button", innerHTML: "click me"},
        1: {element: "input", params: {
            type: "text", value: "42"
        }}
    }};
    
    
    
    
    
    
    {"metadata":{"uniqueKeyPosition":6},"elements":{"0":{"element":"button","innerHTML":"click me"},"1":{"element":"input","params":{"type":"text","value":"42"}},"2":{"element":"button","innerHTML":"click me"},"3":{"element":"INPUT"},"4":{"element":"INPUT"},"5":{"element":"INPUT"},"6":{"element":"INPUT"}}}
    
    
    
    
    
    
var obj2 = {
    metadata = {uidPosition: 0},
    elements = [
        {element: "section", background-color: "red", uid: "0", title: "this is the title", params: {class: "test"}, elements: [
            {element: "button", innerHTML: "click me"},
            {element: "input", params: {
                type: "text", value: "42"
            }
        ] }
    ]
}    





var obj = {
    metadata: {uniqueKeyPosition: 2},
    elements: {
        0: {element: "button", innerHTML: "click me"},
        1: {element: "input", params: {
            type: "text", value: "42"
        }},
        2: {element: "button", innerHTML: "click me"},
        3: {element: "button", innerHTML: "click me"},
        4: {element: "button", innerHTML: "click me"},
        5: {element: "button", innerHTML: "click me"},
    }};

var emlementsPrototypes = {
    'button':{"element":"button", "value":"", "class":""},
    'inputField':{"element":"input","type":"text", "value":"", "class":""}
}

var elementsPrototypes = 
[
    {
        button: {
            element: "button",
            params: {
                class: ""
            },
            innerHTML: ""
        }
    },
    {
        inputText: {
            element: "input",
            params: {
                type: "text",
                class: "",
                value: "",
                
            }
        }
    }
]
// BAD, object order is not guaranteed in javascript
var elemtsUniqueExample = {
    metadata: {uniqueKeyPosition: "2"},
    elements: {
        0: {
            element: "button",
            params: {
                class: "bttn"
            },
            innerHTML: "click me"
        },
        1: {
            element: "input",
            params: {
                type: "text",
                class: "inputText",
                value: "42"
            },
            characteristics: {
                params: {
                    value: "number"
                }
            }
        },
        2: {
            element: "table",
            params: {
                
            },
            properties: {
                rows: ["row1","row2","row3"],
                collumns: ["collumn1", "collumn2", "collumn3"],
                values: [[00, 01, 02], [10, 11, 12], [20, 21, 22]]
            }
        }
    }
}
var jsonResult = 
{"metadata":{"idCounter":0},"elements":[{"type":"button"},{"type":"button"},
{"type":"button"},{"type":"button"},{"type":"button"},{"type":"button"},
{"type":"button"},{"type":"button"}]};


var objecto = {
    metadata: {uidPosition: 4},
    elements: [
        {element: "section", params: {uid: 0, class:"testClass"}, elements: [
            {element: "section", params: {uid: 2}, elements: [
                {element: "button", content: "click me", params: {uid: 3}},
                {element: "input", params: {uid: 4, class:"inputClass", type: "text"}}
            ]}
        ]},
        {element: "button", params: {uid: 1}, content: "click me"}
    ]
}

var objectz = {
    "metadata": {
        "uidPosition": 3
    },
    "elements": [
        {
            "element": "section",
            "params": {
                "uid": 0,
                "class": "testClass"
            },
            elements: [
                {
                    "element": "section",
                    "params": {
                        "uid": 2,
                        "class": "testClass"
                    }
                },
                {
                    "element": "section",
                    "params": {
                        "uid": 3,
                        "class": "testClass"
                    }
                }
            ]
        },
        {
            "element": "section",
            "params": {
                "uid": 1,
                "class": "testClass"
            }
        }
    ]
}
// var objectz = {
//     "metadata": {
//         "uidPosition": 3
//     },
//     "elements": [
//         {
//             "element": "section",
//             "params": {
//                 "uid": 0,
//                 "class": "testClass"
//             },
//             elements: [
//                 {
//                     "element": "section",
//                     "params": {
//                         "uid": 2,
//                         "class": "testClass"
//                     }
//                 },
//                 {
//                     "element": "section",
//                     "params": {
//                         "uid": 3,
//                         "class": "testClass"
//                     }
//                 }
//             ]
//         },
//         {
//             "element": "section",
//             "params": {
//                 "uid": 1,
//                 "class": "testClass"
//             }
//         }
//     ]
// }