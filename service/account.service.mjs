import * as Models from '../models/definitions.mjs';
import PropertyService from './property.service.mjs';
class AccountService {
  async getAllActive() { 
    var res = [];

    let includeAttributes = [
      PropertyService.selectCurrentFee,
    ];
    try {
      res = await Models.Account.findAll({
        raw: true,
        attributes: {
          include: includeAttributes
        },
        include: [
          {
            model: Models.Property, 
          },
        ],
        where: {
          active: true
        },
      }) 
    } catch(err) {
      console.log(err);
    }
    return res;
  }
  
}
  
export default AccountService;