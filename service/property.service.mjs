import * as Models from '../models/definitions.mjs';

class PropertyService {
  async search(keyword) {
    var res = null;
    try {
      res = await Models.Property.findAll({
        // where: {
        //   blok: 'A'
        // },
        include: [
          {
            model: Models.Pemilik, 
            where: {
              nama: keyword
            }
          }
        ]
      })
    } catch(err) {
      console.log(err);
    }
    return res;
  }

    async createProperty(data) {
      /* var res = null;
      try {
        res = await Models.Property.create({
          blok: 'A',
          no: 'A',
          nominal: 1,
          komersial: false,
          rt: 1,
          blokNoSoundex: 'TEST'
        }); 
      } catch (err) {
        console.log(err);
      }
      return res; */
    }
  /* 
    async getPropertyById(id) {
      return await Models.Property.findByPk(id);
    }
  
    async updateProperty(id, data) {
      const prop = await Models.Property.findByPk(id);
      if (prop) {
        return await Models.Property.update(data);
      }
      return null;
    }
  
    async deleteProperty(id) {
      const prop = await Models.Property.findByPk(id);
      if (prop) {
        await Models.Property.destroy();
        return true;
      }
      return false;
    } */
  }
  
  export default PropertyService;