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



function cadastrarConsulta(){

    event.preventDefault();
    const db = firebase.firestore();
    const nome = firebase.auth().currentUser.displayName;
    
    
    const data = $('input[name="diaConsulta"]').val();
    const sintoma = document.getElementById('sintomas').value;
    const selectElement = document.getElementById('medicos-select');
    const medicoSelecionado = selectElement.value;

    const consultaData = {
        nome: nome,
        data: data,
        medico : medicoSelecionado,
        sintoma: sintoma
    }

    console.log(consultaData);
    const consultasCollection = db.collection('consultas');
    consultasCollection.add(consultaData).then((dados) => {
        document.querySelector('input[name="diaConsulta"]').value = '';
        document.getElementById('sintomas').value = '';
        selectElement.value = '';
        const mensagemSucesso = document.getElementById('mensagemSucesso');

        mensagemSucesso.textContent = 'Consulta cadastrada com sucesso!';
        removerLoading();
    }).catch((error) => {
        removerLoading();
        showDangerAlert(errorMessage(error.code));
    });
    
}