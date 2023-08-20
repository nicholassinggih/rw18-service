import express from 'express';
import PaymentService from '../service/payment.service.mjs';

const router = express.Router();

router.post('/add', async function(req, res){
    const svc = new PaymentService();
    const { accountId, fromName, fromAccountNo, fromBank, amount, notes } = req.body;
    try {
        await svc.addPayments({fromName, fromAccountNo, fromBank, amount, notes}, {
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

export default router;