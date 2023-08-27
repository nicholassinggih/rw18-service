import express from 'express';
import BillService from '../service/bill.service.mjs';

const router = express.Router();

router.get('/search', async function(req, res){
    const svc = new BillService();
    const { accountId, paid, offset, limit } = req.query;
    let criteria = { accountId, paid };
    if (paid === undefined) {
        delete criteria.paid;
    }
    const order = [
        ['billDate', 'DESC']
    ];
    const bills = await svc.search(criteria, order, req.query.offset, req.query.limit);
    res.json( bills );
});

router.get('/generate', async function(req, res){
    const svc = new BillService();
    try {
        await svc.generateBills();
        res.json({success: true});

    } catch (err) {
        res.json( {success: false, err} );
    }
});


export default router;