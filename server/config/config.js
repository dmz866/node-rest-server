process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://admin:Q1KASRMbkoSwyrKV@cluster0-awerm.mongodb.net/cafe';
}
urlDB = 'mongodb+srv://admin:Q1KASRMbkoSwyrKV@cluster0-awerm.mongodb.net/cafe';
process.env.URL_DB = urlDB;