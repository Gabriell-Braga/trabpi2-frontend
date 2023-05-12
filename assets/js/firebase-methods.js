import { app, db, auth } from "./firebase-config.js";

//AQUI VAO OS METODOS USANDO FIREBASE



async function adicionarDocumento() {
  const docRef = await addDoc(collection(db, "test"), { nome: "João" });
  console.log("Documento criado com ID:", docRef.id);
}


// Chamar a função para testar a conexão com o Firebase e adicionar um documento
testFirebaseConnection();
