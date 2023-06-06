var medicosId;

function initializeApp() {
    init();
    verify();
    var ver = false;
    const db = firebase.firestore();
    db.collection('medicos').get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                if (doc.data().uid == firebase.auth().currentUser.uid) {
                    ver = true;
                    medicosId = doc.id;
                }
            });
            if (!ver) {
                window.location.href = "consultas.html";
            }
    })
    .catch((error) => {
        console.log('error', error);
        removerLoading();
    });
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          const ID = user.uid;
          const nome = user.displayName;
          getDados(ID, nome);
        }
      });
}

function getCrm(){
  const crm = $('input[name="cad-crm"]').val();

  fetch(`https://www.consultacrm.com.br/api/index.php?tipo=CRM&q=${crm}&chave=3643833112&destino=json`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if(data.total > 1){
          showDangerAlert('Multiplas correspondências! Informe o UF antes do CRM!');
        }else if(data.total == 0){
          showDangerAlert('CRM informado está incorreto!');
        }else if(data.total == 1){
          dados = data.item[0];
          $('input[name="cad-nome"]').val(dados.nome);
          $('input[name="cad-situacao"]').val(dados.situacao);
        }
      })
      .catch(error => {
        showDangerAlert('CRM informado está incorreto!');
      });
}

function getDados(id, nome) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const uid = urlParams.get("uid");
    const db = firebase.firestore();
    const nomeInput = document.querySelector('input[name="cad-nome"]');
    const situacao = document.querySelector('input[name="cad-situacao"]');
    const crm = document.querySelector('input[name="cad-crm"]');
    const sexoInputs = document.querySelectorAll('input[name="cad-sexo"]');
    const areaAtuacaoSelect = document.querySelector('select[name="cad-area-atuacao"]');
    const horasInput = document.querySelector('input[name="cad-horas"]');
    
    db.collection("medicos")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          if (
            (uid == null && doc.data().uid == id) ||
            (uid != null && doc.data().uid == uid)
          ) {
            const dados = doc.data();
            nomeInput.value = dados.nome;
            crm.value = dados.crm;
            // Preencher campo Sexo
            sexoInputs.forEach((input) => {
              if (input.value === dados.sexo) {
                input.checked = true;
              }
            });
            
            // Preencher campo Área de Atuação
            areaAtuacaoSelect.value = dados.area;
            situacao.value = dados.situacao;
            horasInput.value = dados.horas;
          }
        });
        removerLoading();
      })
      .catch((error) => {
        console.log("Erro ao obter os dados:", error);
        removerLoading();
      });
  }
  

function salvar() {
    if (validateUpdateMedico()) {
        mostrarLoading();
        const nome = $('input[name="cad-nome"]').val();
        const situacao = $('input[name="cad-situacao"]').val();
        const crm = $('input[name="cad-crm"]').val();
        const area = $('select[name="cad-area-atuacao"]').val();
        const sexo = $('input[name="cad-sexo"]:checked').val();
        const horas = $('input[name="cad-horas"]').val();
        const db = firebase.firestore();
        const docRef = db.collection("medicos").doc(medicosId);
        docRef
        .set(
            {
                nome: nome,
                situacao: situacao,
                crm: crm,
                sexo: sexo,
                area: area,
                horas: horas
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