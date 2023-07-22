import { CronJob } from 'cron';
import AccountService from './account.service.mjs';
import BillService from './bill.service.mjs';
import PropertyService from './property.service.mjs';

class SchedulerService {
    startBillGenerator() {
        new CronJob(
            '0 0 1 * *',    // every 1st of the month
            function() {
                const propSvc = new PropertyService();
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
        // job.start() - See note below when to use this
    }

    createBillForProp(prop) {
        console.log(prop);
    }

  
}

export default SchedulerService;