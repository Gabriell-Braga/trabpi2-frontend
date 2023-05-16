function initializeApp() {
  init();
  verify();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const ID = user.uid;
      const nome = user.displayName;
      getDados(ID, nome);
    }
  });
}

function getDados(id, nome) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uid = urlParams.get('uid');
  console.log(uid);
  const db = firebase.firestore();
  db.collection("usuarios")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if ((!uid && doc.data().userId == id) || (uid && doc.data().userId == uid)) {
          var dados = doc.data();
          $('input[name="cad-nome"]').val(dados.nome);
          if (dados.sexo == "masculino") {
            $("#masculino").prop("checked", true);
          } else if (dados.sexo == "feminino") {
            $("#feminino").prop("checked", true);
          }
          $('textarea[name="cad-alergia"]').val(dados.alergia);
          dados.limitacoes.forEach((limitacao) => {
            $("#" + limitacao).prop("checked", true);
          });
        }
      });
      removerLoading();
    })
    .catch((error) => {
      console.log("error", error);
      removerLoading();
    });
}
