const nodemailer = require('nodemailer');

const multer=require('multer')

const fs=require('fs')

const bodyParser=require('body-parser')

const express=require('express')

const app=express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


// var to;
// var subject;
// var body;
// var path;

var name;
var phone;
var email;
var address;
var qualification;
var aim;
var platform;
var path;
var to;


var Storage= multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'./images')
    },
    filename: function(req,file,callback){
        callback(null,file.fieldname + "_"+Date.now()+ "_" + file.originalname)
    }
})

var upload=multer({
    storage:Storage
}).single('image');



app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.sendFile('/index.html')
})
app.post('/ded',(req,res)=>{
    res.send("hi");
}

         app.post('/sendemail', (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Something went wrong");
        } else {
            const to = req.body.to;
            const name = req.body.name;
            const phone = req.body.phone;
            const address = req.body.address;
            const qualification = req.body.qualification;
            const aim = req.body.aim;
            const platform = req.body.platform;
            const path = req.file.path;

            console.log(to);
            console.log(name);
            console.log(phone);
            console.log(address);
            console.log(qualification);
            console.log(aim);
            console.log(platform);
            console.log(path);

            const data = `
                Name: ${name}
                Phone: ${phone}
                Email: ${to}
                Address: ${address}
                Qualification: ${qualification}
                Aim: ${aim}
                Platform: ${platform}
            `;

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'tpes.data@gmail.com', // Replace this with your Email Id.
                    pass: 'yourpassword' // Replace this with your Password.
                }
            });

            let mailOptions = {
                from: 'tpes.data@gmail.com', // Replace this with your Email Id.
                to: 'tpes.data@gmail.com', // Replace this with Recipient Email Id.
                subject: "Response from Website contact Form",
                text: data,
                attachments: [
                    {
                        path: path
                    }
                ]
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.error('Error occurred: ' + error);
                    res.status(500).send('Error occurred, please try again later.');
                } else {
                    console.log('Successfully Email Sent To: ' + mailOptions.to);
                    fs.unlink(path, function (err) {
                        if (err) {
                            console.error(err);
                            return res.status(500).send(err);
                        } else {
                            console.log('File deleted');
                            return res.redirect('/result.html');
                        }
                    });
                }
            });
        }
    });
});
         
app.listen(5000,() =>{
    console.log("app started on Port 5000")
})


