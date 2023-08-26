import { Op, Sequelize } from 'sequelize';
import * as Models from '../models/definitions.mjs';
import ConnectionPool from '../service/connection-pool.mjs';
import util from '../util.mjs';

class PaymentService {

  async search(criteria, offset, limit) {
    const { accountId, keyword } = criteria;

    let res = [];
    let includeAttributes = [];
    const emptyKeyword = util.isEmptyString(keyword);
    const encodedKeywords = util.encodeText(keyword);
    const prefixedKeywords = util.breakIntoWords(encodedKeywords).map(w => `+${w}`).join(' ');

    if (!emptyKeyword) includeAttributes.push([
          Sequelize.literal(`((Payment.from_name LIKE '%${keyword}%') * 7) + 
          ((Payment.from_account_no LIKE '%${keyword}%') * 7) + 
          ${encodedKeywords.length ? "(MATCH (Payment.phonetic) AGAINST('" + prefixedKeywords + "' IN BOOLEAN MODE) * 1.2) + " : ''} 
          (MATCH (Payment.from_name) AGAINST('${keyword}' IN BOOLEAN MODE))`), 'relevance']);

    let order = [ ['paymentDate', 'DESC'] ];
    if (!emptyKeyword) order.push(['relevance', 'DESC']);
    try {
      res = await Models.Payment.findAndCountAll({
        offset: offset == null? null : +offset,
        limit: limit == null? null : +limit,
        attributes: {
          include: includeAttributes
        },
        order,
        ...this.createWhereCriteria(accountId, keyword)
      }) 
    } catch(err) {
      console.log(err);
    }
    return res;
  }

  createWhereCriteria(accountId, keyword, prefix = '') {
    const emptyKeyword = util.isEmptyString(keyword);
    const encodedKeywords = util.encodeText(keyword);
    const prefixedKeywords = util.breakIntoWords(encodedKeywords).map(w => `+${w}`).join(' ');
    return {
      where: {
        [Op.and]: [
          { accountId: accountId },
          emptyKeyword? null : {
            [Op.or]: [
              encodedKeywords.length? Sequelize.literal(`MATCH (\`${prefix}Payment\`.phonetic) AGAINST(?)`) : null,
              Sequelize.literal(`\`${prefix}Payment\`.from_name LIKE ?`),
              ...(util.breakIntoWords(keyword).flatMap(val => {
                return [
                  Sequelize.literal(`Payment.from_account_no LIKE '${val}%'`),
                  Sequelize.literal(`Payment.from_bank LIKE '${val}%'`)
                ];
              }))
            ]
          }
      ]},
      replacements: emptyKeyword? null : ( 
        encodedKeywords.length?  [
          `${prefixedKeywords}`, 
          `%${keyword}%`,
        ] : [
          `%${keyword}%`
        ] 
      ),
    }
  }
  
  async addPayments(payment, account) {
    try {
      await ConnectionPool.connection.sequelize.transaction(async (trx) => {
        payment.accountId = account.id;
        payment.phonetic = util.encodeText(`${payment.fromName} ${payment.fromAccountNo} ${payment.fromBank} ${payment.notes}`);
        payment.paymentDate ??= new Date();
        
        await Models.Payment.create(payment, {transaction: trx});

        const acc = await Models.Account.findByPk(parseInt(account.id), {
          include: [{
            model: Models.Bill,
            required: false,
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

      });

    } catch (err) {
      console.log(err);
      throw err; 
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