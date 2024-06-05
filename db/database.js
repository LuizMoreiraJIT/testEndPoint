import pkg from "pg";
const { Client } = pkg;
import config from "../config/config.js";

const client = new Client({
  host: config.db_host,
  port: config.db_port,
  database: config.db_name,
  password: config.db_password,
  user: config.db_user,
});

async function connectDatabase() {
  try {
    await client.connect();
    console.log("Conectado ao banco de dados PostgreSQL");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1); // Exit process with failure
  }
}

async function saveDatabase(msg, id, from) {
  const query = `
    INSERT INTO minha_tabela (id, content, from_user)
    VALUES ($1, $2, $3);
  `;
  const values = [id, msg, from];

  try {
    await client.query(query, values);
    console.log("Conversa cadastrada com sucesso!");
    disconnect();
  } catch (error) {
    console.error("Erro ao cadastrar conversa:", error);
  }
}

async function disconnect() {
  await client.end().then(() => {
    console.log("Banco de dados desconectado");
  });
}

// Connect to the database when the module is loaded
connectDatabase();

export default saveDatabase;
