function initializeApp() {
    init();
    verify();
    carregarMedicos();
}

function carregarMedicos(){

    const db = firebase.firestore();
    const medicosCollection = db.collection('medicos');
    const selectElement = document.getElementById('medicos-select');
    
    medicosCollection.get().then((querySnapshot) => {

      querySnapshot.forEach((doc) => {
       const nomeMedico = doc.data().nome;
        const optionElement = document.createElement('option');
        optionElement.value = nomeMedico;
        optionElement.textContent = nomeMedico;
        selectElement.appendChild(optionElement);
      });
    }).catch((error) => {
      console.log('Erro ao recuperar os médicos:', error);
    });
    
}



function cadastrarConsulta() {
    event.preventDefault();
    const db = firebase.firestore();
    const nome = firebase.auth().currentUser.displayName;
  
    const dataHora = document.getElementById('diaConsulta').value;
    const sintoma = document.getElementById('sintomas').value;
    const selectElement = document.getElementById('medicos-select');
    const medicoSelecionado = selectElement.value;
    const mensagemSucesso = document.getElementById('mensagemSucesso');
  
    const consultaData = {
      nome: nome,
      data: dataHora,
      medico: medicoSelecionado,
      sintoma: sintoma
    };
  
    console.log(consultaData);
  
    // Verificar se o médico já possui uma consulta marcada nessa data e horário
    const consultasRef = db.collection('consultas');
    const consultaQuery = consultasRef
      .where('medico', '==', medicoSelecionado)
      .where('data', '==', dataHora);
  
    consultaQuery
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Médico já possui uma consulta marcada nessa data e horário
          removerLoading();
          mensagemSucesso.textContent = 'Médico nao tem esse horario disponivel!';
        } else {
          // Médico não possui uma consulta marcada nessa data e horário
          // Verificar se o médico tem horas disponíveis
          const medicosRef = db.collection('medicos');
          const medicoQuery = medicosRef.where('nome', '==', medicoSelecionado);
  
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
                      horas: horasDisponiveis - 1
                    })
                    .then(() => {
                      console.log('Horas do médico atualizadas com sucesso!');
  
                      // Cadastrar a consulta
                      const consultasCollection = db.collection('consultas');
                      consultasCollection
                        .add(consultaData)
                        .then(() => {
                          document.querySelector('input[name="diaConsulta"]').value = '';
                          document.getElementById('sintomas').value = '';
                          selectElement.value = '';
                         
  
                          mensagemSucesso.textContent = 'Consulta cadastrada com sucesso!';
                          removerLoading();
                        })
                        .catch((error) => {
                          removerLoading();
                          showDangerAlert(errorMessage(error.code));
                        });
                    })
                    .catch((error) => {
                      removerLoading();
                      showDangerAlert('Erro ao atualizar as horas do médico: ' + error);
                    });
                } else {
                  const mensagemSucesso = document.getElementById('mensagemSucesso');
                  mensagemSucesso.textContent = 'Erro: Médico não possui horas disponíveis para consulta.';
                  removerLoading();
                }
              } else {
                removerLoading();
                showDangerAlert('Médico não encontrado.');
              }
            })
            .catch((error) => {
              removerLoading();
              showDangerAlert('Erro ao recuperar informações do médico: ' + error);
            });
        }
      })
      .catch((error) => {
        removerLoading();
        showDangerAlert('Erro ao verificar consulta existente: ' + error);
      });
  }
  
  