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
      $('.login-text').text('Consultar Prontuario Médico');
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

 function showHidden(){
    document.getElementById("hidden").style.display = "block"

  }
  