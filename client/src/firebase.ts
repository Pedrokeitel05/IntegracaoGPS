import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// A sua configuração completa, incluindo a databaseURL
const firebaseConfig = {
  apiKey: "AIzaSyD13XDF3zobL1xC_K7q8B65nuE0u39kTA",
  authDomain: "integracao-1c56b.firebaseapp.com",
  databaseURL: "https://integracao-1c56b-default-rtdb.firebaseio.com",
  projectId: "integracao-1c56b",
  storageBucket: "integracao-1c56b.firebaseapp.com",
  messagingSenderId: "32198957656",
  appId: "1:32198957656:web:9abbaae5358ad380060ead",
  measurementId: "G-55GBR23W4Y",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta a instância da base de dados para ser usada noutras partes da aplicação
export const database = getDatabase(app);
