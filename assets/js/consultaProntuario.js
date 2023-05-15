


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

  // $('#btn_consulta').addEventListener("click",()=>{
  //   console.log($("#inputNome").val());
  //   // Obter os dados personalizados do Realtime Database
  //   const db = firebase.firestore();
  //   db.collection('usuarios').get()
  //       .then(snapshot => {
  //           snapshot.docs.forEach(doc => {
  //               if (doc.data().nome == $("#inputNome").val()) {
  //                   var dados = doc.data();
  //                   $('input[name="cad-nome"]').val($("#inputNome").val());
  //                   if(dados.sexo == 'masculino'){
  //                       $('#masculino').prop('checked', true);
  //                   }else if(dados.sexo == 'feminino'){
  //                       $('#feminino').prop('checked', true);
  //                   }
  //                   $('textarea[name="cad-alergia"]').val(dados.alergia);
  //               }else{
  //                console.log("else")
  //               }
  //           });
  //         });
  //    })
  } 

  // $('#btn_consulta').click(function(){
  //   console.log("ola")
  // })

  $(document).ready(function(){
    $("#btn_consultar").click(function(){
      // código a ser executado quando o botão for clicado
      console.log("ola")
    });
  });
    
  

  
 




 
  