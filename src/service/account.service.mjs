import * as Models from '../models/definitions.mjs';
import PropertyService from './property.service.mjs';

class AccountService {
  async getAllActive() { 
    return this.search({
      active: true
    })
  }

  async getById(id, options) {
    return this.search({ id }, options);
  }

  async getByPropertyAndOwnerId(propertyId,  pemilikId, options) {
    return this.search({ pemilikId, propertyId}, options);
  }

  async search(criteria, options = { isRaw: false, includeModels: { bill: true} }) {
    var res = [];
    options.isRaw = options.isRaw ?? true;

    let includeAttributes = [
      PropertyService.selectCurrentFee,
    ];
    let include = [{ model: Models.Property}, { model: Models.Pemilik }];
    if (options.includeModels.bill) include.push({model: Models.Bill});
    try {
      res = await Models.Account.findAll({
        raw: options.isRaw,
        attributes: {
          include: includeAttributes
        },
        include,
        where: criteria,
      }) 
    } catch(err) {
      console.log(err);
    }
    return res;
  }

  async searchByKeyword(keyword, offset, limit) {
    const ps = new PropertyService();
    var res = [];
    try {
      const where = ps.createWhereCriteria(keyword);
      console.log('values for where : ' + where.replacements);
      res = await Models.Account.findAndCountAll({
        include: [
          {
            model: Models.Property,
            attributes: { include: [ PropertyService.selectCurrentFee ] },
            ...PropertyService.includeModels,
          }
        ],
        ...ps.createWhereCriteria(keyword, 'Property->')
        
      }) 
    } catch(err) {
      console.log(err);
    }
    return res;
  } 

  async getBills(account, unpaidOnly) { 
    try {
      let where = { accountId: account.id };
      if (unpaidOnly) whereClause.paid = false;
      return await Models.Bill.findAndCountAll({
        where,
        order: [[Models.Bill, 'billDate', 'DESC']]
      })
    } catch (error) {
      console.log(error);
    }
  }

  
}
  
export default AccountService;