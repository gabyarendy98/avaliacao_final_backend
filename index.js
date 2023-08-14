"user strict";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.status(200);
  res.send("Bem vindo ao app!");
});

//propriedades de um usuário
//nome, e-mail (deve ser único), senha e identificador único
const usuarios = [
  {
    nome: "Gabi",
    email: "gabi@teste.com",
    senha: "123",
    id: 1,
  },
];
let identificadorUnicoUsuario = 0;

//deve receber um body com as propriedades pertencentes ao usuário
//criando um novo usuário
app.post("/usuarios", function (req, res) {
  const bodyInvalido = !req.body.nome || !req.body.email || !req.body.senha;
  const existeEmail = usuarios.some(function (usuario) {
    return usuario.email === req.body.email;
  });

  if (bodyInvalido) {
    res.status(400);
    res.send("Os dados informados são inválidos. Tente novamente");
  } else if (existeEmail) {
    res.status(400);
    res.send("Esse e-mail já foi cadastrado. Por favor insira um novo e-mail");
  } else {
    const novoUsuario = {
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha,
      identificador: identificadorUnicoUsuario,
    };
    identificadorUnicoUsuario++;
    usuarios.push(novoUsuario);
    res.status(200);
    res.json({
      mensagem: "Usuário cadastrado com sucesso",
      usuario: novoUsuario,
    });
  }
});

//logando um usuário
app.post("/usuarios/login", function (req, res) {
  const email = req.body.email;
  const senha = req.body.senha;

  const usuarioLogado = usuarios.find(function (usuario) {
    return usuario.email === email && usuario.senha === senha;
  });
  if (usuarioLogado) {
    res.status(200);
    res.json({
      mensagem: "Usuário logado com sucesso",
      usuario: usuarioLogado,
    });
  } else {
    res.status(400);
    res.send(
      "Os dados informados estão incorretos. Verifique o e-mail ou a senha e tente novamente"
    );
  }
});

//propriedades de  um recado
// título, identificador e descrição

var recados = [
  {
    titulo: "Teste",
    descricao: "Teste paginação",
    identificador: 0,
  },
  {
    titulo: "Teste1",
    descricao: "Teste paginação1",
    identificador: 1,
  },
  {
    titulo: "Teste2",
    descricao: "Teste paginação2",
    identificador: 2,
  },
  {
    titulo: "Teste3",
    descricao: "Teste paginação3",
    identificador: 3,
  },
  {
    titulo: "Teste4",
    descricao: "Teste paginação4",
    identificador: 4,
  },
  {
    titulo: "Teste5",
    descricao: "Teste paginação5",
    identificador: 5,
  },
];
let identificadorUnicoRecado = 0;
// crud de recados

//criando um recado
app.post("/recados", function (req, res) {
  const bodyInvalido = !req.body.titulo || !req.body.descricao;
  if (bodyInvalido) {
    res.status(400);
    res.send("Dados preenchidos incorretamente. Tente novamente");
  } else {
    const novoRecado = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      identificador: identificadorUnicoRecado,
    };
    identificadorUnicoRecado++;
    recados.push(novoRecado);
    res.status(200);
    res.json({
      mensagem: "Recado cadastrado com sucesso",
      recado: novoRecado,
    });
  }
});

//buscando um recado pelo id
app.get("/recados/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const recadoEncontrado = recados.find(function (recado) {
    return recado.identificador === id;
  });

  if (recadoEncontrado) {
    res.json({
      mensagem: "Recado encontrado",
      recado: recadoEncontrado,
    });
  } else {
    res.status(400);
    res.send("Recado não encontrado");
  }
});

//filtrando o título do recado e criando a lista dos recados que foram filtrados
app.post("/recados", function (req, res) {
  const titulo = req.body.titulo;

  // Se o parâmetro 'titulo' for fornecido, filtrar os 'recados' com base nele
  let recadosFiltrados = recados;
  if (titulo) {
    recadosFiltrados = recados.filter((recado) =>
      recado.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
  }

  res.json({
    quantidade: recadosFiltrados.length,
    recados: recadosFiltrados,
  });
});

// listando todos os recados sem filtro
app.get("/recados", function (req, res) {
  const paginaAtual = req.query.paginaAtual || 1;
  let itensPorPagina = 3;

  let inicio = (paginaAtual - 1) * itensPorPagina;
  let fim = paginaAtual * itensPorPagina - 1;
  let paginaItens = recados.slice(inicio, fim + 1);

  //console.log(`pagina ${pagina + 1}: ${paginaItens}`);

  res.json({
    paginaAtual: paginaAtual,
    totalItens: recados.length,
    totaldePaginas: Math.ceil(recados.length / itensPorPagina),
    data: paginaItens,
  });
});
//atualizando um recado
app.put("/recados/:id", function (req, res) {
  const bodyInvalido = !req.body.titulo || !req.body.descricao;
  const id = parseInt(req.params.id);
  const recadoEncontrado = recados.find(function (recado) {
    return recado.identificador === id;
  });
  if (bodyInvalido) {
    res.status(400);
    res.send("Dados preenchidos incorretamente. Tente novamente");
  } else if (!recadoEncontrado) {
    res.status(400);
    res.send("Recado não encontrado");
  } else {
    recadoEncontrado.titulo = req.body.titulo;
    recadoEncontrado.descricao = req.body.descricao;
    res.json({
      mensagem: "Recado atualizado com sucesso",
      recado: recadoEncontrado,
    });
  }
});

//deletando um recado pelo id
app.delete("/recados/:id", function (req, res) {
  const id = parseInt(req.params.id);
  const indice = recados.findIndex(function (recado) {
    return recado.identificador === id;
  });

  if (indice === -1) {
    res.status(400);
    res.send("Recado não encontrado");
  } else {
    recados.splice(indice, 1);
    res.json({
      mensagem: "Recado removido com sucesso",
    });
  }
});

app.listen(3000, function () {
  console.log("Servidor rodando na porta 3000: url http://localhost:3000");
});
