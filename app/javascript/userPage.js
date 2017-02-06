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
let output = document.getElementsByClassName('gamesOverview')[0];

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
    ajaxRequest('getGamesListFromUser', dataObj)
        .then((data) => {
            console.table(data);
            data.forEach(function(element){
                // output.innerHTML += JSON.stringify(element) + "<br>";
                // console.table(element);
                output.appendChild(createGameCollumn(element.id, element.name));
            });
        });
    // return fetchRequest('getUserCharactersheets', dataObj);
};
let playGame = function(id) {
    let requestType = 'getCharacterSheetFromUser'
    ajaxRequest(requestType, id)
        .then((data) => {
            localStorage.setItem('obj', JSON.stringify(data.data));
            playPage()
        });
}
let createGameCollumn = (id, name) => {
    let newElement = document.createElement('div');
    newElement.className = "gameRow";
    
    let col1 = document.createElement('div');
    col1.innerHTML = id;
    col1.className = "gameId";
    
    let col2 = document.createElement('div');
    col2.innerHTML = name;
    col2.className = "gameName";

    let playButton = document.createElement('button');
    playButton.innerHTML = 'Play';
    playButton.type = 'button';
    playButton.addEventListener('click', function() {
        let dataObj = {
            id: id,
        }
        console.log(id);
        playGame(dataObj);
        
    });

    newElement.appendChild(col1);
    newElement.appendChild(col2);
    newElement.appendChild(playButton);

    return newElement;
}



getUserCharactersheets();
// getUserCharactersheets()
//     .then((data) => {
    //     console.log(data);
    // });
