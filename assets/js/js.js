function errorMessage(codigoErro) {
    let mensagem;
  
    switch (codigoErro) {
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
      default:
        mensagem = 'Erro no login. Tente novamente.';
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