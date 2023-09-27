import { sign, verify } from 'jsonwebtoken'
import { compare } from 'bcrypt'

import authConfig from '../../config/auth'

import CustomException from '../../utils/CustomException'

import { UserRepository } from '../repositories/UserRepository'

import mailer from '../../modules/mailer'

type TypeLogin = {
    email: string
    password: string
}

type JwtPayload = { 
    user: {
        id: number
        username: string 
        email: string
        type: string
    } 
}

class AuthService {
    private userRepository: UserRepository

    constructor() {
        this.userRepository = new UserRepository
    }

    async login ({ email, password }: TypeLogin) {
                    
        const user = await this.userRepository.readOne({ email })

        if(!user) throw new CustomException('Email ou senha inválidos')

        if(!(await compare(password, user.password))) throw new CustomException('Email ou senha inválidos')// 1:39:49

        const { id, username, type } = user

        const token = this.generateToken({ user: { id, username, email, type } })

        return {
            user: {
                id,
                username,
                type
            },
            token
        }
    }

    async refreshToken (token: string) {
        const decoded = this.decodeToken(token)

        const { user } = decoded as JwtPayload

        const userExists = await this.userRepository.readOne({ email: user.email })
        
        if (!userExists) throw new CustomException('Token inválido [rt]')

        const { id, username, email, type } = userExists

        const newToken = this.generateToken({ user: { id, username, email, type } })

        return {
            user: { 
                id, 
                username,
                type 
            },
            newToken
        }
    }

    async forgotPassword(email: string) {
        //const user = await UserRepository.readOne({ email })

        //if(!user) throw new CustomException('E-mail não cadastrado no sistema')
        
        //const token = crypto.randomBytes(20).toString('hex')// Gera o token

        //const now = new Date()// Data de expiração do token

        //now.setHours(now.getHours() + 1)// Expira em 1 hora

        //const updated = await UserRepository.update({ password_reset_token: token, password_reset_expires: now }, { id: user.id })

        //if(!updated) throw new CustomException('Ocorreu um erro ao redefinir sua senha, por favor tente mais tarde. [1]')

        //const mailSended = await mailer.sendMail({
        //    from: 'flavio-_santos@hotmail.com',
        //    to: user.email,
        //    subject: '[NodeJS Base API] - Recuperação de Senha',
        //    text: 'Este é p token para recuperar sua senha',
        //    template: 'mail',
        //    context: {
        //        token
        //    }
        //})

        //return {
        //    user
        //}
    }

    async resetPassword (token: string, email: string, newPassword: string) {
        //const user = await UserRepository.readOne({ email })

        //if (!user) throw new CustomException('Email não cadastrado no sistema')
        
        // Verificar se o token for nulo?
        //if (token !== user.password_reset_token) throw new CustomException('Token inválido')
        
        //const now = new Date()
 
        //if (now > user.passwordResetExpires) throw new CustomException('Token expirado, solicite um novo')
    
        //const result = await UserRepository.update({
        //    password: newPassword,
        //    password_reset_token: null,
        //    password_reset_expires: null
        //}, { id: user.id })

        //if (!result) throw new CustomException('Ocorreu um erro ao atualizar sua senha, por favor, tente novamente')

        //return true
    }

    private generateToken (payload: any) {
        return sign(payload, authConfig.secret as string, { expiresIn: authConfig.expiresIn })
    }

    private decodeToken (token: string) {
        return verify(token, authConfig.secret as string)
    }
}

export { AuthService }

