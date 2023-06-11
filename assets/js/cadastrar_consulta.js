function initializeApp() {
  init();
  verify();
  carregarMedicos();
  carregarEspecialidades();
}


function carregarMedicos() {
  const db = firebase.firestore();
  const medicosCollection = db.collection("medicos");
  const selectElement = document.getElementById("medicos-select");

  medicosCollection
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const nomeMedico = doc.data().nome;
        const optionElement = document.createElement("option");
        optionElement.value = doc.data().uid;
        optionElement.textContent = nomeMedico;
        selectElement.appendChild(optionElement);
      });
    })
    .catch((error) => {
      console.log("Erro ao recuperar os médicos:", error);
    });
}

function cadastrarConsulta() {
  mostrarLoading();
  const db = firebase.firestore();
  const nome = firebase.auth().currentUser.displayName;
  const id = firebase.auth().currentUser.uid;

  const dataHora = document.getElementById("diaConsulta").value;
  const sintoma = document.getElementById("sintomas").value;
  const selectElement = document.getElementById("medicos-select");
  const medicoSelecionado = selectElement.value;
  const medicoNome =
    selectElement.options[selectElement.selectedIndex].innerHTML;
  const mensagemSucesso = document.getElementById("mensagemSucesso");

  const consultaData = {
    nome: nome,
    uid: id,
    data: dataHora,
    medico: medicoSelecionado,
    nomeMedico: medicoNome,
    sintoma: sintoma,
  };

  console.log(consultaData);

  // Verificar se a data do formulário é menor que a data atual
  const dataAtual = new Date();
  const dataFormulario = new Date(dataHora);

  if (!dataHora) {
    removerLoading();
    showDangerAlert("A data da consulta não pode ser vazia.");
    return; // Retorna e encerra a execução da função
  }

  if (dataFormulario < dataAtual) {
    removerLoading();
    showDangerAlert("A data da consulta não pode ser anterior à data atual.");
    return; // Retorna e encerra a execução da função
  }


  // Verificar se o médico já possui uma consulta marcada nessa data e horário
  const consultasRef = db.collection("consultas");
  const consultaQuery = consultasRef
    .where("medico", "==", medicoSelecionado)
    .where("data", "==", dataHora);
  console.log(medicoSelecionado);
  consultaQuery
    .get()
    .then((querySnap) => {
      if (!querySnap.empty) {
        // Médico já possui uma consulta marcada nessa data e horário
        removerLoading();
        
        showDangerAlert("Médico nao tem esse horario disponivel!");
      } else {
        // Médico não possui uma consulta marcada nessa data e horário
        // Verificar se o médico tem horas disponíveis
        const medicosRef = db.collection("medicos");
        const medicoQuery = medicosRef.where("uid", "==", medicoSelecionado);

        medicoQuery
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const medicoDoc = querySnapshot.docs[0];
              const medicoData = medicoDoc.data();
              const horasDisponiveis = medicoData.horas;

              if (horasDisponiveis > 0) {
                // Subtrair 1 do campo "horas" do médico
                medicoDoc.ref
                  .update({
                    horas: horasDisponiveis - 1,
                  })
                  .then(() => {
                    console.log("Horas do médico atualizadas com sucesso!");

                    // Cadastrar a consulta
                    const consultasCollection = db.collection("consultas");
                    consultasCollection
                      .add(consultaData)
                      .then(() => {
                        document.querySelector(
                          'input[name="diaConsulta"]'
                        ).value = "";
                        document.getElementById("sintomas").value = "";
                        selectElement.value = "";

                        showInfoAlert("Consulta cadastrada com sucesso!");
                        removerLoading();
                      })
                      .catch((error) => {
                        removerLoading();
                        showDangerAlert(errorMessage(error.code));
                      });
                  })
                  .catch((error) => {
                    removerLoading();
                    showDangerAlert(
                      "Erro ao atualizar as horas do médico: " + error
                    );
                  });
              } else {
                showDangerAlert(
                  "Erro: Médico não possui horas disponíveis para consulta."
                );
                removerLoading();
              }
            } else {
              removerLoading();
              showDangerAlert("Médico não encontrado.");
            }
          })
          .catch((error) => {
            removerLoading();
            showDangerAlert(
              "Erro ao recuperar informações do médico: " + error
            );
          });
      }
    })
    .catch((error) => {
      removerLoading();
      showDangerAlert("Erro ao verificar consulta existente: " + error);
    });
}

function carregarEspecialidades() {
  const db = firebase.firestore();
  const medicosCollection = db.collection("medicos");
  const radioGroupElement = document.getElementById("especialidades-radio");

  medicosCollection
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const especialidadeMedico = doc.data().area;

        // Verifica se a especialidade já foi adicionada ao radio group
        if (!radioGroupElement.querySelector(`input[value="${especialidadeMedico}"]`)) {
          const radioLabel = document.createElement("label");
          radioLabel.classList.add("radio-label");

          const radioInput = document.createElement("input");
          radioInput.type = "radio";
          radioInput.name = "especialidade";
          radioInput.value = especialidadeMedico;
          radioInput.addEventListener("change", filtrarMedicosPorEspecialidade);

          const radioText = document.createTextNode(especialidadeMedico);

          radioLabel.appendChild(radioInput);
          radioLabel.appendChild(radioText);
          radioGroupElement.appendChild(radioLabel);
          

          const lineBreak = document.createElement("br");
          radioGroupElement.appendChild(lineBreak);
        }
      });

      // Marca o primeiro radio button por padrão
      const primeiroRadio = radioGroupElement.querySelector("input[type='radio']");
      primeiroRadio.checked = true;

      // Filtra os médicos com base na especialidade marcada
      filtrarMedicosPorEspecialidade();
    })
    .catch((error) => {
      console.log("Erro ao recuperar as especialidades dos médicos:", error);
    });
}


function filtrarMedicosPorEspecialidade() {
  const especialidadeSelecionada = document.querySelector("input[name='especialidade']:checked").value;
  
  const db = firebase.firestore();
  const medicosCollection = db.collection("medicos");
  const medicosListElement = document.getElementById("medicos-select");
  
  // Limpa a lista de médicos
  while (medicosListElement.firstChild) {
    medicosListElement.firstChild.remove();
  }
  
  medicosCollection
    .where("area", "==", especialidadeSelecionada)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const nomeMedico = doc.data().nome;
        const optionElement = document.createElement("option");
        optionElement.value = doc.data().uid;
        optionElement.textContent = nomeMedico;
        medicosListElement.appendChild(optionElement);
      });
    })
    .catch((error) => {
      console.log("Erro ao filtrar os médicos por especialidade:", error);
    });
}

// Chame a função carregarEspecialidades() no seu onload para carregar as especialidades ao carregar a página.
