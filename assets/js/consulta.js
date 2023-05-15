function initializeApp() {
    init();
    verify();
    exibirConsultas();
}

function exibirConsultas() {
     const nome =  firebase.auth().currentUser.displayName;
    const consultasRef = firebase.firestore().collection("consultas");
    consultasRef.where("nome", "==", nome).get().then((querySnapshot) => {
      // Limpar o corpo da tabela antes de exibir os dados
      const tabelaConsultas = document.getElementById("tabela-consultas-body");
      tabelaConsultas.innerHTML = "";
  
      querySnapshot.forEach((doc) => {
        const consulta = doc.data();
  
        // Criar uma nova linha na tabela para cada consulta
        const novaLinha = document.createElement("tr");
  
        // Criar células para cada campo da consulta
        const nomeCelula = document.createElement("td");
        const dataCelula = document.createElement("td");
        const medicoCelula = document.createElement("td");
        const sintomasCelula = document.createElement("td");
  
        // Definir o conteúdo das células com os dados da consulta
        nomeCelula.textContent = consulta.nome;
        dataCelula.textContent = consulta.data;
        medicoCelula.textContent = consulta.medico;
        sintomasCelula.textContent = consulta.sintoma;
  
        // Adicionar as células à linha
        novaLinha.appendChild(nomeCelula);
        novaLinha.appendChild(dataCelula);
        novaLinha.appendChild(medicoCelula);
        novaLinha.appendChild(sintomasCelula);
  
        // Adicionar a linha ao corpo da tabela
        tabelaConsultas.appendChild(novaLinha);
      });
    });
  }
  
 