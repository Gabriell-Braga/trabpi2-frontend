import { app, analytics, db, auth } from "./firebase-config.js";

//AQUI VAO OS METODOS USANDO FIREBASE



async function testFirebaseConnection() {
  try {
    // Referência para a coleção "test"
    const testCollection = db.collection('test');

    // Dados para adicionar ao documento
    const data = {
      nome: 'João',
    };

    // Adicionar um novo documento na coleção "test"
    const docRef = await testCollection.add(data);
    console.log('Documento criado:', docRef.id);
  } catch (error) {
    console.error('Erro ao criar documento:', error);
  }
}


// Chamar a função para testar a conexão com o Firebase e adicionar um documento
testFirebaseConnection();
