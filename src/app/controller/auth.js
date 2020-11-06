const User = require('../model/user');
const AuthService = require('../service/auth');
const ResetToken = require('../model/reset_token');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const service = new AuthService();

//modules
const mailer = require('../../modules/mailer');

class AuthController {

    async login(req, res) {
        const { email, password } = req.body

        try {

            const user = await User.findOne({ email }).select('+password');

            if (!user)
                return res.status(400).send({ error: 'User not found.' });

            if (!await bcrypt.compare(password, user.password))
                return res.status(400).send({ error: 'Invalid Password.' });

            user.password = undefined

            const token = service.generateToken({ '_id': user._id });

            res.send({ user, token});
        } catch (error) {
            res.status(400).send({ error: 'Error authentication: ' + error });
        }
    }

    async registration(req, res) {
        const { email } = req.body;
        try {

            if (await User.findOne({ email }))
                return res.status(400).send({ error: 'User already exists.' })


            const user = await service.registration(req.body);

            res.send({ user });
        } catch (error) {
            res.status(400).send({ error: 'Error to register user: ' + error });
        }
    }

    async forgotPassword(req, res) {
        const { email } = req.body;
        try {

            const user = await User.findOne({ email });

            if (!user)
                return res.status(400).send({ error: 'User not found.' });

            const token = crypto.randomBytes(20).toString('hex');//TOken aleaório de 20 caracteres

            const expiration = new Date();//tempo de expiração do token
            expiration.setHours(expiration.getHours() + 1);// o Token vai expirar em 1 hora

            await ResetToken.create({
                'email': email,
                'token': token,
                'expiration': expiration,
            });

            mailer.sendMail({
                to: email,
                from: 'andreyev2011@hotmail.com',
                template: 'auth/forgot_password',
                context: { token },
            }, (error) => {
                if (error) {
                    return res.status(400).send({ error: 'Cannot send a forgot password email: ' + error })
                }

                return res.status(200).send({ message: 'We send a a link to reset a password, check your e-mail' })
            });

        } catch (error) {
            res.status(400).send({ error: 'Error on forgot password: ' + error })
        }
    }

    async resetPassword(req,res){
        const {email,token,password} = req.body;

        try{

            const user = await User.findOne({email});
            const resettoken  = await ResetToken.findOne({email,token}).select('+token');

            if(!user)
                return res.status(400).send({error:'Error on reset password: User not found.'});
            
            if(token !== resettoken.token)
                return res.status(400).send({error:'Error on reset password: Invalid Token.'});

            if(new Date() > resettoken.expiration)
                return res.status(400).send({error:'Error on reset password: Token Expired.'});

            user.password = password;

            await user.save();

            return res.status(200).send({message:'Password reset successfully'});
        }catch(error){
            res.status(400).send({error:'Error on reset password: ' + error})
        }
    }

}

module.exports = AuthController;