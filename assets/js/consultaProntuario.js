


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
  } 

  //FUNÇÃO PARA O MEDICO CONSULTAR
$(document).ready(function () {
  $("#btnSLA").click(function () {

      // código a ser executado quando o botão for clicado
      const db = firebase.firestore();
      db.collection('usuarios').get()
          .then(snapshot => {
              snapshot.docs.forEach(doc => {
                  if (doc.data().nome == $("#inputNome").val()) {
                      var dados = doc.data();
                      $('input[name="cad-nome"]').val($("#inputNome").val());
                      if (dados.sexo == 'masculino') {
                          $('#masculino').prop('checked', true);
                      } else if (dados.sexo == 'feminino') {
                          $('#feminino').prop('checked', true);
                      }

                      if (dados.limitacoes == 'cognitiva') {
                          $('#cognitiva').prop('checked', true);
                      }


                      if (dados.limitacoes == 'locomocao') {
                          $('#locomocao').prop('checked', true);
                      }
                      
                      if (dados.limitacoes == 'audicao') {
                          $('#audicao').prop('checked', true);
                      }    

                      if (dados.limitacoes == 'Nenhum') {
                          $('#Nenhum').prop('checked', true);
                      }    


                      $('textarea[name="cad-alergia"]').val(dados.alergia);
                  }
              });
          });
  })
}

)


$(document).ready(function() {
  $("#resetar").click(function() {
    $('input[type="text"]').val("");
    $('input[type="radio"]').prop('checked', false);
    $('input[type="checkbox"]').prop('checked', false);
    $('textarea').val("");
  });
});
    
  

  
 




 
  