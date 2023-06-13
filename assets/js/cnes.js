var idDocument;

function initializeApp() {
  init();
  verify();
  getInformacoes();
}

function getInformacoes() {
    const db = firebase.firestore();
    db.collection('informacoes').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          idDocument = doc.id;
          const data = doc.data();
  
          // Preencher os campos com os dados obtidos
          document.getElementById('cnes').value = data.cnes;
          document.getElementById('numero_cnpj').value = data.numeroCnpj;
          document.getElementById('nome_razao_social').value = data.nomeRazaoSocial;
          document.getElementById('nome_fantasia').value = data.nomeFantasia;
          document.getElementById('endereco_estabelecimento').value = data.enderecoEstabelecimento;
          document.getElementById('numero_estabelecimento').value = data.numeroEstabelecimento;
          document.getElementById('bairro_estabelecimento').value = data.bairroEstabelecimento;
          document.getElementById('estabelecimento_faz_atendimento_ambulatorial_sus').value = data.atendimentoAmbulatorialSus;
        });
      })
      .catch((error) => {
        console.error('Erro ao obter informações:', error);
      });
  }
  

function getCnes() {
  const cnes = $('input[name="cad-cnes"]').val();

  fetch(
    `https://apidadosabertos.saude.gov.br/cnes/estabelecimentos/${cnes}`
  ).then(response => response.json())
    .then((data) => {
        document.getElementById('numero_cnpj').value = data.numero_cnpj;
        document.getElementById('nome_razao_social').value = data.nome_razao_social;
        document.getElementById('nome_fantasia').value = data.nome_fantasia;
        document.getElementById('endereco_estabelecimento').value = data.endereco_estabelecimento;
        document.getElementById('numero_estabelecimento').value = data.numero_estabelecimento;
        document.getElementById('bairro_estabelecimento').value = data.bairro_estabelecimento;
        if (data.estabelecimento_faz_atendimento_ambulatorial_sus === 'SIM') {
          document.getElementById('estabelecimento_faz_atendimento_ambulatorial_sus').value = 'SIM';
        } else {
          document.getElementById('estabelecimento_faz_atendimento_ambulatorial_sus').value = 'NAO';
        }
        document.querySelector('button[type="submit"]').disabled = false;
    })
    .catch((error) => {
      showDangerAlert("Problema ao Coletar Dados!");
      console.log(error);
      document.querySelector('button[type="submit"]').disabled = true;
    });
}

function salvar() {  
    mostrarLoading();
  
    // Obter os valores dos campos
    const cnes = document.getElementById('cnes').value;
    const numeroCnpj = document.getElementById('numero_cnpj').value;
    const nomeRazaoSocial = document.getElementById('nome_razao_social').value;
    const nomeFantasia = document.getElementById('nome_fantasia').value;
    const enderecoEstabelecimento = document.getElementById('endereco_estabelecimento').value;
    const numeroEstabelecimento = document.getElementById('numero_estabelecimento').value;
    const bairroEstabelecimento = document.getElementById('bairro_estabelecimento').value;
    const atendimentoAmbulatorialSus = document.getElementById('estabelecimento_faz_atendimento_ambulatorial_sus').value;
  
    // Enviar os dados para o Firebase Firestore
    const db = firebase.firestore();
    db.collection('informacoes').doc(idDocument).set({
      cnes: cnes,
      numeroCnpj: numeroCnpj,
      nomeRazaoSocial: nomeRazaoSocial,
      nomeFantasia: nomeFantasia,
      enderecoEstabelecimento: enderecoEstabelecimento,
      numeroEstabelecimento: numeroEstabelecimento,
      bairroEstabelecimento: bairroEstabelecimento,
      atendimentoAmbulatorialSus: atendimentoAmbulatorialSus
    })
      .then(() => {
        showInfoAlert('Informações salvas com sucesso!');
        removerLoading();
      })
      .catch((error) => {
        console.error('Erro ao salvar as informações:', error);
        removerLoading();
      });
  }
  
