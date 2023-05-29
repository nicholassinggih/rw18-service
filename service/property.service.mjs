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
            [Sequelize.literal(`((Pemilik.nama LIKE ?) * 2) + 
              (MATCH (Property.phonetic) AGAINST(? IN BOOLEAN MODE)) + 
              (MATCH (Pemilik.nama) AGAINST(? IN BOOLEAN MODE))`), 'relevance'],
            // [Sequelize.literal('MATCH (Property.phonetic) AGAINST(? IN BOOLEAN MODE)'), 'relevance'],
            // [Sequelize.literal('MATCH (Pemilik.nama) AGAINST(? IN BOOLEAN MODE)'), 'pemilik_relevance']

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
            Sequelize.literal('MATCH (Collector.phonetic) AGAINST(?)'),
            Sequelize.literal('MATCH (Property.phonetic) AGAINST(? IN BOOLEAN MODE)'),
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
        replacements: [
          // `*${keywordSoundex}*`, 
          `%${keyword}%`,
          `${prefixedKeywords}`, 
          `%${keyword}%`,
          `*${keywordSoundex}*`, 
          `${prefixedKeywords}`, 
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