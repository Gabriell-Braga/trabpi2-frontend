function initializeApp() {
    mostrarLoading();
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
  
    firebase.auth().onAuthStateChanged(user => {
      if(!user){
          window.location.href = "index.html";
      }else{
        const displayName = user.displayName;
        const customData = user.customData;

        $('#usuario').text(displayName);

        console.log('user', user)
        console.log('Nome do usuário:', displayName);
        console.log('Dados personalizados:', customData);
        removerLoading();
      }
    });    
}
function logout(){
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
    });
}