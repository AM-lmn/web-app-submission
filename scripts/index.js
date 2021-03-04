/*
    The original web app was created by Mrs. Denna in January 2021 and further worked on by Ajay Malik from February-March 2021.
    The below Youtube playlists guided much of the code:

    Firebase firestore: https://youtube.com/playlist?list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB
    Firebase auth: https://youtube.com/playlist?list=PL4cUxeGkcC9jUPIes_B8vRjn1_GaplOPQ
*/

const logList = document.querySelector('.logs');
const loggedOutLinks = document.querySelectorAll('.logged-out'); // need All bc there are > 1
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const bots = document.querySelector('.bot-trades');
var nameOfUser;


//SET UP UI
const setupUI = (user) => {
  if (user) {
    //displays info from clicking on "Account Details"
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>You are logged in as ${user.email}</div>
        <div>Your display name is ${doc.data().displayname}</div>
      `;
      accountDetails.innerHTML = html;
    });
    //displays info from clicking on "Bot Trades"
    const htmlTwo = `
      <div>Our Steam bot accounts are currently not up yet! Please check back later.</div>
    `;
    bots.innerHTML = htmlTwo;
    // toggle UI elements with a forEach loop that will change the display to show or hide them
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');

  }
  else {
    //the line below hides the account details of the user
    accountDetails.innerHTML = '';
    //the 2 lines below will hide all of the content that a logged-in user would see, and show all the content that a logged-out user would see
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
}


//GENERATE ONE ROW OF LOG DATA

const form = document.querySelector('#create-form');

function renderLog(doc) {
    let li = document.createElement('li');
    let creator = document.createElement('span');
    let offer = document.createElement('span');
    let request = document.createElement('span');
    let deleteX = document.createElement('span');
     
    const idVal = 'id' + doc.id;
    li.setAttribute('data-id', idVal);

    var uid = firebase.auth().currentUser.uid;
    db.collection('users').where("uidVal", "==", uid).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        nameOfUser = doc.data(uid).displayname;
      })
    }).then(() => {
      console.log(nameOfUser + " test");
      creator.textContent = 'Creator: ' + nameOfUser; //accesses the "users" collection of the database, now needs to get the displayname of the current user
    offer.textContent = 'Offering: ' + doc.data().offer;
    request.textContent = 'Wants in return: ' + doc.data().request;
    deleteX.textContent = 'Delete offer';

    // set the class for the styles to apply to the HTML tag
    deleteX.classList = 'deleteX';
    offer.classList = 'logLI';
    request.classList = 'logLI';
    creator.classList = 'logLI';

    li.appendChild(creator);
    li.appendChild(offer);
    li.appendChild(request);
    li.appendChild(deleteX);      
    logList.appendChild(li);

    // Add listener for the delete option
    deleteX.addEventListener('click', (e) => {
      e.stopPropagation();
      var id = e.target.parentElement.getAttribute('data-id');  
      id = id.substring(2);
      db.collection('logs').doc(id).delete();
    })
    })
    };

     const getDisplayName = (uid) => {
      db.collection('users').where("uidVal", "==", uid).get().then((snapshot) => { 
        snapshot.forEach((doc) => {
          return doc.data(uid).displayname;
          //console.log(value);
        }
        )
        //return doc.data(uid).displayname;
        //{ displayname: doc.data(uidVal).displayname }
      })
    }
    
  const setupLogs = (data) => {
  
    if (data.length) {
     }
  
    else {
      logList.innerHTML = '<h5 class = "right-align"></h5>';
    }
  }
   
//SET UP MATERIALIZE COMPONENTS
document.addEventListener('DOMContentLoaded', function() {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});