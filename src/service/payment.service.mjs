import * as Models from '../models/definitions.mjs';
import ConnectionPool from '../service/connection-pool.mjs';
import util from '../util.mjs';

class PaymentService {


  
  async addPayments(payment, account) {
    try {
      await ConnectionPool.connection.sequelize.transaction(async (trx) => {
        payment.accountId = account.id;
        payment.phonetic = util.encodeText(`${payment.fromName} ${payment.fromAccountNo} ${payment.fromBank} ${payment.notes}`);
       
        await Models.Payment.create(payment, {transaction: trx});

        const acc = await Models.Account.findByPk(account.id, {
          include: [{
            model: Models.Bill,
            where: {
              paid: false
            },
            
          }],
          order: [
            [Models.Bill, 'billDate', 'ASC']
          ],
        });
        let newBalance = parseFloat(payment.amount) + parseFloat(acc.dataValues.balance);
        let i = 0;
        while(i < acc.Bills.length && newBalance >= parseFloat(acc.Bills[i].dataValues.amount)) {
          newBalance -= parseFloat(acc.Bills[i].dataValues.amount);
          acc.Bills[i].dataValues.paid = true;
          await Models.Bill.update(acc.Bills[i].dataValues, {
            where: { id: acc.Bills[i].dataValues.id },
            transaction: trx
          })
          i++;
        }
        acc.dataValues.balance = newBalance;

        await Models.Account.update(acc.dataValues, {
          where: { id: acc.id },
          transaction: trx
        });

      })
    } catch (err) {
      console.log(err);
    }
  }

  saveToDb(paymentList) {
    paymentList.forEach(p => {
      p.phonetic = util.encodeText(`${p.fromName} ${p.fromAccountNo} ${p.fromBank} ${p.notes}`);
    });

    Models.Payment.bulkCreate(paymentList).then(() => {
      console.log('Payments saved successfully');
    }).catch((err) => {
      console.log('Error saving payments: ', err);
    });
  }
  
}
  
export default PaymentService;