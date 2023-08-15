import express from 'express';
import AccountService from '../service/account.service.mjs';
import PaymentService from '../service/payment.service.mjs';

const router = express.Router();

router.get('/search', async function(req, res){
    const svc = new AccountService();
    if (req.query.id) {
    } else {
        res.json( await svc.searchByKeyword(req.query.keyword, req.query.offset, req.query.limit) );
    }
});

router.get('/getbill', async function(req, res) {
    const svc = new PaymentService();
    res.json(await svc.addPayments({
        amount: 550000,
        fromName: 'from',
        fromAccountNo: '1112223333',
        fromBank: 'BCA',
        notes: 'note',

    }, {
        id: 1123,
        
    }))
});


export default router;