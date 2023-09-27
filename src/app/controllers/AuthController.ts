import { NextFunction, Request, Response } from 'express'
import * as Yup from 'yup'

import { AuthService } from '../services/AuthService'

class AuthController {
    private authService: AuthService
    constructor() {
        this.authService = new AuthService()
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email().required('E-mail é obrigatório'),
                password: Yup.string().required('Senha é obrigatória')
            })
            
            await schema.validate(req.body, { abortEarly: false })
            
            const result = await this.authService.login(req.body)

            return res.status(201).json({
                status: true,
                data: result,
                message: null
            })
        } catch (error: any) {
            next(error)
        }    
    }

    async tokenRefresh (req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization!.split(' ')[1]

        try {
            /*console.log('a')
            return*/
            const result = await this.authService.refreshToken(token)

            return res.status(200).json({
                status: true,
                data: result,
                message: ''
            })
        } catch (error: any) {
            next(error)
        }
    }

    /*logout(req, res) {
        try {
            delete req.user

            return res.status(200).json({
                status: true,
            })
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                data: null,
                message: error.message,
            })
        }
    }

    async recoverPassword (req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({
                status: false,
                data: null,
                message: 'Validation fails'
            })
        }

        const { email } = req.body

        try {
            const result = await RecoverPasswordService.execute(email)

            return res.status(200).json({
                status: true,
                data: result,
                message: '',
            })
        } catch (error) {
            return res.status(error.code || 500).json({
                status: false,
                data: null,
                message: error.message,
            })
        }
    }*/
}

export { AuthController }