import { DataTypes, Sequelize } from "sequelize";
import {conn} from "./sequelize.js"
const Aluno = require("./tabelaAlunos.js")

const cadastro = conn.define(
    "Cadastro",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        rua:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty:true,
            }
        },
        bairro:{
            type: DataTypes.STRING,
            allowNull: false
        },
        numeroCasa:{
            type: DataTypes.INTEGER,
            allowNull: false,
            validate:{
                notEmpty: true,
                min:(1),
            }
        },
    
        aluno: {
            type : DataTypes.INTEGER,
            foreignKey : true
        },
    },
    {
        tableName: "Cadastro",
        timestamps: true,
        createdAt: "create_at",
        updatedAt: "updated_at"
    }
);
Aluno.hasMany(Endereco, {foreignKey: 'id'});
Endereco.hasMany(Aluno, {foreignKey: 'aluno'});

export default cadastro;