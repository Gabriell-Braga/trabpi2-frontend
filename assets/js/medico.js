function initializeApp() {
    init();
    
    const db = firebase.firestore();
    db.collection('usuarios').get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                if (doc.data().userId == firebase.auth().currentUser.uid) {
                    var dados = doc.data();
                    console.log(dados);
                    if(dados.admin && dados.admin == 1){
                        $('#sidebar-add').append('<a class="list-group-item list-group-item-action list-group-item-light p-3 active" href="cadastrar_medico.html">Cadastrar Médico</a>');
                        removerLoading();
                    }else{
                        window.location.href = "consultas.html";
                    }
                }
            });
    })
    .catch((error) => {
        console.log('error', error);
        removerLoading();
    });
}

function cad() {
    if (validateCadastroMedico()) {
        mostrarLoading();
        const nome = $('input[name="cad-nome"]').val();
        const crm = $('input[name="cad-crm"]').val();
        const area = $('select[name="cad-area-atuacao"]').val();
        const sexo = $('input[name="cad-sexo"]:checked').val();
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();
        const medicosCollection = db.collection('medicos');
        
        const medicoData = {
            nome: nome,
            crm: crm,
            sexo: sexo,
            area: area
        }

        // Salva os dados adicionais no documento do medico
        medicosCollection.add(medicoData).then((dados) => {
            showInfoAlert('Usuario Criado com Sucesso!');
            removerLoading();
        }).catch((error) => {
            removerLoading();
            showDangerAlert(errorMessage(error.code));
        });
    }
  }