import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.status(200);
  res.send("Bem vindo ao app!");
});

//propriedades de um usuário
//nome, e-mail (deve ser único), senha e identificador único
const usuarios = [];
let identificadorUnicoUsuario = 0;

//deve receber um query com as propriedades pertencentes ao usuário
//criando um novo usuário
app.post("/usuarios", function (req, res) {
  const queryInvalido = !req.query.nome || !req.query.email || !req.query.senha;
  const existeEmail = usuarios.some(function (usuario) {
    return usuario.email === req.query.email;
  });

  if (queryInvalido) {
    res.status(400);
    res.send("Os dados informados são inválidos. Tente novamente");
  } else if (existeEmail) {
    res.status(400);
    res.send("Esse e-mail já foi cadastrado. Por favor insira um novo e-mail");
  } else {
    const novoUsuario = {
      nome: req.query.nome,
      email: req.query.email,
      senha: req.query.senha,
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
app.get("/usuarios/login", function (req, res) {
  const email = req.query.email;
  const senha = req.query.senha;

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

const recados = [];
let identificadorUnicoRecado = 0;
// crud de recados

//criando um recado
app.post("/recados", function (req, res) {
  const queryInvalido = !req.query.titulo || !req.query.descricao;
  if (queryInvalido) {
    res.status(400);
    res.send("Dados preenchidos incorretamente. Tente novamente");
  } else {
    const novoRecado = {
      titulo: req.query.titulo,
      descricao: req.query.descricao,
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
app.get("/recados", function (req, res) {
  const titulo = req.query.titulo;

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
  res.json({
    quantidade: recados.length,
    recados: recados,
  });
});
//atualizando um recado
app.put("/recados/:id", function (req, res) {
  const queryInvalido = !req.query.titulo || !req.query.descricao;
  const id = parseInt(req.params.id);
  const recadoEncontrado = recados.find(function (recado) {
    return recado.identificador === id;
  });
  if (queryInvalido) {
    res.status(400);
    res.send("Dados preenchidos incorretamente. Tente novamente");
  } else if (!recadoEncontrado) {
    res.status(400);
    res.send("Recado não encontrado");
  } else {
    recadoEncontrado.titulo = req.query.titulo;
    recadoEncontrado.descricao = req.query.descricao;
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
