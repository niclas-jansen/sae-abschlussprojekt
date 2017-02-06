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
                window.location.pathname = 'app/userPage.html';
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
    // let dataJson = JSON.stringify(data);

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
    // let string = 'test='
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