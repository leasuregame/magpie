/**
 * Created by Arthur on 2015/1/18.
 */
var nodemailer = require("nodemailer");

var transport = nodemailer.createTransport("SMTP", {
    host: "smtp.163.com",
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    auth: {
        user: "wzh_34@163.com",
        pass: "wenjin"
    }
});
transport.sendMail({
    from: "wzh_34@163.com",
    to: "175040128@qq.com",
    subject: "Send by Node.js",
    generateTextFromHTML: true,
    html: "Send by Node.js!测试成功！！"
}, function(error, response) {
    if (error) {
        console.log('发送失败！' + error);
    } else {
        console.log("Message sent: " + response.message);
    }
    transport.close();
});
