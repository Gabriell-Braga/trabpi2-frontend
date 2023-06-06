function initializeApp() {
    init();
    verify();
}

function cad() {
    if (validateCadastroMedico()) {
        mostrarLoading();
        const nome = $('input[name="cad-nome"]').val();
        const area = $('select[name="cad-area-atuacao"]').val();
        const sexo = $('input[name="cad-sexo"]:checked').val();
        const email = $('input[name="cad-email"]').val();
        const senha = $('input[name="cad-password"]').val();
        const user = firebase.auth().currentUser;
        const db = firebase.firestore();
        const medicosCollection = db.collection('medicos');
        var medicoData;

        firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
        // Obtém a referência do usuário criado
        const user = userCredential.user;
        medicoData = {
            nome: nome,
            sexo: sexo,
            area: area,
            uid: userCredential.user.uid
        }
        // Atualiza o perfil do usuário com o nome
        return user.updateProfile({
            displayName: nome
        });
        }).then(() => {
            // Salva os dados adicionais no documento do medico
            medicosCollection.add(medicoData).then((dados) => {
                showInfoAlert('Usuário Criado com Sucesso!');
                removerLoading();
                firebase.auth().signInWithEmailAndPassword('admin@admin.com', 'admin123');
            }).catch((error) => {
                removerLoading();
                showDangerAlert(errorMessage(error.code));
                firebase.auth().signInWithEmailAndPassword('admin@admin.com', 'admin123');
            });
        })
        .catch((error) => {
            removerLoading();
            showDangerAlert(errorMessage(error.code));
        });
    }
  }