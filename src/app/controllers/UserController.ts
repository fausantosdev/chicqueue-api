import { Request, Response, NextFunction } from 'express'
import * as Yup from 'yup'

import { UserService } from '../services/UserService'

import { FileType } from '../../types/FileType'

class UserController {
  private readonly userService: UserService

  constructor () {
    this.userService = new UserService()
  }

  async index(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id ? Number(req.params.id) : null

    let result = null

    try {
      id ? result = await this.userService.readOne({ id }) : result = await this.userService.read({})

      return res.status(200).json({
        status: true,
        data: result,
        message: ''
      })
    } catch (error: any) {
      next(error)
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        username: Yup.string().required('Nome de usuário é obrigatório'),
        phone: Yup.string().required('Telefone é obrigatório'),
        email: Yup.string().email().required('E-mail é obrigatório'),
        password: Yup.string()
          .min(8, 'Sua senha precisa ter no mínimo oito caracteres')
          .max(100, 'Oops! Você exagerou um pouco, tente refazer sua senha com no máximo cem caracteres')
          .required('Senha é obrigatório')
      })

      await schema.validate(req.body, { abortEarly: false })

      const result = await this.userService.create(req.body, req.file as FileType)

      return res.status(201).json({
        status: true,
        data: result,
        message: 'Usuário criado com sucesso'
      })
    } catch (error: any) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const result = await this.userService.update(req.body, req.file as FileType, { id: parseInt(id) })

      return res.status(200).json({
        status: true,
        data: result,
        message: 'Usuário atualizado com sucesso'
      })
    } catch (error: any) {
      next(error)
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const result = await this.userService.delete({ id: parseInt(id) })

      return res.status(200).json({
        status: true,
        data: !!result,
        message: ''
      })
    } catch (error: any) {
      next(error)
    }
  }
}

export { UserController }
