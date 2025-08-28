// apply a zod schema to req.body
module.exports = (schema) => (req,res,next) =>{
try{
const result = schema.parse(req.body);
req.validated = result;
next();
}catch(err){
return res.status(400).json({ error: err.errors || err.message });
}
}