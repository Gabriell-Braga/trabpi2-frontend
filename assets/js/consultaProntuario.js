function initializeApp() {
  init();
  verify();
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
    
  

  
 




 
  