import express from 'express';
import { soundex } from 'soundex-code';
import util from './util.mjs';

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


 
router.get('/test', function(req, res){
   res.json({
      a: util.soundexText(`

      fej  ifje jfi   f ewioa  fwea
   wjafoiewaj  feowia 
   
   gweaiogjewi 
   
   gweajigew
   gwegawegew gwer gwe ag weag ewgaew 
    gweageawg gewagewa    g wea geawa`),
      b: soundex('f'),
      c: soundex('fee'),
      d: soundex('feww'),
   });
});

export default router;