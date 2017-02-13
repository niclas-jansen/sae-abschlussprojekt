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
    
    addUserInterface = createResultRowCol('div', 'addUserInterface', false, gameEditRow);
    userTypeSelector = createResultRowCol('div', 'userTypeSelector', false, addUserInterface);
    userTypeTag = createResultRowCol('div', 'userTypeTag', 'Add User As', userTypeSelector);
    userTypePlayer = createResultRowCol('div', 'userTypePlayer', 'Player', userTypeSelector);
    userTypeGameMaster = createResultRowCol('div', 'userTypeGameMaster', 'GameMaster', userTypeSelector);
    searchFriendsInterface = createResultRowCol('div', 'searchFriendsInterface', false, addUserInterface);
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
    // for (let i = 0; i < searchResultColumns.length; i++) {
    //     while (searchResultColumns[i].childNodes[2]) {
    //         searchResultColumns[i].removeChild(searchResultColumns[i].childNodes[2]);
    //     }
    // }
    while (templateSearchResult.firstChild) {
        templateSearchResult.removeChild(templateSearchResult.firstChild);
    }
    ajaxRequest('searchTemplates', searchValue)
        .then((data) => {
            // console.log(data.templates[2]);
            // console.log(data.templates.length);
            for (let i = 0; i < data.templates.length; i++){
                // console.log(data.templates[i]);
                // let templateRow = document.createElement('div');
                // templateRow.className = 'templateRow';


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
                // createResultRowCol('div', 'templateName', data.templates[i].name, templateNameColumn);

                // createResultRowCol('div', "templateAuthor", data.templates[i].author, templateAuthorColumn)

                // createResultRowCol('div', 'templateCreated', 
                //     (new Date(Number(data.templates[i].creationDate.$date.$numberLong))).toLocaleDateString('de-DE'), 
                //     templateCreatedColumn
                // );

                // createResultRowCol('div', 'templateLastEdit',
                //     (new Date(Number(data.templates[i].lastEdit.$date.$numberLong))).toLocaleDateString('de-DE'),
                //     templateLastEditColumn
                // );
                // let templateLastEdit = document.createElement('div');
  
                // createResultRowCol('div', 'templateDescription', data.templates[i].description, templateDescriptionColumn);

                // createResultRowCol('input', 'radio', false, templateUseForm, 'templateId', 'radio', data.templates[i]['_id']['$oid'])





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


// testFunc();