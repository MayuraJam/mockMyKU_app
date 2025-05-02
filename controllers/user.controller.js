const jwt = require('jsonwebtoken');
require("dotenv").config();
const authenticateToken = async (req,res)=>{
res.json()
}

const logIn = async (req, res) => {
    try {
      const userEmail = req.body.email;
      const user = {email:userEmail}
      const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
      console.log("accessTokent is",accessToken);
    } catch (error) {
      res.status(500).json({ massage: "login fail" });
    }
  };

  function authenticateToken(req,res,next){
    const authHeader = req.header['authorization']
    const token = authHeader && authHeader.split('')[1]
    if(!token) return res.status(404)
        .json({ massage: `this token not found` });
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return  res.status(403)
        req.user = user 
    next();
    });
  }

  //เมื่อทำการ login ให้ทำการตรวจสอบว่า email password ที่ส่งเข้ามาคือ role อะไร แล้วให้ console ออกมาว่าคือ role อะไร
  //เปลี่ยนเป็นแยกตามหมายเลขประจำตัวแทน เหมือนเว็บจริง รหัสจะถูกเจนจากการสร้างบัญชีใหม่

  module.exports = {logIn}