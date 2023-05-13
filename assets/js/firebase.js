function initializeApp(){
    $(".alert").hide();
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
    mostrarLoading();
    email = $('input[name="email"]').val();
    pass = $('input[name="password"]').val();
    firebase.auth().signInWithEmailAndPassword(email, pass).then(response => {
        window.location.href = "consultas.html";
    }).catch(error => {
        console.log('error', error);
        $(".alert-info").hide();
        $(".alert-danger").text(errorMessage(error.code));
        $(".alert-danger").fadeIn();
        removerLoading();
    });
}

function recoverPass(){
    mostrarLoading();
    email = $('input[name="email"]').val();
    firebase.auth().sendPasswordResetEmail(email).then(response => {
        $(".alert-danger").hide();
        $(".alert-info").text('Email Enviado com Sucesso!');
        $(".alert-info").fadeIn();
        removerLoading();
    }).catch(error => {
        console.log('error', error.code);
        $(".alert-info").hide();
        $(".alert-danger").text(errorMessage(error.code));
        $(".alert-danger").fadeIn();
        removerLoading();
    });
    console.log('depois');
}

