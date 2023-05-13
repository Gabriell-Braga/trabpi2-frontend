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
      showErrorAlert("Por favor, preencha o campo Nome.");
      return false;
    }
  
    if (!email.trim()) {
      showErrorAlert("Por favor, preencha o campo E-mail.");
      return false;
    }
  
    if (!emailRegex.test(email)) {
      showErrorAlert("Por favor, insira um e-mail válido.");
      return false;
    }
  
    if (senha.trim() === "") {
      showErrorAlert("Por favor, preencha o campo Senha.");
      return false;
    }
  
    if (confirmSenha.trim() === "") {
      showErrorAlert("Por favor, preencha o campo Confirmar Senha.");
      return false;
    }
  
    if (senha !== confirmSenha) {
      showErrorAlert("As senhas informadas não coincidem.");
      return false;
    }
  
    if (!sexo) {
      showErrorAlert("Por favor, selecione uma opção de Sexo.");
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
  