import * as Models from '../models/definitions.mjs';

class BillService {
  createBillForAccount(account) { 
    return {
      accountId: account.id, 
      amount: account.nominal, 
      paid: false, 
      billDate: new Date()
    }
  }
  
  saveBills(billList) {
    Models.Bill.bulkCreate(billList).then(() => {
      console.log('Bills saved successfully');
    }).catch((err) => {
      console.log('Error saving bills: ', err);
    });
  }

  async getUnpaidBillsForAccount(account) {
    return await Models.Bill.findAll({
      raw: true,
      where: {
        paid: false,
        accountId: account.id
      }
    });
  }

  
  async search(criteria, order, offset, limit) {
    var res = [];

    try {
      res = await Models.Bill.findAndCountAll({
        offset: offset == null? null : +offset,
        limit: limit == null? null : +limit,
        where: criteria,
        order
      }) 
    } catch(err) {
      console.log(err);
    }
    return res;
  }

}
  
export default BillService;