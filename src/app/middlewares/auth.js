const jwt = require('jsonwebtoken');
require('dotenv/config');

module.exports = (req,res,next) =>{

    const auth_header = req.headers.authorization;

    if(!auth_header)
        return res.status(401).send({error:'No token provided.'});
    
    const parts = auth_header.split(' ');

    if((parts.length !== 2))
        return res.status(401).send({error:'Token error'});

    const [scheme,token] = parts;

    if(!(/^Bearer/i.test(scheme)))
        return res.status(401).send({error:'Bad formatted token'});
    
    jwt.verify(token,process.env.SECRET_API,(error,decoded) => {
        if(error)
            return res.status(401).send({error:'Invalid Token.'});
        
        req.user_id = decoded._id;
    });

    return next();
}