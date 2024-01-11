import passport from 'passport'
import local from 'passport-local'
import { UsuariosModelo } from '../dao/models/usuarios.model.js'
import { creaHash } from '../utils.js'


// exporto 
export const inicializarPassport=()=>{
// creo la estrategia con nombre registro cambiando el username como email y la logica de registro que la saco del post registro.router
    passport.use('registro', new local.Strategy(
        {
            passReqToCallback: true, usernameField: 'email' 
        },
        async(req, username, password, done)=>{
            try {
                console.log("Estrategia local registro de Passport...!!!")
                let {nombre, email}=req.body
                if(!nombre || !email || !password){
                                        return done(null, false)
                }
            
                let regMail=/^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
                console.log(regMail.test(email))

                if(!regMail.test(email)){
                     return done(null, false)
                }
            
                let existe=await UsuariosModelo.findOne({email})
                if(existe){
                    return done(null, false)
                }

                if (email === 'adminCoder@coder.com') {
                    try {
                        let usuario = await UsuariosModelo.create({ nombre, email, password, rol: 'administrador' });
                        return done(null, usuario)
                    } catch (error) {
                        return done(null, false)
                    }
                } else {
                    password = creaHash(password);
                    try {
                        let usuario = await UsuariosModelo.create({ nombre, email, password});
                        return done(null, usuario)
                    } catch (error) {
                        return done(null, false)
                    }
                }
                   
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('login', new local.Strategy(
        {
            usernameField: 'email'
        },
        async(username, password, done)=>{
            try {
                
            } catch (error) {
                done(error, null)
            }
        }
    ))


    // configurar serializador y deserializador porque uso passport con session
    passport.serializeUser((usuario, done)=>{
        return done(null, usuario._id)
    })

    passport.deserializeUser(async(id, done)=>{
        let usuario=await UsuariosModelo.findById(id)
        return done(null, usuario)
    })

} 