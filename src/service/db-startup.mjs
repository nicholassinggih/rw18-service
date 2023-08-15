import { Op } from 'sequelize';
import * as Models from '../models/definitions.mjs';
import svc from '../util.mjs';

class DbStartup {
    
    initializeSoundex = async function() {
        const karyawanList = await Models.Karyawan.findAll({
            where: {
                phonetic: {
                    [Op.is]: null
                }
            }
        });
        
        karyawanList.forEach(k => {
            k.phonetic = svc.encodeText(`${k.nama} ${k.bagian}`);
            k.save();
        });
        
        const collectorList = await Models.Collector.findAll({
            where: {
                phonetic: {
                    [Op.is]: null
                }
            }
        });
        
        collectorList.forEach(k => {
            k.phonetic = svc.encodeText(`${k.nama}`);
            k.save();
        });
        
        const pembayaranList = await Models.Pembayaran.findAll({
            where: {
                phonetic: {
                    [Op.is]: null
                }
            }
        });
        
        pembayaranList.forEach(k => {
            k.phonetic = svc.encodeText(`${k.nama} ${k.blok} ${k.no}`);
            k.save();
        });
        
        const pemilikList = await Models.Pemilik.findAll({
            where: {
                phonetic: {
                    [Op.is]: null
                }
            }
        });
        
        pemilikList.forEach(k => {
            k.phonetic = svc.encodeText(`${k.nama}`);
            k.save();
        });
        
        const propertyList = await Models.Property.findAll({
            include: [
                {
                    model: Models.Pemilik
                }
            ],
            where: {
                phonetic: {
                    [Op.is]: null
                }
            }
        });
        
        propertyList.forEach(k => {
            k.phonetic = svc.encodeText(`${k.Pemilik?.nama ?? ''} ${k.blok} ${k.no}`); 
            k.save();
        });
    }

    constructor() {
        if (DbStartup.instance) return DbStartup.instance;
        DbStartup.instance = this;
        this.initializeSoundex();
    }
}


export default DbStartup; 