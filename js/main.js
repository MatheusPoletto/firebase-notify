{

/* ========================
  Variables
======================== */

const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();

const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const subscribeButton = document.getElementById('subscribe');

/* ========================
  Event Listeners
======================== */

signInButton.addEventListener('click', signIn);
signOutButton.addEventListener('click', signOut);
subscribeButton.addEventListener('click', subscribeToNotifications);

FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);

/* ========================
  Functions
======================== */

function signIn(){
  FIREBASE_AUTH.signInWithPopup( new firebase.auth.GoogleAuthProvider());
}

function signOut(){
  FIREBASE_AUTH.signOut();
  signOutButton.setAttribute("hidden", "true")
  signInButton.removeAttribute("hidden");
}

function handleAuthStateChanged(user){
  if(user){
    console.log(user);
    console.log('uid: ' + user.uid);
    signInButton.setAttribute("hidden", "true")
    signOutButton.removeAttribute("hidden");
  }else{
    signOutButton.setAttribute("hidden", "true")
    signInButton.removeAttribute("hidden");
  }
}

function subscribeToNotifications() {
  //Solicita permissão
  Notification.requestPermission()
    .then((permission) => {
      //Se conseguiu permissão
      if (permission === 'granted') {
        //Pega o token
        FIREBASE_MESSAGING.getToken().then((currentToken) => {       
          //Envia para o DB do Firebase o Token e o uid do usuário logado
          FIREBASE_DATABASE.ref('/tokens').push({
            token: currentToken,
            uid: FIREBASE_AUTH.currentUser.uid
          });
          console.log("subscribe");
        
        }).catch((err) => {
          console.log('Erro ao recuperar o token - Erro: ' + err);
        });
      } else {
        console.log('Não conseguiu permissão de notificação.');
      }
    }).catch((err) => {
      console.log('Erro ao requisitar permissão - Erro: ' + err);
    });
}

}