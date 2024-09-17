const express = require('express');
const {requireAuth} = require('../Middlewares/authMiddleware')
const router = express.Router();
const {submit, update, deleteExp, like, unlike, getAll, getById,getByLocation}  = require('../Controllers/expController')
const uploader = require('../Config/multerConfig')

//some routes need params which will be added later on
router.post('/submit',requireAuth, uploader.single('file'),submit);
router.put('/update',requireAuth, uploader.single('file') ,update);
router.delete('/delete',requireAuth, deleteExp);
router.put('/like',requireAuth, like);
router.put('/unlike',requireAuth, unlike);
router.get('/getAll',getAll);
router.get('/getById',getById);
router.get('/getByLocation',getByLocation);

module.exports = router;