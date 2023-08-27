import { CronJob } from 'cron';
import * as Models from '../models/definitions.mjs';
import ConnectionPool from '../service/connection-pool.mjs';
import AccountService from './account.service.mjs';
import BillService from './bill.service.mjs';

class SchedulerService {
    startBillGenerator() {
        new CronJob(
            '0 0 1 * *',    // every 1st of the month
            // '*/10 * * * * *',    // every 10 secs
            function() {
                const billSvc = new BillService();
                const accSvc = new AccountService();
                const newBills = [];
                accSvc.getAllActive().then(async accounts => {
                    const updatedAccounts = [];
                    accounts.forEach(acc => {
                        const bill = billSvc.createBillForAccount(acc)
                        newBills.push(bill);
                        if (acc.balance >= bill.amount) {
                            acc.balance -= bill.amount;
                            bill.paid = true;
                            updatedAccounts.push(acc);
                        }
                    });
                    await ConnectionPool.connection.sequelize.transaction(async (trx) => {
                        await Models.Account.bulkCreate(updatedAccounts, {transaction: trx, updateOnDuplicate: ['balance']})
                        await Models.Bill.bulkCreate(newBills, {transaction: trx});
                    });

                }).catch(err => {
                    console.log(err);
                    // TODO: do something here for the error
                });
                

            },
            null,
            true,
            'Asia/Jakarta'
        );
    }

    createBillForProp(prop) {
        console.log(prop);
    }

  
}

export default SchedulerService;