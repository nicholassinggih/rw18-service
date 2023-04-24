import { Sequelize } from 'sequelize';

class ConnectionPool { 
    
    constructor() {
        if (ConnectionPool.instance) {
            return ConnectionPool.instance;
        }
        ConnectionPool.instance = this;

        this.sequelize = new Sequelize('rw18', 'root', 'root', {
            host: 'localhost',
            dialect: 'mysql',
            pool: {
                max: 10,
                min: 0,
                idle: 10000
            }
        });

    }

    authenticate = async function() {

        try {
            await this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }

    initializeSoundex = async function() {
        
    }
}
/* 
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}); */

export default ConnectionPool;