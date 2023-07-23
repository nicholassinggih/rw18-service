import { CronJob } from 'cron';
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
                accSvc.getAllActive().then(accounts => {
                    accounts.forEach(acc => {
                        newBills.push(billSvc.createBillForAccount(acc));
                    });

                    billSvc.saveBills(newBills);
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