import { DataTypes, Sequelize } from "sequelize";
import { conn } from "./sequelize.js";

const tabelaAluno = conn.define(
    "Aluno",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ra: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING(100),
            validate: {
                notEmpty: true,
                min: (2)
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        
    },
    {
        tableName: "alunos",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "update_at"
    }
);

export default tabelaAluno;