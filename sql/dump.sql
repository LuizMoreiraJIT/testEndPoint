CREATE TABLE minha_tabela (
  id VARCHAR(255) PRIMARY KEY,
  content VARCHAR(255) NOT NULL,
  from_user VARCHAR(255) NOT NULL,
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
