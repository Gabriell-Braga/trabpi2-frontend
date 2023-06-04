function initializeApp() {
  init();
  verify();
} 

  //FUNÇÃO PARA O MEDICO CONSULTAR



$(document).ready(function() {
  $("#resetar").click(function() {
    $('input[type="text"]').val("");
    $('input[type="radio"]').prop('checked', false);
    $('input[type="checkbox"]').prop('checked', false);
    $('textarea').val("");
  });
});



function exibirProntuarios() {
  const consultasRef = firebase.firestore().collection("usuarios");
  consultasRef.get().then((querySnapshot) => {
    // Limpar o corpo da tabela antes de exibir os dados
    const tabelaConsultas = document.getElementById("tabela-consultas-body");
    tabelaConsultas.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const consulta = doc.data();

      if(consulta.nome && consulta.nome.toLowerCase().includes($("#inputNome").val().toLowerCase())){
        // Criar uma nova linha na tabela para cada consulta
        const novaLinha = document.createElement("tr");

        // Criar células para cada campo da consulta
        const nomeCelula = document.createElement("td");
        const sexoCelula = document.createElement("td");
        const botaoCelula = document.createElement("td");

        // Definir o conteúdo das células com os dados da consulta
        nomeCelula.textContent = consulta.nome.charAt(0).toUpperCase() + consulta.nome.slice(1);
        sexoCelula.textContent = consulta.sexo.charAt(0).toUpperCase() + consulta.sexo.slice(1);
        botaoCelula.innerHTML = '<a href="prontuario.html?uid='+consulta.userId+'" class="btn btn-primary mr-2">Prontuário</a>'+
        '<a href="sinais.html?uid='+consulta.userId+'" class="btn btn-primary">Sinais Vitais</a>';

        // Adicionar as células à linha
        novaLinha.appendChild(nomeCelula);
        novaLinha.appendChild(sexoCelula);
        novaLinha.appendChild(botaoCelula);

        // Adicionar a linha ao corpo da tabela
        tabelaConsultas.appendChild(novaLinha);
      }
    });
  });
  removerLoading();
}


    
  

  
 




 
  