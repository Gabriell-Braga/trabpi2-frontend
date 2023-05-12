// Importar as bibliotecas do Firebase Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Configurar a conexão com o Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAgD8XTf6Phg5bInu-D1RxW5nNSdjkZANs",
    authDomain: "medinet-827ad.firebaseapp.com",
    projectId: "medinet-827ad",
    storageBucket: "medinet-827ad.appspot.com",
    messagingSenderId: "52310695996",
    appId: "1:52310695996:web:2d71e891702b1aa0e92339",
    measurementId: "G-56M8KYD721"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/*
// Função para adicionar um documento na coleção "test"
async function adicionarDocumento() {
  const docRef = await addDoc(collection(db, "test"), { nome: "João" });
  console.log("Documento criado com ID:", docRef.id);
}

// Chamar a função para adicionar um documento
adicionarDocumento();*/