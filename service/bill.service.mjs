import * as Models from '../models/definitions.mjs';

class BillService {
  createBillForProp(prop) {
    return {
      propertyId: prop.id,
      pemilikId: prop.pemilikId,
      amount: prop.nominal,
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


}
  
export default BillService;