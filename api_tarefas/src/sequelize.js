import { Sequelize } from "sequelize";
                            //banco    //user  //senha
export const conn = new Sequelize("tarefas3g", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
  port: "3306",
});

// try {
//   await conn.authenticate();
//   console.log("Connection has been established successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }

// export default conn;