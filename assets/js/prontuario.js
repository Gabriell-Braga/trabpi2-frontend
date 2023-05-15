function initializeApp() {
    init();
    verify();
    const db = firebase.firestore();
        db.collection('usuarios').get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    if (doc.data().userId == firebase.auth().currentUser.uid) {
                        var dados = doc.data();
                        console.log(dados);
                        $('input[name="cad-nome"]').val(displayName);
                        if(dados.sexo == 'masculino'){
                            $('#masculino').prop('checked', true);
                        }else if(dados.sexo == 'feminino'){
                            $('#feminino').prop('checked', true);
                        }
                        $('textarea[name="cad-alergia"]').val(dados.alergia);
                        dados.limitacoes.forEach((limitacao) => {
                            $('#'+limitacao).prop('checked', true);
                        });
                    }
                });
                removerLoading();
        })
        .catch((error) => {
            console.log('error', error);
            removerLoading();
        });
}