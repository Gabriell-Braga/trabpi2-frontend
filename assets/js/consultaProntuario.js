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
  consultasRef.where("nome", "==", $("#inputNome").val()).get().then((querySnapshot) => {
    // Limpar o corpo da tabela antes de exibir os dados
    const tabelaConsultas = document.getElementById("tabela-consultas-body");
    tabelaConsultas.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const consulta = doc.data();

      // Criar uma nova linha na tabela para cada consulta
      const novaLinha = document.createElement("tr");

      // Criar células para cada campo da consulta
      const nomeCelula = document.createElement("td");
      const sexoCelula = document.createElement("td");
      const limitacoesCelula = document.createElement("td");
      const alergiaCelula = document.createElement("td");

      // Definir o conteúdo das células com os dados da consulta
      nomeCelula.textContent = consulta.nome;
      sexoCelula.textContent = consulta.sexo;
      limitacoesCelula.textContent = consulta.limitacoes;
      alergiaCelula.textContent = consulta.alergia;

      // Adicionar as células à linha
      novaLinha.appendChild(nomeCelula);
      novaLinha.appendChild(sexoCelula);
      novaLinha.appendChild(limitacoesCelula);
      novaLinha.appendChild(alergiaCelula);

      // Adicionar a linha ao corpo da tabela
      tabelaConsultas.appendChild(novaLinha);
    });
  });
  removerLoading();
}


    
  

  
 




 
  