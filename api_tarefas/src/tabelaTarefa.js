import { DataTypes } from "sequelize";
import { conn } from "./sequelize.js";
import tabelaSetor from "./tabelaSetor.js"

/** payload
 * {id, tarefa, descricao, situacao, dt_criacao, dt_atualização}
 */

const tabelaTarefa = conn.define(
  "tarefas",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tarefa: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    descricao: {
      type: DataTypes.STRING,
    },
    situacao: {
      type: DataTypes.ENUM("pendente", "concluida"),
      defaultValue: "pendente",
      allowNull: false
    },
    setor_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model: tabelaSetor,
        key: "id"
      }
    }
  },
  {
    tableName: 'tarefas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)
tabelaSetor.hasMany(tabelaTarefa, {foreignKey:"setor_id"});
tabelaTarefa.belongsTo(tabelaSetor, {foreignKey:"setor_id"})

export default tabelaTarefa;
