// module 'elementBase.js'

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
                    edit: [],
                }
            },
        ],
    },
};

export default elementBase;