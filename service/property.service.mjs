import { Op, Sequelize } from 'sequelize';
import * as Models from '../models/definitions.mjs';
import svc from '../util.mjs';

class PropertyService {
  async search(keyword) {
    var res = null;
    const keywordSoundex = svc.encodeText(keyword);
    const prefixedKeywords = svc.breakIntoWords(keywordSoundex).map(w => `+${w}`).join(' ');
    try {
      res = await Models.Property.findAll({
        attributes: {
          include: [
            [Sequelize.literal('MATCH (Property.property_soundex) AGAINST(? IN BOOLEAN MODE)'), 'relevance']
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
            //Sequelize.literal('MATCH (Pemilik.nama_soundex) AGAINST(?)'),
            Sequelize.literal('MATCH (Collector.nama_soundex) AGAINST(?)'),
            Sequelize.literal('MATCH (Property.property_soundex) AGAINST(? IN BOOLEAN MODE)'),
            Sequelize.literal('Pemilik.nama LIKE ?'),
            /* ...(keyword?.split(/\s+/).flatMap(val => {
              return [
                Sequelize.literal(`Property.blok LIKE '${val}%'`),
                Sequelize.literal(`Property.no LIKE '${val}%'`)
              ];
            })) */
          ]
        },
        order: [
          ['relevance', 'DESC']
        ],
        replacements: [
          // `*${keywordSoundex}*`, 
          `${prefixedKeywords}`, 
          `*${keywordSoundex}*`, 
          `${prefixedKeywords}`, 
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
          propertySoundex: 'TEST'
        }); 
      } catch (err) {
        console.log(err);
      }
      return res; */
    }
  
  }
  
  export default PropertyService;