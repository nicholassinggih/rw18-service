import express from 'express';
import AccountService from '../service/account.service.mjs';

const router = express.Router();

router.get('/search', async function(req, res){
    const svc = new AccountService();
    if (req.query.id) {
        res.json( await svc.getPropertyById(req.query.id) );
    } else {
        res.json( await svc.search(req.query.keyword, req.query.offset, req.query.limit) );
    }
});



export default router;