function initializeApp() {
  $(".alert").hide();
  const firebaseConfig = {
    apiKey: "AIzaSyAgD8XTf6Phg5bInu-D1RxW5nNSdjkZANs",
    authDomain: "medinet-827ad.firebaseapp.com",
    databaseURL: "https://medinet-827ad-default-rtdb.firebaseio.com",
    projectId: "medinet-827ad",
    storageBucket: "medinet-827ad.appspot.com",
    messagingSenderId: "52310695996",
    appId: "1:52310695996:web:2d71e891702b1aa0e92339",
    measurementId: "G-56M8KYD721",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // firebase.auth().onAuthStateChanged(user => {
  //   if(user){
  //       window.location.href = "consultas.html";
  //   }
  // })
}

function logIn() {
  mostrarLoading();
  email = $('input[name="email"]').val();
  pass = $('input[name="password"]').val();
  firebase
    .auth()
    .signInWithEmailAndPassword(email, pass)
    .then((response) => {
      window.location.href = "consultas.html";
    })
    .catch((error) => {
      console.log("error", error);
      $(".alert-info").hide();
      $(".alert-danger").text(errorMessage(error.code));
      $(".alert-danger").fadeIn();
      removerLoading();
    });
}

function loginGoogle() {
  mostrarLoading();
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      var user = result.user;
      var isNewUser = result.additionalUserInfo.isNewUser;

      if (isNewUser) {
        const db = firebase.firestore();
        const usersCollection = db.collection('usuarios');
        
        const userData = {
          nome: user.displayName,
          nascimento: "",
          endereco: "",
          sexo: "",
          estadoCivil: "",
          limitacoes: [],
          alergias: "",
          doencas: "",
          cirurgias: "",
          userId: user.uid
        }

        console.log(userData, user.displayName, user.uid);

        // Salva os dados adicionais no documento do usuário
        usersCollection.add(userData).then((dados) => {
          changeCadLogin(false);
          showInfoAlert('Usuario Logado com Sucesso!');
          removerLoading();
          window.location.href = "consultas.html";
        }).catch((error) => {
          removerLoading();
          showDangerAlert(errorMessage(error.code));
        });
        }else{
          window.location.href = "consultas.html";
        }
    })
    .catch((error) => {
      console.log("error", error);
      $(".alert-info").hide();
      $(".alert-danger").text(errorMessage(error.code));
      $(".alert-danger").fadeIn();
      removerLoading();
    });
}

function recoverPass() {
  mostrarLoading();
  email = $('input[name="email"]').val();
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then((response) => {
      showInfoAlert('Email Enviado com Sucesso!');
      removerLoading();
    })
    .catch((error) => {
      console.log("error", error.code);
      showDangerAlert(errorMessage(error.code));
      removerLoading();
    });
}

function cad() {
  if (validateCadastro()) {
    mostrarLoading();
    const nome = $('input[name="cad-nome"]').val();
    //const data = $('input[name="cad-nascimento"]').val();
    //const endereco = $('input[name="cad-endereco"]').val();
    const email = $('input[name="cad-email"]').val();
    const senha = $('input[name="cad-password"]').val();
    const sexo = $('input[name="cad-sexo"]:checked').val();
    //const estado_civil = $('input[name="cad-estado"]:checked').val();
    const limitacoes = $('input[name="cad-limitacoes"]:checked').map(function() {
        return $(this).val();
      }).get();
    const alergia = $('textarea[name="cad-alergia"]').val();
    const doencas = $('textarea[name="cad-doencas"]').val();
    const cirurgia = $('textarea[name="cad-cirurgia"]').val();
    firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
      // Obtém a referência do usuário criado
      const user = userCredential.user;

      // Atualiza o perfil do usuário com o nome
      return user.updateProfile({
        displayName: nome
      });
    })
    .then(() => {
      // Adiciona os dados personalizados no Realtime Database
      const user = firebase.auth().currentUser;
      const db = firebase.firestore();
      const usersCollection = db.collection('usuarios');
      
      const userData = {
        nome: nome,
        nascimento: "",
        endereco: "",
        sexo: sexo,
        estadoCivil: "",
        limitacoes: limitacoes,
        alergias: alergia,
        doencas: doencas,
        cirurgias: cirurgia,
        userId: user.uid
      }

      console.log(userData);

      // Salva os dados adicionais no documento do usuário
      usersCollection.add(userData).then((dados) => {
        changeCadLogin(false);
        showInfoAlert('Usuario Criado com Sucesso!');
        removerLoading();
      }).catch((error) => {
        removerLoading();
        showDangerAlert(errorMessage(error.code));
      });
    })
    .catch((error) => {
        removerLoading();
        showDangerAlert(errorMessage(error.code));
    });
  }
}
