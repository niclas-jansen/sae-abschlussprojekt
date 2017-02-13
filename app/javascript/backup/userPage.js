// let output = document.getElementById('gamesOverview');

// let dataObj = {
//         username: 'username',
//         password: 'password',
//     };

// let ajaxRequest = function(requestType, dataObj){
//     if (typeof dataObj == 'undefined' || dataObj == null) {
//         let dataObj = false;
//     }
// 	let xhr = new XMLHttpRequest();
//     xhr.open('POST', 'http://saeap.dev', true);
//     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     if (dataObj != false) {
//         let data = JSON.stringify(dataObj);
//         xhr.send('requestType='+ requestType + '&requestData='+ data );
//     } else {
//         xhr.send('requestType=' + requestType);
//     }
//     return new Promise(function(resolve,reject){ 
//         xhr.onreadystatechange = function() {
//             if (xhr.readyState == 4 && xhr.status == 200) {
//                 let response = JSON.parse(xhr.responseText);
//                 if (response.hasOwnProperty('location')) {
//                     return window.location.href = response.location;
//                 } else {
//                     // let ajaxResponse = new Promise((resolve, reject) => {
//                     // resolve('hi');
//                     resolve(response);
//                     // });
//                     // return ajaxResponse;
//                 }
//             } else {
//             }
//         };
//     });
//     // xhr.onreadystatechange = function() {
//     //     if (xhr.readyState == 4 && xhr.status == 200) {
//     //         let response = JSON.parse(xhr.responseText);
//     //         if (response.hasOwnProperty('location')) {
//     //         	return window.location.href = response.location;
//     //         } else {
//     //             let ajaxResponse = new Promise((resolve, reject) => {
//     //                 resolve(response);
//     //             });
//     //             return ajaxResponse;
//     //         }
//     //     } else {
//     //     }
//     // };    
// }

// let fetchRequest = function(requestType, dataObj) {
//     let request;
//     if (typeof dataObj == 'undefined' || dataObj == null) {
//         let data = JSON.stringify(dataObj);
//         request = 'requestType='+ requestType + '&requestData='+ data ;
//     } else {
//         request = 'requestType=' + requestType;
//     }
//     return fetch('http://saeap.dev', {
//         method: 'post',
//         body: 'request'
//     })
//     // .then(function(response) {
//     //     return response;
//     // });
// }


// let getUserCharactersheets = function(){
//     return ajaxRequest('getUserCharactersheets', dataObj);
//     // return fetchRequest('getUserCharactersheets', dataObj);
// };



// // getUserCharactersheets();
// getUserCharactersheets()
//     .then((data) => {
//         console.log(data);
//     });


// fetch('http://saeap.dev', {
//         method: 'post',
//         body: 'request'
//     })
//     .then(function(response) {
//         return response;
//     });

// new Promise(function(resolve,reject){ 
//     xhr.onreadystatechange(function(){.....else { resolve(response) }}); }



// ---------------------------------------------------------------------------

// let output = document.getElementById('gamesOverview');
let output = document.getElementsByClassName('myGamesContent')[0];

let dataObj = {
        username: 'username',
        password: 'password',
    };

// let ajaxRequest = function(requestType, dataObj){
//     if (typeof dataObj == 'undefined' || dataObj == null) {
//         let dataObj = false;
//     }
//     let xhr = new XMLHttpRequest();
//     xhr.open('POST', 'http://saeap.dev', true);
//     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     if (dataObj != false) {
//         let data = JSON.stringify(dataObj);
//         xhr.send('requestType='+ requestType + '&requestData='+ data );
//     } else {
//         xhr.send('requestType=' + requestType);
//     }
//     return new Promise(function(resolve,reject){ 
//         xhr.onreadystatechange = function() {
//             if (xhr.readyState == 4 && xhr.status == 200) {
//                 let response = JSON.parse(xhr.responseText);
//                 if (response.hasOwnProperty('location')) {
//                     return window.location.href = response.location;
//                 } else {
//                     // let ajaxResponse = new Promise((resolve, reject) => {
//                     // resolve('hi');
//                     resolve(response);
//                     // });
//                     // return ajaxResponse;
//                 }
//             } else {
//             }
//         };
//     });
// }
let getUserCharactersheets = function(){
    while (output.firstChild){
        output.removeChild(output.firstChild);
    }
    ajaxRequest('getGamesListFromUser', dataObj)
        .then((data) => {
            // console.table(data);
            data.joined.forEach(function(element){
                output.appendChild(createGameCollumn(element.id, element.name));
            });
            data.owned.forEach(function(element){
                output.appendChild(createGameCollumn(element.id, element.name));
            });
        });
};
let playGame = function(id) {
    let requestType = 'getCharacterSheetFromUser'
    ajaxRequest(requestType, id)
        .then((data) => {
            // console.log(data);
            localStorage.setItem('obj', JSON.stringify(data));
            playPage();
        });
}
let displayMyGames = function() {
    let requestType = '';
    ajaxRequest(requestType);
}
let createGameCollumn = (id, name) => {
    let newElement = document.createElement('div');
    newElement.className = "gameRow";

    let settingsBttn = document.createElement('button');
    settingsBttn.innerHTML = '&#9881';
    settingsBttn.type = 'button';
    settingsBttn.className = 'gameSettingsBttn'

    
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

    // newElement.appendChild(col1);
    newElement.appendChild(settingsBttn);
    newElement.appendChild(col2);
    newElement.appendChild(playButton);

    return newElement;
}

