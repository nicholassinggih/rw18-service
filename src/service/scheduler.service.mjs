import { CronJob } from 'cron';
import BillService from './bill.service.mjs';

class SchedulerService {
    startBillGenerator() {
        const billService = new BillService();
        new CronJob(
            '0 0 1 * *',    // every 1st of the month
            // '*/10 * * * * *',    // every 10 secs
            billService.generateBills,
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