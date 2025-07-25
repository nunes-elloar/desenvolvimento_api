import {Sequelize} from "sequelize";




export const conn = new Sequelize("cadastroAlunos3G", "root", "123456789", {
    host: "localhost",
    dialect: "mysql",
    port: "3306"
})

// try {
//   await conn.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

// export default conn;