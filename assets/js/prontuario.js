var usuariosId;

function initializeApp() {
  init();
  verify();
  $(".alert").hide();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const ID = user.uid;
      const nome = user.displayName;
      getDados(ID, nome);
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      var uid = urlParams.get("uid");
      if(uid == null){
        uid = ID;
      }
      exibirConsultas(uid);
      exibirObs(uid);
    }
  });
}

function salvarObs(){
  if(validateObs()){
    mostrarLoading();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var uid = urlParams.get("uid");
    if(uid == null){
      uid = firebase.auth().currentUser.uid;
    }
    const tipo = $('select[name="cad-tipo"]').val();
    const data = $('input[name="cad-data"]').val();
    const obs = $('textarea[name="cad-obs"]').val();
    const db = firebase.firestore();
    const obsCollection = db.collection('observacoes');
    
    const obsData = {
      tipo: tipo,
      data: data,
      obs: obs,
      uid: uid
    }

    // Salva os dados adicionais no documento do usuário
    obsCollection.add(obsData).then((dados) => {
      showInfoAlert('Observação Criada com Sucesso!');
      removerLoading();
      exibirObs(uid);
    }).catch((error) => {
      removerLoading();
      showDangerAlert(error);
    });
    var myModalEl = document.getElementById('modal');
    var modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
  }
}

function exibirConsultas(id) {
  const consultasRef = firebase.firestore().collection("consultas");
  consultasRef.where("uid", "==", id).get().then((querySnapshot) => {
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
  removerLoading();
}

function exibirObs(id) {
  const obsRef = firebase.firestore().collection("observacoes");
  obsRef.where("uid", "==", id).get().then((querySnapshot) => {
    // Limpar o corpo da tabela antes de exibir os dados
    const tabelaConsultas = document.getElementById("tabela-obs-body");
    tabelaConsultas.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const obs = doc.data();

      // Criar uma nova linha na tabela para cada consulta
      const novaLinha = document.createElement("tr");

      // Criar células para cada campo da consulta
      const tipoCelula = document.createElement("td");
      const dataCelula = document.createElement("td");
      const obsCelula = document.createElement("td");

      // Definir o conteúdo das células com os dados da consulta
      tipoCelula.textContent = obs.tipo;
      dataCelula.textContent = obs.data;
      obsCelula.textContent = obs.obs;

      // Adicionar as células à linha
      novaLinha.appendChild(tipoCelula);
      novaLinha.appendChild(dataCelula);
      novaLinha.appendChild(obsCelula);

      // Adicionar a linha ao corpo da tabela
      tabelaConsultas.appendChild(novaLinha);
    });
  });
  removerLoading();
}

function getDados(id, nome) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const uid = urlParams.get("uid");
  const db = firebase.firestore();

  if (uid != null) {
    // Desabilitar todos os campos do HTML
    $('.signin-form input').prop('disabled', true);
    $('.signin-form textarea').prop('disabled', true);
    $('.signin-formselect').prop('disabled', true);
    $('.signin-form button:not(#obs-btn)').prop('disabled', true);
  }

  db.collection("usuarios")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (
          (uid == null && doc.data().userId == id) ||
          (uid != null && doc.data().userId == uid)
        ) {
          usuariosId = doc.id;
          var dados = doc.data();
          $('input[name="cad-nome"]').val(dados.nome);
          $('input[name="cad-nascimento"]').val(dados.nascimento); // Update for dataNascimento field
          $('input[name="cad-endereco"]').val(dados.endereco); // Update for endereco field

          if (dados.sexo == "masculino") {
            $("#masculino").prop("checked", true);
          } else if (dados.sexo == "feminino") {
            $("#feminino").prop("checked", true);
          }else{
            $("#outro").prop("checked", true);
          }
          $('input[name="cad-estado"][value="' + dados.estadoCivil + '"]').prop("checked", true);
          $('textarea[name="cad-alergia"]').val(dados.alergia);
          $('textarea[name="cad-doenças"]').val(dados.doencas); // Update for doencas field
          $('textarea[name="cad-cirugia"]').val(dados.cirurgias); // Update for cirurgias field

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


function salvar() {
  if(validateUpdate()){
    mostrarLoading();
    const nome = $('input[name="cad-nome"]').val();
    const nascimento = $('input[name="cad-nascimento"]').val();
    const endereco = $('input[name="cad-endereco"]').val();
    const sexo = $('input[name="cad-sexo"]:checked').val();
    const estadoCivil = $('input[name="cad-estado"]:checked').val();
    const limitacoes = [];
    $('input[name="cad-limitacoes"]:checked').each(function () {
      limitacoes.push($(this).val());
    });
    const alergia = $('textarea[name="cad-alergia"]').val();
    const doencas = $('textarea[name="cad-doenças"]').val();
    const cirurgias = $('textarea[name="cad-cirugia"]').val();
    const db = firebase.firestore();
    const docRef = db.collection("usuarios").doc(usuariosId);
    docRef
      .set(
        {
          nome: nome,
          nascimento: nascimento,
          endereco: endereco,
          sexo: sexo,
          estadoCivil: estadoCivil,
          limitacoes: limitacoes,
          alergias: alergia,
          doencas: doencas,
          cirurgias: cirurgias,
        },
        { merge: true }
      )
      .then(() => {
        showInfoAlert("Informações Salvas com sucesso!");
        removerLoading();
      })
      .catch((error) => {
        console.error("Erro ao salvar as informações:", error);
        removerLoading();
      });
  }
}
