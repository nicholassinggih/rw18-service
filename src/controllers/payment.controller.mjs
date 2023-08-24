import express from 'express';
import PaymentService from '../service/payment.service.mjs';

const router = express.Router();

router.post('/add', async function(req, res){
    const svc = new PaymentService();
    const { accountId, fromName, fromAccountNo, fromBank, amount, notes, paymentDate } = req.body;
    try {
        await svc.addPayments({fromName, fromAccountNo, fromBank, amount, notes, paymentDate }, {
            id: accountId
        });
    } catch (err) {
        // TODO: return an error response ehre
        res.status(500).json({
            error: {
                code: 500,
                message: err.message
            }
        })
    }
    res.json({
        message: "Success"
    });
});



router.get('/search', async function(req, res){

    const ps = new PaymentService();
    res.json( await ps.search({ 
            accountId: req.query.accountId, 
            keyword: req.query.keyword
        }, 
        req.query.offset, 
        req.query.limit) );
 
});

export default router;