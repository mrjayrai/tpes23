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

app.post('/sendemail',(req,res)=>{
    upload(req,res,function(err){
        if(err){
            console.log(err)
            return res.end("Something Went wrong")
        }
        else{
            to= req.body.to
            // subject=req.body.subject
            body=req.body.body

            path=req.file.path

            name=req.body.name
            phone=req.body.phone
            address=req.body.address
            qualification=req.body.qualification
            aim=req.body.aim
            platform=req.body.platform

            console.log(to)
            console.log(name)
            console.log(phone)
            console.log(address)
            console.log(qualification)
            console.log(aim)
            console.log(platform)
            console.log(path)

            var data="\nname="+ name +"\nPhone: "+ phone + "\nEmail :" + to + "\nAddress  :" + address + " \nQualification : " + qualification + "\n Aim  : " + aim + "\nPlatform : "+ platform
             

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'tpes.data@gmail.com', // Replace this with your Email Id.
                pass: 'druo hgne aeej abqn' // Replace this with your Password.
                }
            })

            let mailOptions = {
                from: 'tpes.data@gmail.com', // Replace this with your Email Id.
                to: 'tpes.data@gmail.com', // Replace this with Recipient Email Id.
                subject: "Response from Website contact Form",
                text: data,
                attachments:[
                    {
                        path:path
                    }
                ]

            }    

            
            transporter.sendMail(mailOptions, function(error, info){ 
                if(error){
                    console.log('Error Occured' + error)
                }
                else {
                    console.log('Successfully Email Sent To:' + mailOptions.to)
                    fs.unlink(path,function(err){
                    if(err){
                        return res.end(err)
                    }
                    else{
                        console.log('Deleted')
                        return res.redirect('/result.html')
                    }
                })
            }
        })
        }
    })
})

app.listen(5000,() =>{
    console.log("app started on Port 5000")
})


