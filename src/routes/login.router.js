import { Router } from 'express';
import { UsuariosModelo } from '../dao/models/usuarios.model.js';
import { validaPassword } from '../utils.js';
import passport from 'passport';

export const router=Router()

const auth2 = (req, res, next) => {
    if (req.session.usuario) {
        res.status(401).redirect('/api/perfil'); 
        return;
    }

    next();
};

router.get('/', auth2, (req, res) => {
    let { error, message } = req.query;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('login', { error, message, login: false });
});

router.get('/errorLogin',(req,res)=>{
    return res.redirect('/login?error=Error en el proceso de login... :(')
})

router.post('/', passport.authenticate('login', {failureRedirect: '/api/login/errorLogin'}),  async (req, res) => {
 
    console.log(req.user)
    req.session.usuario = {
        nombre: req.user.nombre,
        email: req.user.email,
        rol: req.user.rol
    };

    res.redirect('/home');
});

