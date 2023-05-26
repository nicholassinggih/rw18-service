import { Op, Sequelize } from 'sequelize';
import * as Models from '../models/definitions.mjs';
import svc from '../util.mjs';

class PropertyService {
  async search(keyword) {
    var res = null;
    const keywordSoundex = svc.soundexText(keyword);
    try {
      res = await Models.Property.findAll({
        attributes: {
          include: [
            [Sequelize.literal('MATCH (Pemilik.nama_soundex) AGAINST(?)'), 'relevance']
          ]
        },
        include: [
          {
            model: Models.Pemilik, 
          },
          {
            model: Models.Collector
          }
        ],
        where: {
          [Op.or]: [
            Sequelize.literal('MATCH (Pemilik.nama_soundex) AGAINST(?)'),
            Sequelize.literal('MATCH (Collector.nama_soundex) AGAINST(?)'),
            // Sequelize.literal('MATCH (Property.blok_no_soundex) AGAINST(?)'),
            Sequelize.literal('Pemilik.nama LIKE ?'),
            ...(keyword?.split(/\s+/).flatMap(val => {
              return [
                Sequelize.literal(`Property.blok LIKE '${val}%'`),
                Sequelize.literal(`Property.no LIKE '${val}%'`)
              ];
            }))
          ]
        },
        order: [
          ['relevance', 'DESC']
        ],
        replacements: [`*${keywordSoundex}*`, 
        `*${keywordSoundex}*`, 
        // `*${keywordSoundex}*`, 
        `*${keywordSoundex}*`, 
        `%${keyword}%`],
        
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
  
  }
  
  export default PropertyService;