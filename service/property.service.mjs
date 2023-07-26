import { Op, Sequelize } from 'sequelize';
import * as Models from '../models/definitions.mjs';
import util from '../util.mjs';

class PropertyService {

  static selectCurrentFee = [Sequelize.literal(`(
    SELECT nominal FROM 
      (SELECT * from fee_history innerfh WHERE innerfh.property_id=property.id) fh INNER JOIN 
      (SELECT property_id, MAX(start_date) AS latest_date FROM rw18.fee_history innerlt group by innerlt.property_id) latest 
      ON fh.property_id = latest.property_id AND fh.start_date = latest.latest_date
    )`), 'nominal'];

  static includeModels = {
    include: [
      {
        model: Models.Pemilik, 
      },
      {
        model: Models.Collector
      },
    ] 
  };

  createWhereCriteria(keyword) {
    const emptyKeyword = util.isEmptyString(keyword);
    const encodedKeywords = util.encodeText(keyword);
    const prefixedKeywords = util.breakIntoWords(encodedKeywords).map(w => `+${w}`).join(' ');
    return {
      where: emptyKeyword? null : {
        [Op.or]: [
          encodedKeywords.length? Sequelize.literal('MATCH (Collector.phonetic) AGAINST(?)') : null,
          encodedKeywords.length? Sequelize.literal('MATCH (Property.phonetic) AGAINST(? IN BOOLEAN MODE)') : null,
          Sequelize.literal('Pemilik.nama LIKE ?'),
          ...(util.breakIntoWords(keyword).flatMap(val => {
            return [
              Sequelize.literal(`Property.blok LIKE '${val}%'`),
              Sequelize.literal(`Property.no LIKE '${val}%'`)
            ];
          }))
        ]
      },
      replacements: emptyKeyword? null : ( 
        encodedKeywords.length?  [
          `${prefixedKeywords}`, 
          `${prefixedKeywords}`, 
          `%${keyword}%`,
        ] : [
          `%${keyword}%`
        ] 
      ),
    }
  }

  async search(keyword, offset, limit) {
    var res = [];
    const emptyKeyword = util.isEmptyString(keyword);
    const encodedKeywords = util.encodeText(keyword);
    const prefixedKeywords = util.breakIntoWords(encodedKeywords).map(w => `+${w}`).join(' ');
    const blokNoMatchAttr = (util.breakIntoWords(keyword).flatMap(val => [
      `Property.blok LIKE '${val}%'`,
      `Property.no LIKE '${val}%'`
      ]
    )).join(" OR ");

    let includeAttributes = [
      PropertyService.selectCurrentFee,
    ];
    if (!emptyKeyword) includeAttributes.push([Sequelize.literal(`((Pemilik.nama LIKE '%${keyword}%') * 7) + 
          (${blokNoMatchAttr}) * 2 + 
          ${encodedKeywords.length ? "(MATCH (Property.phonetic) AGAINST('" + prefixedKeywords + "' IN BOOLEAN MODE) * 1.2) + " : ''} 
          ${encodedKeywords.length ? "(MATCH (Collector.phonetic) AGAINST('" + prefixedKeywords + "' IN BOOLEAN MODE)) + " : ''} 
          (MATCH (Pemilik.nama) AGAINST('${keyword}' IN BOOLEAN MODE))`), 'relevance']);

    try {
      res = await Models.Property.findAndCountAll({
        offset: offset == null? null : +offset,
        limit: limit == null? null : +limit,
        attributes: {
          include: includeAttributes
        },
        ...PropertyService.includeModels,
        order: emptyKeyword? null : [
          ['relevance', 'DESC'],
        ],
        ...this.createWhereCriteria(keyword)
      }) 
    } catch(err) {
      console.log(err);
    }
    return res;
  }

  async getPropertyById(id) {
    console.log("getPropertyById ", id)
    var res = null;
    try {
      res = await Models.Property.findByPk(id, {
        attributes: {
          include: [ PropertyService.selectCurrentFee ]
        },
        include: [
          {
            model: Models.Pemilik, 
          },
          {
            model: Models.Collector
          },
        ]
      }); 
    } catch (err) {
      console.log(err);
    }
    return res;
  }
  
  }
  
  export default PropertyService;