let createGameInterface = function() {

}

// getUserCharactersheets();
// getUserCharactersheets()
//     .then((data) => {
    //     console.log(data);
    // });

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
    // let l = searchResultColumns.length
    for (let i = 0; i < searchResultColumns.length; i++) {
        while (searchResultColumns[i].childNodes[2]) {
            searchResultColumns[i].removeChild(searchResultColumns[i].childNodes[2]);
        }
    }
    ajaxRequest('searchTemplates', searchValue)
        .then((data) => {
            // console.log(data.templates[2]);
            // console.log(data.templates.length);
            for (let i = 0; i < data.templates.length; i++){
                // console.log(data.templates[i]);
                // let templateRow = document.createElement('div');
                // templateRow.className = 'templateRow';
                let templateName = document.createElement('div');
                templateName.className = 'templateName';
                templateName.innerHTML = data.templates[i].name;
                templateNameColumn.appendChild(templateName);

                let templateAuthor = document.createElement('div');
                templateAuthor.className = 'templateAuthor';
                templateAuthor.innerHTML = data.templates[i].author;
                templateAuthorColumn.appendChild(templateAuthor);

                let templateCreated = document.createElement('div');
                templateCreated.className = 'templateCreated';
                templateCreated.innerHTML = (new Date(Number(data.templates[i].creationDate.$date.$numberLong))).toLocaleDateString('de-DE');
                templateCreatedColumn.appendChild(templateCreated);

                let templateLastEdit = document.createElement('div');
                templateLastEdit.className = 'templateLastEdit';
                // TODO: get Local time format by ip check
                templateLastEdit.innerHTML = (new Date(Number(data.templates[i].lastEdit.$date.$numberLong))).toLocaleDateString('de-DE');
                templateLastEditColumn.appendChild(templateLastEdit);
                // let mili = data.templates[i].lastEdit['$date']['$numberLong'];
                // console.log(new Date(Number(mili)));
                // console.log((new Date(Number(data.templates[i].lastEdit.$date.$numberLong))).toLocaleDateString('en-US'))
                
                let templateDescription = document.createElement('div');
                templateDescription.className = 'templateDescription';
                templateDescription.innerHTML = data.templates[i].description;
                templateDescriptionColumn.appendChild(templateDescription);

                let useTemplate = document.createElement('input');
                useTemplate.type = "radio";
                useTemplate.name = "templateId";
                useTemplate.value = data.templates[i]['_id']['$oid'];
                templateUseForm.appendChild(useTemplate);




                // templateLastEdit.innerHTML = (new Date(Number(data.templates[i].lastEdit.$date.$numberLong))).toString();

                // templateRow.appendChild(templateName);
                // templateRow.appendChild(templateAuthor);
                // templateRow.appendChild(templateLastEdit);
                // templateSearchResult.appendChild(templateRow);
            }
        });
}

templateSearchInput.addEventListener('change', searchTemplates);


let getTemplateId = function() {
    // console.log(templateUseForm.value);
    let target = document.getElementsByClassName('templateUseForm')[0];
    let children = target.childNodes;
    for (let i = 0; i < children.length; i++) {
        if (children[i].checked) {
            return children[i].value;
        }
    }
}
templateUseForm.addEventListener('change', getTemplateId);

let createNewGame = function(){
    let gameName = document.getElementsByClassName('newGameNameValue')[0].value;
    let templateId = getTemplateId();
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