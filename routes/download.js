const router = require('express').Router();
const File = require('../models/file');


router.get('/files/download/:uuid', async (req, res) => {

   const file = await File.findOne({ uuid: req.params.uuid });
   console.log(file);
   if (!file) {
      return res.render('download', { error: 'Link has been expired.' });
   }
   const response = await file.save();

   const filePath = `${__dirname}/../${file.path}`;
   // console.log(filepath)
   console.log(filePath);
   res.download(filePath);
});

router.get('/', async (req, res) => {
   res.render("index")
})


module.exports = router;