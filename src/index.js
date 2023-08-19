
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import account from './controllers/account.controller.mjs';
import bill from './controllers/bill.controller.mjs';
import property from './controllers/property.controller.mjs';
import DbStartup from './service/db-startup.mjs';
import SchedulerService from './service/scheduler.service.mjs';

const dbStartup = new DbStartup();
const scheduler = new SchedulerService();

scheduler.startBillGenerator();

console.log(dbStartup);

var upload = multer();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

//Use the Router on the sub route /movies
app.use('/property', property); 
app.use('/account', account); 
app.use('/bill', bill); 

app.listen(3000);