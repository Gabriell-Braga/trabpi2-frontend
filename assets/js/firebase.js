function initializeApp(){
    const firebaseConfig = {
        apiKey: "AIzaSyAgD8XTf6Phg5bInu-D1RxW5nNSdjkZANs",
        authDomain: "medinet-827ad.firebaseapp.com",
        databaseURL: "https://medinet-827ad-default-rtdb.firebaseio.com",
        projectId: "medinet-827ad",
        storageBucket: "medinet-827ad.appspot.com",
        messagingSenderId: "52310695996",
        appId: "1:52310695996:web:2d71e891702b1aa0e92339",
        measurementId: "G-56M8KYD721"
      };
    
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
}

function logIn(){
    email = $('input[name="email"]').val();
    pass = $('input[name="pass"]').val();
    console.log('antes');
    firebase.auth().signInWithEmailAndPassword(email, pass).then(response => {
      window.location.href = "consultas.html";
    }).catch(error => {
      console.log('error', error);
    });
    console.log('depois');
}

