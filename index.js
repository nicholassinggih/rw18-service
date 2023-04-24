
import bodyParser from 'body-parser';
import express from 'express';
import multer from 'multer';
import property from './property.controller.mjs';

import ConnectionPool from './service/data-service.mjs';

let cp = new ConnectionPool();
cp.authenticate();

var upload = multer();
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

//Use the Router on the sub route /movies
app.use('/property', property); 

app.listen(3000);