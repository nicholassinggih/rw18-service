var express = require('express');
var soundex = require('soundex-code');
var 
var router = express.Router();
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
      a: soundex('fewfew')
   });
});


//Routes will go here
module.exports = router;