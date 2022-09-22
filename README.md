# Store Manager

<details> 
<summary>:brazil: Versão em Português</summary>

## Objetivo

Construir uma API para gerenciar o banco de dados de estoque e vendas de uma loja que:

- usa uma interface uniforme e os métodos do protocolo de rede GET, POST, PUT e DELETE;
- é baseada em cliente-servidor;
- tem operações sem estado;
- faz uso de um sistema em camadas.

## Observações

Essa aplicação não usa recursos armazenáveis em cache, então ainda não é bem um app RESTful. <br />
Ela foi desenvolvida utilizando o banco de dados MySQL e pacotes Node.js como express, express-rescue, mysql2, mocha, chai, chai-as-promised e sinon. <br />
A arquitetura de software foi construida usando o padrão Model-Service-Control.

- Todos os arquivos no diretório raiz, com exceção do app.js e README.md, foram criados e configurados pela Trybe.

## Executando a aplicação localmente

- Para instalar os containers docker:

```
docker-compose up -d
```

- Executar o terminal do container:

```
docker attach store_manager
```

- Instalar as dependências, criar e popular o banco de dados:

```
npm install && npm run migration && npm run seed
```

- Inicializar a aplicação:

```
npm start
```

- Executar os testes unitários:

```
npm run test:mocha
```

<br />

## Endpoints

### Produtos

| Método   | URL                                          |
| -------- | -------------------------------------------- |
| `GET`    | http://localhost:3000/products               |
| `GET`    | http://localhost:3000/products/:id           |
| `GET`    | http://localhost:3000/products/search?q=name |
| `PUT`    | http://localhost:3000/products/:id           |
| `POST`   | http://localhost:3000/products               |
| `DELETE` | http://localhost:3000/products/:id           |

### Vendas

| Método   | URL                             |
| -------- | ------------------------------- |
| `GET`    | http://localhost:3000/sales     |
| `GET`    | http://localhost:3000/sales/:id |
| `PUT`    | http://localhost:3000/sales/:id |
| `POST`   | http://localhost:3000/sales     |
| `DELETE` | http://localhost:3000/sales/:id |

<br />

## Cobertura de testes unitários

![testcoverage](./readme/test-coverage-ss.png)

</details>

<details open> 
<summary>:us: English Version</summary>

## Objective

To build an API for managing the database of a store's stock and sales that:

- uses an uniform interface and the methods of the network protocol GET, POST, PUT and DELETE;
- is client-server based;
- has stateless operations;
- makes use of a layered system.
  <br />

## Observations

This application doesn't use cacheable resources, so it's not quite a RESTful app. <br />
It was developed using MySQL database and Node.js packages such as express, express-rescue, mysql2, mocha, chai, chai-as-promised and sinon. <br />
The software architecture was built following the Model-Service-Control standard.

- All files in the root directory, with the exception of app.js and README.md, were created and configured by Trybe.

## Running the application locally

- To install the docker containers:

```
docker-compose up -d
```

- Run the container terminal:

```
docker attach store_manager
```

- Install dependencies, create and populate the database:

```
npm install && npm run migration && npm run seed
```

- Start the application:

```
npm start
```

- Run unit tests:

```
npm run test:mocha
```

<br />

## Endpoints

### Products

| Method   | URL                                          |
| -------- | -------------------------------------------- |
| `GET`    | http://localhost:3000/products               |
| `GET`    | http://localhost:3000/products/:id           |
| `GET`    | http://localhost:3000/products/search?q=name |
| `PUT`    | http://localhost:3000/products/:id           |
| `POST`   | http://localhost:3000/products               |
| `DELETE` | http://localhost:3000/products/:id           |

### Sales

| Method   | URL                             |
| -------- | ------------------------------- |
| `GET`    | http://localhost:3000/sales     |
| `GET`    | http://localhost:3000/sales/:id |
| `PUT`    | http://localhost:3000/sales/:id |
| `POST`   | http://localhost:3000/sales     |
| `DELETE` | http://localhost:3000/sales/:id |

<br />

## Unit tests coverage

![testcoverage](./readme/test-coverage-ss.png)

</details>
