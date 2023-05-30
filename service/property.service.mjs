import { Op, Sequelize } from 'sequelize';
import * as Models from '../models/definitions.mjs';
import svc from '../util.mjs';

class PropertyService {
  async search(keyword, offset, limit) {
    var res = [];
    if (svc.isEmptyString(keyword)) return res;

    const encodedKeywords = svc.encodeText(keyword);
    const prefixedKeywords = svc.breakIntoWords(encodedKeywords).map(w => `+${w}`).join(' ');
    const blokNoMatchAttr = (svc.breakIntoWords(keyword).flatMap(val => [
      `Property.blok LIKE '${val}%'`,
      `Property.no LIKE '${val}%'`
      ]
    )).join(" OR ");

    try {
      res = await Models.Property.findAndCountAll({
        offset: +offset,
        limit: +limit,
        attributes: {
          include: [
            [Sequelize.literal(`((Pemilik.nama LIKE '%${keyword}%') * 7) + 
              (${blokNoMatchAttr}) * 2 + 
              ${encodedKeywords.length ? "(MATCH (Property.phonetic) AGAINST('" + prefixedKeywords + "' IN BOOLEAN MODE) * 1.2) + " : ''} 
              ${encodedKeywords.length ? "(MATCH (Collector.phonetic) AGAINST('" + prefixedKeywords + "' IN BOOLEAN MODE)) + " : ''} 
              (MATCH (Pemilik.nama) AGAINST('${keyword}' IN BOOLEAN MODE))`), 'relevance'],
            
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
            encodedKeywords.length? Sequelize.literal('MATCH (Collector.phonetic) AGAINST(?)') : null,
            encodedKeywords.length? Sequelize.literal('MATCH (Property.phonetic) AGAINST(? IN BOOLEAN MODE)') : null,
            Sequelize.literal('Pemilik.nama LIKE ?'),
            ...(svc.breakIntoWords(keyword).flatMap(val => {
              return [
                Sequelize.literal(`Property.blok LIKE '${val}%'`),
                Sequelize.literal(`Property.no LIKE '${val}%'`)
              ];
            }))
          ]
        },
        order: [
          // ['exact_match', 'DESC'],
          ['relevance', 'DESC'],
          // ['pemilik_relevance', 'DESC']
        ],
        replacements: encodedKeywords.length?  [

          `${prefixedKeywords}`, 
          `${prefixedKeywords}`, 
          `%${keyword}%`,

        ] : [
          `%${keyword}%`
        ],
        
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