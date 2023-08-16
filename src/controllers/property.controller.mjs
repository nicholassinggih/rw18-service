import express from 'express';
import AccountService from '../service/account.service.mjs';
import PropertyService from '../service/property.service.mjs';

const router = express.Router();
var movies = [
   {id: 101, name: "Fight Club", year: 1999, rating: 8.1},
   {id: 102, name: "Inception", year: 2010, rating: 8.7},
   {id: 103, name: "The Dark Knight", year: 2008, rating: 9},
   {id: 104, name: "12 Angry Men", year: 1957, rating: 8.9}
];

router.get('/', function(req, res){
    res.json(movies);
 });
 
router.get('/search', async function(req, res){

   const ps = new PropertyService();
   if (req.query.id) {
      res.json( await ps.getPropertyById(req.query.id) );
   } else {
      res.json( await ps.search(req.query.keyword, req.query.offset, req.query.limit) );
   }

});

router.get('/bills', async function(req, res){

   const propertyId = req.query.id;
   const pemilikId = req.query.pemilikId;
   const accSvc = new AccountService();
   const ps = new PropertyService();
   const acc = await accSvc.getAccountForProp({id: propertyId, pemilikId: pemilikId});
   res.json(acc[0].Bills );

});

export default router;