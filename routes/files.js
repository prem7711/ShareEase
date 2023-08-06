
const router=require('express').Router();

const multer=require('multer');

const path =require('path');

const file=require('../models/file');

const {v4: uuid4}=require('uuid');

const storage=multer.diskStorage({
    destination:(req,file,cb) => cb(null,'uploads/'),
    filename:  (req,file,cb) =>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`; 
         cb(null,uniqueName);
    }
})

let upload=multer({
    storage,
    limit:{filesize:1000000*100} 
}).single('myfile');



router.post('/api/files',(req,res)=>{
    //store file
    upload(req,res,async(err)=>{
        // validate request
        if(!req.file){
            return res.json({error: 'all fields are required.'});
           }
     if(err)
     {
        return res.status(500).send({error:err.message})
     }
      // store into database

      const File=new file({
        filename:req.file.filename,
        uuid: uuid4(),
        path:req.file.path,
        size:req.file.size

      })
      const response =await File.save(); 

      return res.json({File:`${process.env.APP_BASE_URL}/files/${response.uuid}`}) 

    })




   

    // respomse ->link
})






router.post('/api/files/send', async (req, res) => {
    const { uuid, emailTo, emailFrom, expiresIn } = req.body;
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry.'});
    } 
      const File = await file.findOne({ uuid: uuid });
      if(File.sender) {
        return res.status(422).send({ error: 'Email already sent once.'});
      }
      File.sender = emailFrom;    
      File.receiver = emailTo;
      const response = await File.save();
      // send mail 
      const sendMail = require('../services/emailService');
      sendMail({ 
        from: emailFrom,
        to: emailTo,
        subject: 'inShare file sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
                  emailFrom, 
                  downloadLink: `${process.env.APP_BASE_URL}/files/${File.uuid}` ,
                  size: parseInt(File.size/1000) + ' KB',
                  expires: '24 hours'
              })
      });

    return res.send({success: 'true'});
  });
// router.get("/home",(req,res)=>{
//     res.send("hii");
// })

module.exports=router;