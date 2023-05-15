function errorMessage(codigoErro) {
  let mensagem;

  switch (codigoErro) {
    // Erros de login
    case 'auth/user-not-found':
      mensagem = 'Usuário não encontrado. Verifique suas credenciais.';
      break;
    case 'auth/wrong-password':
      mensagem = 'Senha incorreta. Verifique suas credenciais.';
      break;
    case 'auth/invalid-email':
      mensagem = 'E-mail inválido. Verifique suas credenciais.';
      break;
    case 'auth/user-disabled':
      mensagem = 'Usuário desativado. Entre em contato com o suporte.';
      break;
    case 'auth/operation-not-allowed':
      mensagem = 'Operação não permitida. Entre em contato com o suporte.';
      break;
    case 'auth/too-many-requests':
      mensagem = 'Muitas tentativas de login. Tente novamente mais tarde.';
      break;
    // Erros de cadastro
    case 'auth/email-already-in-use':
      mensagem = 'E-mail já está em uso. Escolha outro e tente novamente.';
      break;
    case 'auth/weak-password':
      mensagem = 'Senha fraca. Escolha uma senha mais forte.';
      break;
    case 'auth/invalid-email':
      mensagem = 'E-mail inválido. Verifique o formato do e-mail.';
      break;
    default:
      mensagem = 'Erro no login ou no cadastro. Tente novamente.';
      break;
  }
  return mensagem;
}

function init(){
  mostrarLoading();
    $(".alert").hide();
    const firebaseConfig = {
      apiKey: "AIzaSyAgD8XTf6Phg5bInu-D1RxW5nNSdjkZANs",
      authDomain: "medinet-827ad.firebaseapp.com",
      databaseURL: "https://medinet-827ad-default-rtdb.firebaseio.com",
      projectId: "medinet-827ad",
      storageBucket: "medinet-827ad.appspot.com",
      messagingSenderId: "52310695996",
      appId: "1:52310695996:web:2d71e891702b1aa0e92339",
      measurementId: "G-56M8KYD721",
    };
  
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  
    firebase.auth().onAuthStateChanged(user => {
      if(!user){
          window.location.href = "index.html";
      }else{
        const displayName = user.displayName;
        const customData = user.customData;

        $('#usuario').text(displayName);
        removerLoading();
      }
    });
}

function verify(){
  const db = firebase.firestore();
      db.collection('usuarios').get()
          .then(snapshot => {
              snapshot.docs.forEach(doc => {
                  if (doc.data().userId == firebase.auth().currentUser.uid) {
                      var dados = doc.data();
                      console.log(dados);
                      if(dados.admin && dados.admin == 1){
                        $('#sidebar-add').append('<a class="list-group-item list-group-item-action list-group-item-light p-3" href="cadastrar_medico.html">Cadastrar Médico</a>');
                      }
                  }
              });
              removerLoading();
      })
      .catch((error) => {
          console.log('error', error);
          removerLoading();
      }); 
}

function logout(){
  firebase.auth().signOut().then(() => {
      window.location.href = "index.html";
  });
}

function mostrarLoading() {
    // Cria o elemento de overlay para a tela de loading
    const overlay = document.createElement('div');
    overlay.classList.add('loading-overlay');
  
    // Cria o elemento de loading
    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner');
  
    // Adiciona o elemento de loading ao overlay
    overlay.appendChild(loadingSpinner);
  
    // Adiciona o overlay à página
    document.body.appendChild(overlay);
  }
  
  function removerLoading() {
    // Remove o elemento de overlay da página
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }

  function changeCadLogin(ver){
    mostrarLoading();
    $(".alert-info").hide();
    $(".alert-danger").hide();
    if(ver){
      $('.login-text').text('Cadastrar');
      $('.cad-section').fadeIn();
      $('.login-section').hide();
    }else{
      $('.login-text').text('Login');
      $('.login-section').fadeIn();
      $('.cad-section').hide();
    }
    removerLoading();
  }

  function validateCadastro() {
    const nome = $('input[name="cad-nome"]').val();
    const email = $('input[name="cad-email"]').val();
    const senha = $('input[name="cad-password"]').val();
    const confirmSenha = $('input[name="confirm-cad-password"]').val();
    const sexo = $('input[name="cad-sexo"]:checked').val();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (nome.trim() === "") {
      showDangerAlert("Por favor, preencha o campo Nome.");
      return false;
    }
  
    if (!email.trim()) {
      showDangerAlert("Por favor, preencha o campo E-mail.");
      return false;
    }
  
    if (!emailRegex.test(email)) {
      showDangerAlert("Por favor, insira um e-mail válido.");
      return false;
    }
  
    if (senha.trim() === "") {
      showDangerAlert("Por favor, preencha o campo Senha.");
      return false;
    }
  
    if (confirmSenha.trim() === "") {
      showDangerAlert("Por favor, preencha o campo Confirmar Senha.");
      return false;
    }
  
    if (senha !== confirmSenha) {
      showDangerAlert("As senhas informadas não coincidem.");
      return false;
    }
  
    if (!sexo) {
      showDangerAlert("Por favor, selecione uma opção de Sexo.");
      return false;
    }
  
    return true;
  }

  function validateCadastroMedico() {
    const nome = $('input[name="cad-nome"]').val();
    const sexo = $('input[name="cad-sexo"]:checked').val();
    const crm = $('input[name="cad-crm"]').val();
    const area = $('select[name="cad-area-atuacao"] option:selected').text();
  
    if (nome.trim() === "") {
      showDangerAlert("Por favor, preencha o campo Nome.");
      return false;
    }

    if (crm.trim() === "") {
      showDangerAlert("Por favor, preencha o campo CRM.");
      return false;
    }
  
    if (!sexo) {
      showDangerAlert("Por favor, selecione uma opção de Sexo.");
      return false;
    }

    if (area.trim() === "Selecione...") {
      showDangerAlert("Por favor, preencha a área de Atuação.");
      return false;
    }
  
    return true;
  }

  function showDangerAlert(message) {
    $(".alert-info").hide();
    $(".alert-danger").text(message);
    $(".alert-danger").fadeIn();
    const alertOffset = $(".alert-danger").offset().top;
    $("html, body").scrollTop(alertOffset);
  }

  function showInfoAlert(message) {
    $(".alert-danger").hide();
    $(".alert-info").text(message);
    $(".alert-info").fadeIn();
    const alertOffset = $(".alert-danger").offset().top;
    $("html, body").scrollTop(alertOffset);
  }
  
  window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});