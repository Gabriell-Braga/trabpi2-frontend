function initializeApp() {
    init();
    verify();
    carregarDados();
    mostrarLoading();
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        const displayName = user.displayName;
        exibirConsultas(displayName);
        exibirConsultasModal(displayName);
      }
    });
}

function carregarDados(){
  fetch(`https://covid19-brazil-api.vercel.app/api/report/v1/brazil`)
      .then(response => response.json())
      .then(data => {
        var formattedDate = moment(data.data.updated_at).format('DD/MM/YYYY HH:mm');
        document.getElementById('cases').textContent = data.data.confirmed !== null ? data.data.confirmed.toLocaleString('pt-BR') : 'N/A';
        document.getElementById('deaths').textContent = data.data.deaths !== null ? data.data.deaths.toLocaleString('pt-BR') : 'N/A';
        document.getElementById('lastUpdate').textContent = formattedDate ;
      })
      .catch(error => {
        console.log(error);
      });
}

function exibirConsultas(nome) {
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
      const cancelarCelula = document.createElement("td"); // Célula para o botão de cancelamento

      // Definir o conteúdo das células com os dados da consulta
      nomeCelula.textContent = consulta.nome;
      dataCelula.textContent = consulta.data;
      medicoCelula.textContent = consulta.nomeMedico;
      sintomasCelula.textContent = consulta.sintoma;

      // Criar o botão de cancelamento
      const cancelarBotao = document.createElement("button");
      cancelarBotao.textContent = "Cancelar";
      cancelarBotao.setAttribute("data-consulta-id", doc.id); 
      cancelarBotao.classList.add("btn", "btn-danger");
      // Defina um atributo personalizado para armazenar o ID da consulta

      // Adicionar evento de clique ao botão de cancelamento
      cancelarBotao.addEventListener("click", () => {
        const consultaId = cancelarBotao.getAttribute("data-consulta-id");
        cancelarConsulta(consultaId); // Chame a função para deletar a consulta, passando o ID como parâmetro
        
      });

      // Adicionar o botão de cancelamento à célula
      cancelarCelula.appendChild(cancelarBotao);

      // Adicionar as células à linha
      novaLinha.appendChild(nomeCelula);
      novaLinha.appendChild(dataCelula);
      novaLinha.appendChild(medicoCelula);
      novaLinha.appendChild(sintomasCelula);
      novaLinha.appendChild(cancelarCelula); // Adicionar a célula de cancelamento à linha

      // Adicionar a linha ao corpo da tabela
      tabelaConsultas.appendChild(novaLinha);
    });
  });
  removerLoading();
}

function cancelarConsulta(consultaId) {
  const consultasRef = firebase.firestore().collection("consultas");


  consultasRef
    .doc(consultaId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const consulta = doc.data();
        const medico = consulta.medico;

        // Recuperar o médico pelo nome
        const medicosRef = firebase.firestore().collection("medicos");
        const query = medicosRef.where("uid", "==", medico);

        query.get().then((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const medicoDoc = doc.ref;

              // Atualizar o campo "horas" do médico com uma hora a mais
              medicoDoc
                .update({
                  horas: firebase.firestore.FieldValue.increment(1), // Incrementar em 1 a quantidade de horas
                })
                .then(() => {
                  console.log("Horas do médico atualizadas com sucesso!");
                  
                  // Deletar a consulta usando o ID fornecido
                  consultasRef
                    .doc(consultaId)
                    .delete()
                    .then(() => {
                      console.log("Consulta cancelada com sucesso!");
                      location.reload(); // Recarregar a página
                    })
                    .catch((error) => {
                      console.error("Erro ao cancelar consulta:", error);
                    });
                })
                .catch((error) => {
                  console.error("Erro ao atualizar as horas do médico:", error);
                });
            });
          } else {
            console.error("Médico não encontrado");
          }
        }).catch((error) => {
          console.error("Erro ao recuperar o médico:", error);
        });
      } else {
        console.error("Consulta não encontrada");
      }
    })
    .catch((error) => {
      console.error("Erro ao recuperar a consulta:", error);
    });
}

function exibirConsultasModal(nome) {
  const consultasRef = firebase.firestore().collection("consultas");
  consultasRef.where("nome", "==", nome).get().then((querySnapshot) => {
    const selectConsultas = document.getElementById("select-consultas"); // Elemento select para exibir as consultas

    // Limpar o select antes de adicionar as opções
    selectConsultas.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const consulta = doc.data();

      // Criar uma nova opção para cada consulta
      const novaOpcao = document.createElement("option");

      // Definir o valor e o texto da opção com os dados da consulta
      novaOpcao.value = doc.id;
      novaOpcao.textContent = consulta.nomeMedico + " - " + consulta.data;

      // Adicionar a opção ao select
      selectConsultas.appendChild(novaOpcao);
    });
  });
}




// Adicionar um ouvinte de evento para o botão de remarcar



function btnremarcar(){


  const selectConsultas = document.getElementById("select-consultas");
  const calendario = document.getElementById("calendario");
  const inputDataConsulta = document.getElementById("data-consulta");
  const consultaId = selectConsultas.value;
  const novaData = inputDataConsulta.value;

  const dataAtual = new Date();
  const dataFormulario = new Date(novaData);

  if (dataFormulario < dataAtual) {
    removerLoading();
    showDangerAlert("A data da consulta não pode ser anterior à data atual.");
    return; // Retorna e encerra a execução da função
  }

  
  if (!novaData) {
    removerLoading();
    showDangerAlert("A data da consulta não pode ser vazia.");
    return; // Retorna e encerra a execução da função
  }


  remarcarConsulta(consultaId, novaData);
}


function remarcarConsulta(consultaId, novaData) {
  mostrarLoading();
  const consultasRef = firebase.firestore().collection("consultas");

  console.log(consultaId)
  console.log(novaData)
  consultasRef.doc(consultaId).update({
    data: novaData
  }).then(() => {
    console.log("Consulta remarcada com sucesso!");
    showInfoAlert("Consulta remarcada");
  }).catch((error) => {
    console.error("Erro ao remarcar a consulta:", error);
    showDamageAlert("Erro ao remarcar");
  });

  removerLoading();
}

