import express from 'express';
import AccountService from '../service/account.service.mjs';

const router = express.Router();
router.get('/actives', async function(req, res) {
    const svc = new AccountService();
    res.json(await svc.getAllActive());
})

router.get('/search', async function(req, res){
    const svc = new AccountService();
    if (req.query.id) {
        res.json( await svc.getById( req.query.id, {
            isRaw: false,
            includeModels: { bill: parseInt(req.query.accountOnly) === 1 ? false : true }
        }) );
    } else if (req.query.propertyId && req.query.pemilikId) {
        res.json( await svc.getByPropertyAndOwnerId( req.query.propertyId, req.query.pemilikId, {
            isRaw: false,
            includeModels: { bill: parseInt(req.query.accountOnly) === 1 ? false : true }
        }) );
    } else {
        res.json( await svc.searchByKeyword(req.query.keyword, req.query.offset, req.query.limit) );
    }
});

export default router;