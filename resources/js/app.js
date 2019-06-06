// Initialize Firebase
var config = {
    apiKey: "AIzaSyDY0ap1bIDwwvSRsvusGOtH1ow7F6AqPyU",
    authDomain: "hiawesomehumans.firebaseapp.com",
    databaseURL: "https://hiawesomehumans.firebaseio.com",
    projectId: "hiawesomehumans",
    messagingSenderId: "501987551176",
    name: "Hi Humans!"
  };
  firebase.initializeApp(config);
  
  const auth = firebase.auth();
  const db = firebase.database();
  var uid;
  
  
  
  // ++++ Create New Profile Modal Logic ++++ //
  
  // Get the modal
  var $createProfModal = $('#signUpModal');
  
  // Get the button that opens the modal
  var $newAcctBtn = $("#newAccountOpenModal");
  
  // Get the span element that closes the modal
  var $closeCreate = $("#closeCreate");
  
  // When the user clicks the button, open the modal 
  
  $newAcctBtn.on('click', function () {
    $createProfModal.css('display', 'block')
    console.log(this)
  });
  
  // When the user clicks the "create account" button, create the account
  $("#newAccount").click(function () {
    signUp(event);
  });
  
  // When the user clicks "next" button, open "choose mask"
  // $('#nextBut').click(function () {
  //   window.location.href = 'chooseAMask.html';
  // });
  
  // //When the user clicks "next" button, open "choose traits"
  // $('#userAccount').click(function () {
  //   // window.location.href = '';
  // });
  
  //When the user clicks "sign in" button, open "user profile"
  $('#userAccount').click(function () {
    signIn(event);
  });
  
  // When the user clicks on <span> (x), close the modal
  $closeCreate.on('click', function () {
    $createProfModal.css('display', 'none')
  });
  
  
  // ++++ Sign-In Modal Logic ++++ //
  
  // Get the modal
  var $signInModal = $('#signInModal');
  
  // Get the button that opens the modal
  var $signInBtn = $("#signIn");
  
  // Get the span element that closes the modal
  var $closeSignIn = $("#closeSignIn");
  
  // When the user clicks the button, open the modal 
  $signInBtn.on('click', function () {
    $signInModal.css('display', 'block')
  });
  
  // When the user clicks on <span> (x), close the modal
  $closeSignIn.on('click', function () {
    $signInModal.css('display', 'none')
    console.log(this)
  });
  
  
  
  
  
  
  
  // ** ACCOUNT LOGIC **
  
  
  //sign in functionality. Firebase docs provides this. 
  const signIn = (event) => {
    let usrEmail = $("#userSignIn").val().trim();
    let usrPassword = $("#user_password").val().trim();
    event.preventDefault();
    firebase.auth().signInWithEmailAndPassword(usrEmail, usrPassword).then(
      checkLogin(),
      window.location.replace(`userProfile.html?${uid}`)
    ).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode = "") {
        //show a div with the error for the appropriate code here.
      } else {
        //show a div with a generic error message here
        console.log(errorCode, errorMessage);
      }
    });
  
  }
  
  
  //event listener to check for log in and do various things
  const checkLogin = () => {
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log("logged in", window.location)
        uid = auth.currentUser.uid;
        // db.ref(`users/${uid}`).once("value", function(data) {
        //   console.log(data.child("username"));
        //   usrname = data.child("username");}).then()
        (console.log(uid))
  
  
  
      } else {
        //if the user isn't logged in, kick them to the login page. 
        if (window.location.assign.pathname = "index.html") {
  
          console.log("on index and not authed!", window.location);
        } else {
          console.log("not authed!", window.location);
          window.location.replace("index.html");
  
        }
  
      }
    });
  
  }
  
  
  //create a new account when the newAccount button is clicked. 
  const signUp = (event) => {
    event.preventDefault();
    //Capture all the data. Doing it this way because I try to avoid too many global variables.
    let email = $("#email").val().trim();
    let username = $("#user_name").val().trim();
    let pass = $("#userPassword").val().trim();
    let passVal = $("#re-type_password").val().trim();
    console.log(email, username, pass, passVal);
    //verify that the passwords match -- this is disabled for the moment because it's throwing a 400 instead.
    // if (pass === passVal) {
    //if matching, then run the auth function with the variables above as parameters. 
    auth.createUserWithEmailAndPassword(email, pass).then(function (data) {
  
      try {
        db.ref('users').child(data.user.uid).set({
          email: data.user.email,
          key: data.user.uid,
          username: username,
          isAdmin: false,
          mask: "",
          icons: [],
          reasons: [],
          testsTaken: [],
          noTestsTaken: 0
        })
        console.log("user created");
  
      } catch (error) {
        console.log(`Error creating database entry for user! --> ${error}`);
      }
    }).then(function () {
      checkLogin();
      window.location.replace('chooseAMask.html');
    }).catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage);
      if (errorCode == 'auth/email-already-in-use') {
        //show a div with an error message here about the account already existing.
      } else {
        //show a div with a generic error message here
      }
    })
    console.log("user created");
  }
  
  
  
  
  //CHOOSE A MASK Functionality // 
  
  const chooseMask = function () {
    console.log($(this));
    let myMask = $(this).attr("data-mask");
    let maskImg = $(this).attr("src");
    try {
      db.ref(`users/${uid}`).update({
        mask: myMask,
        maskImg: maskImg
      })
      console.log("mask saved")
    } catch (error) {
      console.log("there was a problem saving the mask")
    }
  }
  
  
  // CHOOSE ICON PAGE FUNCTIONALITY 
  //this is set outside of the function so it doesn't get reset whenever you click.
  let traitNo = 0;
  
  //allows you to select up to 3 icons
  const selectMulti = function () {
    let trait = $(this);
    if (!trait.is(".selected")) {
      trait.addClass("selected");
      trait.attr("data-val", traitNo);
      if (traitNo < 3) {
        traitNo++;
        console.log(traitNo);
      } else {
        let drop = $(`[data-val=0]`);
        console.log(drop);
        drop.removeClass("selected");
        trait.attr("data-val", 0).addClass("selected");
        // so, I am aware this is stupid, and the right way to do it is to figure out the lowest one, drop that, and swap the data values so that the most recently added is the highest and the oldest one is the lowest, or something of that kind. But the main thing is limiting the selected items to 3, and that's good, so I'll not spend time on making this neater; I'll just note that's something to fix in future.
        console.log(traitNo);
      }
    } else {
      trait.removeClass('selected');
      trait.attr("data-val", "");
      traitNo--;
    }
  }
  
  //actually saves the icons in the database when the next button is clicked, then moves to the next page. 
  const chooseIcons = function () {
    let icon1 = $(`[data-val=0]`).attr("src");
    let icon2 = $(`[data-val=1]`).attr("src");
    let icon3 = $(`[data-val=2]`).attr("src");
    console.log(icon1, icon2, icon3);
    try {
      db.ref(`users/${uid}/icons`).update({
        icon1: icon1,
        icon2: icon2,
        icon3: icon3
      }).then(
        window.location.replace('ChooseReasons.html'),
        console.log("icons saved")
      )
  
    } catch (error) {
      console.log("there was a problem saving the icons")
    }
  
  }
  
  //SELECT REASONS PAGE FUNCTIONALITY
  
  const chooseReasons = function () {
    console.log($(this));
    let myReason = $(this).attr("id");
    try {
      db.ref(`users/${uid}`).update({
        reason: myReason
      }).then(
        console.log("reason saved"),
        window.location.replace(`userProfile.html?${uid}`),
      )
  
    } catch (error) {
      console.log("there was a problem saving the reason")
    }
  }
  
  // PROFILE PAGE FUNCTIONALITY 
  
  
  
  
  
  // admin page functionality
  
  
  //this function takes a userid from the database and gives them the admin role
  // const setAdmin = (uid) => {
  //   db.ref("users").on("child_added", function(childSnapshot) {
  //     role: admin
  //   })
  //     .then(function (UserInfo) {
  //       // See the UserInfoUserInfo reference doc for the contents of UserInfo.
  //       console.log('Successfully updated user', UserInfo.toJSON());
  //     })
  //     .catch(function (error) {
  //       console.log('Error updating user:', error);
  //     });
  // }
  
  //on clicking the make admin button on the admin page
  // $("#make-admin").on("click", function (event) {
  //   event.preventDefault();
  //   let usrEmail = $("#adminEmail").val().trim();
  //   //need to figure out how to identify the specific user, which is haaaard in realtime without using, like, node. 
  //   db.ref(`users/email`).on()
  //   firebase.user
  //     .then(function (UserInfo) {
  //       // See the UserInfoUserInfo reference doc for the contents of UserInfo.
  //       console.log('Successfully fetched user data:', UserInfo.toJSON());
  //       let uid = UserInfo.uid;
  //       setAdmin(uid);
  //     })
  //     .catch(function (error) {
  //       console.log('Error fetching user data:', error);
  //     });
  // })
  // function toggleRegisterState() {
  //     $('.toggle span').toggleClass('toggled');
  
  //     if (is_register) {
  //       $('form h3').text('Sign Up');
  //       $('form #confirm').show();
  //     } else {
  //       $('form h3').text('Log In');
  //       $('form #confirm').hide();
  //     }
  
  //     is_register = !is_register;
  //   }
  
  // function checkAuthState() {
  //     auth.onAuthStateChanged(function (user) {
  //       if (user) {
  //         uid = auth.currentUser.uid;
  
  //         showAuthView(true, user.email);
  
  //         db.ref('/users/' + user.uid).once('value', function (ref) {
  //           console.log(ref.val());
  //         })
  //       } else {
  //         showAuthView(false, null);
  //       }
  //     });
  //   }
  
  
  function logUserOut() {
    auth.signOut().then(function () {
      // showAuthView(false, null);
      checkLogin();
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  }
  
  function init() {
    $('#topCreateLink').on('click', function() {$createProfModal.css('display', 'block')});
    $('#topSignInLink').on('click', function() {$signInModal.css('display', 'block') });
    $('#logOut').on('click', logUserOut);
    $('.mask').on('click', chooseMask);
    $('.icon').on('click', selectMulti);
    $('#traitBtn').on('click', chooseIcons);
    // $('.reason').on('click', selectMulti); -- if this becomes a multi select in future.
    $('.reason').on('click', chooseReasons);
    checkLogin();
  }
  
  // Start The App
  init();
  
  
  