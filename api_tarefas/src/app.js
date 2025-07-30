import express, { request, response } from "express";
import cors from "cors";

import { conn } from "./sequelize.js";

import tabelaSetor from "./tabelaSetor.js";
import tabelaTarefa from "./tabelaTarefa.js";
import { where } from "sequelize";

const PORT = 3333;

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

//conectar o banco e criar as tabelas
conn
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor HTTP is running on PORT:${PORT}`);
    });
  })
  .catch((error) => console.log(error));

const logRoutes = (request, response, next) => {
  const { url, method } = request;
  const rota = `[${method.toUpperCase()}]- ${url}`;
  console.log(rota);
  next();
};

//MIDDLEWARE GLOBAL
app.use(logRoutes)

//listarTodas, cadastrar, listaUma, atualizar, excluir
app.get("/tarefas", logRoutes, async (request, response) => {
  try {
    const tarefas = await tabelaTarefa.findAll();
    response.status(200).json(tarefas);
  } catch (error) {
    response.status(500).json({
      mensagem: "Erro interno do servidor ao listar tarefas",
    });
  }
});
app.post("/tarefas", async (request, response) => {
  const { tarefa, descricao, setor_id } = request.body;

  if (!tarefa || tarefa.length < 2) {
    response.status(400).json({
      erro: "Erro no campo tarefa",
      mensagem: "O campo tarefa deve possuir 2 ou mais caracteres",
    });
    return;
  }
  if (!descricao) {
    response.status(400).json({
      erro: "Erro no campo descricao",
      mensagem: "O campo tarefa permite valor nulo",
    });
    return;
  }
  if(!setor_id){
    response.status(400).json({ mensagem: "Erro ao encontrar ID. O campo é obrigatório"})
  }

  const novaTarefa = {
    tarefa,
    descricao,
    setor_id
  };

  try {
    const tarefaCadastrada = await tabelaTarefa.create(novaTarefa);
    response.status(201).json(tarefaCadastrada);
  } catch (error) {
    response.status(500).json({
      mensagem: "Erro interno do servidor ao cadastrar tarefa",
    });
  }
});
app.get("/tarefas/:id", async (request, response) => {
  const { id } = request.params;

  if (!id) {
    response.status(400).json({ mensagem: "ID inválido" });
    return;
  }

  try {
    const tarefaSelecionada = await tabelaTarefa.findByPk(id);
    if (!tarefaSelecionada) {
      response.status(404).json({
        erro: "Tarefa não encontrada",
        mensagem: `ID ${id} não existe`,
      });
    }
    response.status(200).json(tarefaSelecionada);
  } catch (error) {
    response.status(500).json({
      mensagem: "Erro interno do servidor ao cadastrar tarefa",
    });
  }
});
app.put("/tarefas/:id", async (request, response) => {
  const { id } = request.params;
  const { tarefa, descricao, situacao } = request.body;

  if (!id) {
    response.status(400).json({ mensagem: "ID inválido" });
    return;
  }

  try {
    const tarefaSelecionada = await tabelaTarefa.findByPk(id);
    if (!tarefaSelecionada) {
      response.status(404).json({
        erro: "Tarefa não encontrada",
        mensagem: `ID ${id} não existe`,
      });
    }

    if(tarefaSelecionada.setor_id != setor_id){
      response.status(401).json({
        erro: "Tarefa não atualizada",
        mensagem:"Tarefa não pertence a este setor."
      })
      return
    }

    //Atualiza apenas os campos enviados
    console.log(tarefaSelecionada);
    if (tarefa !== undefined) {
      tarefaSelecionada.tarefa = tarefa;
    }
    if (descricao !== undefined) {
      tarefaSelecionada.descricao = descricao;
    }
    if (situacao !== undefined) {
      tarefaSelecionada.situacao = situacao;
    }
    await tarefaSelecionada.save();
    response.status(200).json({
      mensagem: "tarefa atualizada",
      tarefa: tarefaSelecionada,
    });
  } catch (error) {
    response.status(500).json({
      mensagem: "Erro interno do servidor ao cadastrar tarefa",
    });
  }
});
app.delete("/tarefas/:id/:idSetor", async (request, response) => {
  const { id, idSetor } = request.params; //{id: 12321312, nome: ""}
  if (!id) {
    response.status(400).json({ mensagem: "Id inválido" });
    return;
  }
  if (!idSetor) {
    response.status(400).json({ mensagem: "Id setor inválido" });
    return;
  }

  try {
    const tarefaSelecionada = await tabelaTarefa.findByPk(id);
    //v: // {id, tarefa, descrição, situação, dt, dt} | F = null
    if (!tarefaSelecionada) {
      response.status(404).json({ mensagem: "tarefa não encontrada" });
      return;
    }
    // DELETE FROM pessas WHERE id = id
    await tabelaTarefa.destroy({ where: { id: tarefaSelecionada.id , setor_id: idSetor } });

     if (!tarefaSelecionada) {
      response.status(404).json({ mensagem: "Esse setor não exclui a tarefa" });
      return;
    }

    response.status(204).send();
  } catch (error) {
    console.log("ERROR: ", error);
    response.status(500).json({
      mensagem: "Erro interno do servidor ao Excluir tarefa",
    });
  }
});

app.get("/setores", async (request, response)=>{
  try {
    const setor = await tabelaSetor.findAll();
    response.status(200).json(setor);
  } catch(erro){
    response.status(500).json({mensagem:"Erro Interno do servidor"})
  }
})
app.post("/setores", async (request, response)=>{
  const {nome} = request.body;

  if(!nome){
    response.status(400).json({mensagem:"Não permitido campo nulo!"})
    return
  }
  
  const nomeSetor = {
    nome
  };

  try{
    const tbSetor = await tabelaSetor.create(nomeSetor);
    response.status(201).json(tbSetor);
  }catch(erro){
    response.status(500).json({mensagem:"Erro interno do servidor"})
  }
})
app.get("/setores/:id", async (request, response)=>{
  const {id} = request.params
  if(!id){
    response.status(400).json({mensagem:"ID inválido"})
  }
  try{
    const tbSetor = await tabelaSetor.findByPk(id);

    if(!tbSetor){
      response.status(404).json({mensagem: "ID não existe!"});
      return
    }

    response.status(200).json(tbSetor)
  }catch(erro){
    response.status(500).json({mensagem:"Erro interno do servidor"})
  }
})
app.put("/setores/:id", async (request, response)=>{
  const {id} = request.params;
  const {nome} = request.body
  if(!id){
    response.status(400).json({mensagem:"ID inválido!"})
    return;
  }
  try{
    const tbSetor = await tabelaSetor.findByPk(id);
    if(!tbSetor){
      response.status(404).json({mensagem:"Erro ao encontra o ID"})
      return;
    }

    if(nome != undefined){
      tbSetor.nome = nome
    }
    await tbSetor.save()
    response.status(200).json(
      {
        mensagem: "Tarefa atualizada",
        tarefa: tbSetor 
       }
    )
  }catch(erro){
    response.status(500).json({mensagem:" Erro interno do servidor"})
  }
})
app.delete("/setores/:id", async (request, response)=>{
  const {id} = request.params;
  if(!id){
    response.status(400).json({mensagem:"ID inválido!"})
    return;
  }
  try{
    const tbSetor = await tabelaSetor.findByPk(id)
    if(!tbSetor){
      response.status(404).json({mensagem:"Erro ao encotrar setor! Id não existe."})
      return;
    }

    await tabelaSetor.destroy( {where: {id}})
    response.status(200).json({mensagem:"Setor deletado!"})
  } catch(erro){
    response.status(500).json({mensagem:"Erro interno do servidor!"})
  }
})

app.use((request, response) => {
  response.status(404).json({ mensagem: "Rota não encontrada" });
});
