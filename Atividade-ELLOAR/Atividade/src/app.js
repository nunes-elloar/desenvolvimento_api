import express from "express";
import cors from "cors";
import { conn } from "./sequelize.js";
import tabelaAluno from "./tabelaAlunos.js";


const PORT = 3333
const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

conn
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servido HTTP is running on PORT: ${PORT}`)
        });
    })
    .catch((error) => { console.log(error) })

app.use(express.json())



app.get("/alunos", async (request, response) => {

    try {

        const alunos = await tabelaAluno.findAll()
        response.status(200).json(alunos)

    } catch (error) {
        response.status(500).json({ messagem: "Erro internal server" })
        console.log(error)
    }
})


app.post("/alunos", async (request, response) => {
    const { ra, nome, email } = request.body;

    if (!ra) {
        response.status(400).json({ messagem: "O campo não pode está vazio" })
        return
    };
    if (!nome || nome.legth < 2) {
        response.status(400).json({ messagem: "O campo não pode está vazio" })
        return
    };
    if (!email) {
        response.status(400).json({ messagem: "O campo não pode está vazio" })
        return
    };

    const novosAlunos = {
        ra,
        nome,
        email
    }
    try {

        const cadastroAluno = await tabelaAluno.create(novosAlunos)
        response.status(201).json(cadastroAluno)

    } catch (error) {
        response.status(500).json({ messagem: "Erro internal server" })
        console.log(error)
    }
})


app.get("/alunos/:id", async (request, response) => {
    const { id } = request.params;

    if (!id) {
        response.status(400).json({ messagem: "id inválido" })
        return
    }

    try {
        const alunoSelecionado = await tabelaAluno.findByPk(id)
        if (!alunoSelecionado) {
            response.status(404).json({ messagem: "Aluno não encontrado" })
            return
        }

        response.status(200).json(alunoSelecionado)

    } catch (error) {
        response.status(500).json({ messagem: "Erro internal server" })
        console.log(error)
    }

})


app.put("/alunos/:id", async (request, response) => {
    const { id } = request.params;
    const { ra, nome, email } = request.body;

    if (!id) {
        response.status(400).json({ messagem: "id inválido" })
        return
    }

    if (!ra) {
        response.status(400).json({ messagem: "O campo não pode está vazio" })
        return
    };
    if (!nome || nome.legth < 2) {
        response.status(400).json({ messagem: "O campo não pode está vazio" })
        return
    };
    if (!email) {
        response.status(400).json({ messagem: "O campo não pode está vazio" })
        return
    };

    try {

        const alunoSelecionado = await tabelaAluno.findByPk(id)
        if (!alunoSelecionado) {
            response.status(404).json({ messagem: "Aluno não encontrado" })
            return
        }

        if (!ra !== undefined) {
            alunoSelecionado.ra = ra
        }
        if (!nome !== undefined) {
            alunoSelecionado.nome = nome
        }
        if (!email !== undefined) {
            alunoSelecionado.email = email
        }
        await alunoSelecionado.save()
        response.status(200).json({
            messagem: "Aluno atualizada",
            aluno: alunoSelecionado
        })

    } catch (error) {
        response.status(500).json({ messagem: "Erro internal server" })
        console.log(error)
    }


})


app.delete("/alunos/:id", async (request, response) => {
    const { id } = request.params;


    if (!id) {
        response.status(400).json({ messagem: "id inválido" })
        return
    }
    try {
        const alunoSelecionado = await tabelaAluno.findByPk(id)
        
        if (!alunoSelecionado) {
            response.status(404).json({ messagem: "Aluno não encontrado" })
            return
        }

        await tabelaAluno.destroy({where: {id}})
        response.status(204).send()

    } catch (error) {
        response.status(500).json({ messagem: "Erro internal server" })
        console.log(error)
    }

})


app.use((request, response) => {
    response.status(404).json({ messagem: "Rota não encontrada!" })
})

// app.listen(PORT, () => {
//     console.log(`Servido HTTP is running on PORT: ${PORT}`)
// })