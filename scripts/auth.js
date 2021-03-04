//LISTENS FOR CHANGE OF AUTH STATE AND HANDLES CHANGE ACCORDINGLY WITH REALTIME LISTENER
auth.onAuthStateChanged(user => {
    if (user) {
        setupUI(user);      // display correct links in navbar based on login status

            /*
            In this section of code, we are getting the logs collection and then calling the onSnapshot method.
            This will grab a current snapshot of the state of the database.  This is done every time there is a
            change to the database, but only if the user is logged in.

            Because we are using the onSnapshot method, this will execute every time there is a change to the database.  
            This will be what causes our web app to update in real time.  So IF the user is logged in, and a change is made,
            then the user will see it on the web app.

            The parameter snapshot refers to a current static copy of the database at this exact moment in time.
            docChanges is a method that is called of the snapshot and we are using a for each loop to cycle through
            all the changes for each entry of the log.  If the change was 'added', we need to call renderLog to add a 
            new Student <li> entry to our display.  If the change was 'removed', we need to query that specific <li> tag
            from the DOM and remove it so it is removed from the display.  If you were also allowing the display to update
            in realtime, then you would have another option here for 'modified'.

            The else statement for the top function is what to do if the user is NOT logged in.  In this case
            we want to make sure that the logs do NOT display and that the UI displays the appropriate links to Log in or 
            Sign up
            */
        db.collection('logs').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            // based on change made, either add to display or remove from display
            changes.forEach(change => {
                if (change.type == 'added') {
                    renderLog(change.doc)
                }
                else if (change.type == 'removed') {
                    // finding the li in the DOM of the document that was just removed
                    const idToRemove = 'id' + change.doc.id;
                    let li = logList.querySelector('[data-id=' + idToRemove + ']');
                    // remove this li from the ul
                    logList.removeChild(li);
                }
                // if an entry was updated, the change type is 'modified'
                // if you wanted to listen for changes in the db, you'd need this added it if statement
        })
    });
}
        else {
            setupUI();
            setupLogs([]);
        }
    });

//LOGIN FUNCTIONALITY
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get user info from the form
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // use auth method with the email and password
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // get a reference to the open modal
        const modal = document.querySelector('#modal-login');
        // using the Material library methods, we close the modal
        M.Modal.getInstance(modal).close();
        // call the JS method reset to clear the form
        loginForm.reset(); 
    }).catch(err => {
        console.log(err.message);
        document.getElementById("errorMessageLogin").innerText = err.message;
    });
});

//LOGIN FUNCTIONALITY BUT FOR THE STEAM SIGN IN
const SteamLoginForm = document.querySelector('#steam-login-form');
SteamLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = SteamLoginForm['steam-login-email'].value;
    const password = SteamLoginForm['steam-login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        const modal = document.querySelector('#modal-login-steam');
        M.Modal.getInstance(modal).close();
        SteamLoginForm.reset(); 
    }).catch(err => {
        console.log(err.message);
        document.getElementById("errorMessageLoginSteam").innerText = err.message;
    });
});

//SIGN UP FUNCTIONALITY
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      displayname: signupForm['signup-display-name'].value,
      uidVal: cred.user.uid
    });
  }).then(() => {
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  }).catch(err => {
      console.log(err.message);
      document.getElementById("errorMessageSignUp").innerText = err.message;
  });
});


/*LOG OUT FUNCTIONALITY*/
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});



//ADD OFFER FUNCTIONALITY
const addForm = document.querySelector('#add-form');
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('logs').add({
        offer: addForm['offer'].value,
        request: addForm['request'].value
    }).then(()=> {
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        addForm.reset(); 
    }).catch(err => {
        console.log(err.message);
    })
})


/*SET UP MATERIALIZE COMPONENTS*/
document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  });
