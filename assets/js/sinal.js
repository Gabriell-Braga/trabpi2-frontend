var usuariosId;

function initializeApp() {
  init();
  verify();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  usuariosId = urlParams.get("uid");
  criarGraficoSinaisVitais();
}

function salvarSinal() {
  if (validateSinal()) {
    mostrarLoading();
    const tipo = $('select[name="cad-tipo"]').val();
    const data = $('input[name="cad-data"]').val();
    const sinal = $('input[name="cad-sinal"]').val();
    const db = firebase.firestore();
    const obsCollection = db.collection("sinais");

    const obsData = {
      tipo: tipo,
      data: data,
      sinal: sinal,
      uid: usuariosId,
    };

    // Salva os dados adicionais no documento do usuário
    obsCollection
      .add(obsData)
      .then((dados) => {
        showInfoAlert("Observação Criada com Sucesso!");
        removerLoading();
        criarGraficoSinaisVitais(true);
      })
      .catch((error) => {
        removerLoading();
        showDangerAlert(error);
      });
    var myModalEl = document.getElementById("modal");
    var modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
  }
}

function criarGraficoSinaisVitais(update = false) {
  var db = firebase.firestore();
  var uid = usuariosId; // UID do usuário

  db.collection("sinais")
    .where("uid", "==", uid) // Filtra pela UID do usuário
    .orderBy("data") // Ordena os resultados pela data
    .get()
    .then((querySnapshot) => {
      // Array para armazenar os dados dos sinais vitais
      var dadosSinaisVitais = [];

      // Loop através dos documentos recuperados
      querySnapshot.forEach((doc) => {
        var dados = doc.data();

        // Extrai os campos relevantes (tipo de sinal vital, valor e data)
        var tipoSinalVital = dados.tipo;
        var valorSinalVital = dados.sinal;
        var dataSinalVital = dados.data;

        // Adiciona os dados ao array
        dadosSinaisVitais.push({
          tipo: tipoSinalVital,
          valor: valorSinalVital,
          data: dataSinalVital,
        });
      });

      // Cria o gráfico com os dados dos sinais vitais
      criarGrafico(dadosSinaisVitais, update);
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

function criarGrafico(dados, update = false) {
  // Ordena os dados por data em ordem crescente
  dados.sort((a, b) => a.data - b.data);

  // Extrai os tipos de sinal vital únicos
  var tiposSinaisVitais = [...new Set(dados.map((item) => item.tipo))];

  // Agrupa os dados por tipo de sinal vital
  var dadosAgrupados = tiposSinaisVitais.map((tipo) => {
    var valores = dados
      .filter((item) => item.tipo === tipo)
      .map((item) => ({ x: item.data, y: item.valor }));
    return { tipo: tipo, valores: valores };
  });

  // Configuração do gráfico usando a biblioteca Chart.js
  var ctx = document.getElementById("graficoSinaisVitais").getContext("2d");
  if (update) {
    var chart = Chart.getChart(ctx);

    // Atualiza os dados do gráfico
    chart.data.datasets = dadosAgrupados.map((dados) => ({
      label: getNome(dados.tipo),
      data: dados.valores,
      borderColor: getRandomColor(),
      fill: false,
    }));

    // Atualiza o gráfico
    chart.update();
  } else {
    var chart = new Chart(ctx, {
      type: "line",
      data: {
        datasets: dadosAgrupados.map((dados) => ({
          label: getNome(dados.tipo),
          data: dados.valores,
          borderColor: getRandomColor(),
          fill: false,
        })),
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
            title: {
              display: true,
              text: "Data",
            },
          },
          y: {
            title: {
              display: true,
              text: "Valor",
            },
          },
        },
      },
    });
  }
}

// Função auxiliar para gerar cores aleatórias para cada linha do gráfico
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getNome(nome){
    switch (nome) {
        case 'cardiaca':
            return 'Frequência Cardica';
            break;
        case 'pressao':
            return 'Pressão Arterial';
            break;
        case 'respiratoria':
            return 'Frequência Respiratória';
            break;
        case 'temperatura':
            return 'Temperatura Corporal';
            break;
        case 'saturacao':
            return 'Saturação de O2 no sangue';
            break;
    
        default:
            break;
    }
}