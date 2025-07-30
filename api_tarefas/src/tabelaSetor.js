import { DataTypes } from "sequelize";
import { conn } from "./sequelize.js";

const setor = conn.define(
    "setores",
    {
        nome:{
            type:DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName:"setores",
        timestamps: true,
        createdAt:"created_at",
        updatedAt: "updates_at"
    }
);

export default setor