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

}

export default ConnectionPool;