import { Op } from 'sequelize';
import * as Models from '../models/definitions.mjs';
import svc from '../util.mjs';

class DbStartup {
    
    initializeSoundex = async function() {
        const karyawanList = await Models.Karyawan.findAll({
            where: {
                namaBagianSoundex: {
                    [Op.is]: null
                }
            }
        });
        
        karyawanList.forEach(k => {
            k.namaBagianSoundex = svc.encodeText(`${k.nama} ${k.bagian}`);
            k.save();
        });
        
        const collectorList = await Models.Collector.findAll({
            where: {
                namaSoundex: {
                    [Op.is]: null
                }
            }
        });
        
        collectorList.forEach(k => {
            k.namaSoundex = svc.encodeText(`${k.nama}`);
            k.save();
        });
        
        const pembayaranList = await Models.Pembayaran.findAll({
            where: {
                namaBlokNoSoundex: {
                    [Op.is]: null
                }
            }
        });
        
        pembayaranList.forEach(k => {
            k.namaBlokNoSoundex = svc.encodeText(`${k.nama} ${k.blok} ${k.no}`);
            k.save();
        });
        
        const pemilikList = await Models.Pemilik.findAll({
            where: {
                namaSoundex: {
                    [Op.is]: null
                }
            }
        });
        
        pemilikList.forEach(k => {
            k.namaSoundex = svc.encodeText(`${k.nama}`);
            k.save();
        });
        
        const propertyList = await Models.Property.findAll({
            include: [
                {
                    model: Models.Pemilik
                }
            ],
            where: {
                propertySoundex: {
                    [Op.is]: null
                }
            }
        });
        
        propertyList.forEach(k => {
            k.propertySoundex = svc.encodeText(`${k.Pemilik?.nama ?? ''} ${k.blok} ${k.no}`); 
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