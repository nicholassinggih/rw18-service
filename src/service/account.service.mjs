import * as Models from '../models/definitions.mjs';
import PropertyService from './property.service.mjs';

class AccountService {
  async getAllActive() { 
    return this.search({
      active: true
    })
  }

  async search(criteria, isRaw = true) {
    var res = [];

    let includeAttributes = [
      PropertyService.selectCurrentFee,
    ];
    try {
      res = await Models.Account.findAll({
        raw: isRaw,
        attributes: {
          include: includeAttributes
        },
        include: [
          {
            model: Models.Property, 
          },
          {
            model: Models.Bill
          }
        ],
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

  async getAccountForProp(property) {
    return this.search({
      propertyId: property.id,
      active: true,
      pemilikId: property.pemilikId,
    }, false)
  }

  async getBills(account) { 
    try {
      return await Models.Account.findByPk(account.id, {
        include: [{
          model: Models.Bill, 
          where: {
            paid: 0
          },
          
        
        }],
        order: [[Models.Bill, 'billDate', 'DESC']]
      })
    } catch (error) {
      
    }
  }

  
}
  
export default AccountService;