function errorMessage(codigoErro) {
  let mensagem;

  switch (codigoErro) {
    // Erros de login
    case "auth/user-not-found":
      mensagem = "Usuário não encontrado. Verifique suas credenciais.";
      break;
    case "auth/wrong-password":
      mensagem = "Senha incorreta. Verifique suas credenciais.";
      break;
    case "auth/invalid-email":
      mensagem = "E-mail inválido. Verifique suas credenciais.";
      break;
    case "auth/user-disabled":
      mensagem = "Usuário desativado. Entre em contato com o suporte.";
      break;
    case "auth/operation-not-allowed":
      mensagem = "Operação não permitida. Entre em contato com o suporte.";
      break;
    case "auth/too-many-requests":
      mensagem = "Muitas tentativas de login. Tente novamente mais tarde.";
      break;
    // Erros de cadastro
    case "auth/email-already-in-use":
      mensagem = "E-mail já está em uso. Escolha outro e tente novamente.";
      break;
    case "auth/weak-password":
      mensagem = "Senha fraca. Escolha uma senha mais forte.";
      break;
    case "auth/invalid-email":
      mensagem = "E-mail inválido. Verifique o formato do e-mail.";
      break;
    default:
      mensagem = "Erro no login ou no cadastro. Tente novamente.";
      break;
  }
  return mensagem;
}

function init() {
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

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      const displayName = user.displayName;
      $("#usuario").text(displayName);
      removerLoading();
    }
  });
}

function verify() {
  const db = firebase.firestore();
  db.collection("usuarios")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().userId == firebase.auth().currentUser.uid) {
          var dados = doc.data();
          $("#sidebar-add").append(
            '<a class="list-group-item list-group-item-action list-group-item-light p-3" href="consultas.html">Consultas</a>'+
            '<a class="list-group-item list-group-item-action list-group-item-light p-3" href="cadastrar_consulta.html">Marcar Consulta</a>'
          );
          $("#dropdown-add").append(
            '<a class="dropdown-item" href="prontuario.html">Prontuário</a>'
          );
          if (dados.admin && dados.admin == 1) {
            $("#sidebar-add").append(
              '<a class="list-group-item list-group-item-action list-group-item-light p-3" href="cadastrar_medico.html">Cadastrar Médico</a>'
            );
          }

          if(dados.nascimento == ""){
            showDangerAlert("Complete o Cadastro para uso correto do site!");
          }
        }
      });
      removerLoading();
    })
    .catch((error) => {
      console.log("error", error);
      removerLoading();
    });

    db.collection("medicos")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.data().uid == firebase.auth().currentUser.uid) {
          var dados = doc.data();
          $("#sidebar-add").append(
            '<a class="list-group-item list-group-item-action list-group-item-light p-3" href="consultarProntuario.html">Prontuario medico</a>'
          );
          $("#dropdown-add").append(
            '<a class="dropdown-item" href="perfil.html">Perfil</a>'
          );
          if (dados.admin && dados.admin == 1) {
            $("#sidebar-add").append(
              '<a class="list-group-item list-group-item-action list-group-item-light p-3" href="cadastrar_medico.html">Cadastrar Médico</a>'
            );
          }
        }
      });
      removerLoading();
    })
    .catch((error) => {
      console.log("error", error);
      removerLoading();
    });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "index.html";
    });
}

function mostrarLoading() {
  // Cria o elemento de overlay para a tela de loading
  const overlay = document.createElement("div");
  overlay.classList.add("loading-overlay");

  // Cria o elemento de loading
  const loadingSpinner = document.createElement("div");
  loadingSpinner.classList.add("loading-spinner");

  // Adiciona o elemento de loading ao overlay
  overlay.appendChild(loadingSpinner);

  // Adiciona o overlay à página
  document.body.appendChild(overlay);
}

function removerLoading() {
  // Remove o elemento de overlay da página
  const overlay = document.querySelector(".loading-overlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
}

function changeCadLogin(ver) {
  mostrarLoading();
  $(".alert-info").hide();
  $(".alert-danger").hide();
  if (ver) {
    $(".login-text").text("Cadastrar");
    $(".cad-section").fadeIn();
    $(".login-section").hide();
  } else {
    $(".login-text").text("Login");
    $(".login-section").fadeIn();
    $(".cad-section").hide();
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
  const email = $('input[name="cad-email"]').val();
  const senha = $('input[name="cad-password"]').val();
  const confirmSenha = $('input[name="confirm-cad-password"]').val();
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

function validateUpdateMedico() {
  const nome = $('input[name="cad-nome"]').val();
  const sexo = $('input[name="cad-sexo"]:checked').val();
  const crm = $('input[name="cad-crm"]').val();
  const area = $('select[name="cad-area-atuacao"] option:selected').text();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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


function validateUpdate() {
  const nome = $('input[name="cad-nome"]').val();
  const nascimento = $('input[name="cad-nascimento"]').val();
  const endereco = $('input[name="cad-endereco"]').val();
  const estadoCivil = $('input[name="cad-estado"]:checked').val();
  const sexo = $('input[name="cad-sexo"]:checked').val();

  if (nome.trim() === "") {
    showDangerAlert("Por favor, preencha o campo Nome.");
    return false;
  }

  if (!nascimento.trim()) {
    showDangerAlert("Por favor, preencha o campo Data de Nascimento.");
    return false;
  }

  if (endereco.trim() === "") {
    showDangerAlert("Por favor, preencha o campo Endereço.");
    return false;
  }

  if (!sexo) {
    showDangerAlert("Por favor, selecione uma opção de Sexo.");
    return false;
  }

  if (!estadoCivil) {
    showDangerAlert("Por favor, selecione uma opção de Estado Civil.");
    return false;
  }

  return true;
}

function validateObs() {
  const tipo = $('select[name="cad-tipo"] option:selected').text();
  const data = $('input[name="cad-data"]').val();
  const observacoes = $('textarea[name="cad-obs"]').val();

  if (tipo.trim() === "Selecione...") {
    showDangerAlert("Por favor, selecione uma opção de Tipo.");
    return false;
  }

  if (!data.trim()) {
    showDangerAlert("Por favor, preencha o campo Data da Observação.");
    return false;
  }

  if (observacoes.trim() === "") {
    showDangerAlert("Por favor, preencha o campo Observações.");
    return false;
  }

  return true;
}

function validateSinal() {
  const tipo = $('select[name="cad-tipo"] option:selected').text();
  const data = $('input[name="cad-data"]').val();
  const sinal = $('input[name="cad-sinal"]').val();

  if (tipo.trim() === "Selecione...") {
    showDangerAlert("Por favor, selecione uma opção de Tipo.");
    return false;
  }

  if (!data.trim()) {
    showDangerAlert("Por favor, preencha o campo Data da Observação.");
    return false;
  }

  if (sinal.trim() === "") {
    showDangerAlert("Por favor, preencha o campo Observações.");
    return false;
  }

  return true;
}


function showDangerAlert(message) {
  $(".alert-info").hide();
  $(".alert-danger").text(message);
  $(".alert-danger").show();
  const alertOffset = $(".alert-danger").offset().top;
  $("html, body").scrollTop(alertOffset);
}

function showInfoAlert(message) {
  $(".alert-danger").hide();
  $(".alert-info").text(message);
  $(".alert-info").show();
  const alertOffset = $(".alert-danger").offset().top;
  $("html, body").scrollTop(alertOffset);
}

window.addEventListener("DOMContentLoaded", (event) => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled")
      );
    });
  }
});
