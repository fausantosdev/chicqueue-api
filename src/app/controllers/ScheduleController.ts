import { Request, Response, NextFunction } from 'express'
import * as Yup from 'yup'

import { ScheduleService } from '../services/ScheduleService'

class ScheduleController {
  private readonly scheduleService: ScheduleService

  constructor () {
    this.scheduleService = new ScheduleService()
  }

  async index (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    const id = req.params.id ? Number(req.params.id) : null

    let result = null

    const { date } = req.query

    // const parseDate = date ? parseISO(date.toString()) : new Date

    // console.log(parseDate)
    try {
      if (id) {
        result = await this.scheduleService.readOne({ id })
      } else {
        result = date
          ? await this.scheduleService.read({ date })
          : await this.scheduleService.read({})
      }

      return res.status(200).json({
        status: true,
        data: result,
        message: ''
      })
    } catch (error: any) {
      next(error)
    }
  }

  async store (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    try {
      const schema = Yup.object().shape({
        date: Yup.date().required('Data é obrigatória')
      })

      await schema.validate(req.body, { abortEarly: false })

      const userId = req.user.id
      const { date } = req.body

      const result = await this.scheduleService.create({ userId, date })

      return res.status(201).json({
        status: true,
        data: result,
        message: 'Agendamento criado com sucesso'
      })
    } catch (error: any) {
      next(error)
    }
  }

  async update (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    const { id } = req.params

    try {
      const result = await this.scheduleService.update(req.body, { id: parseInt(id) })

      return res.status(200).json({
        status: true,
        data: result,
        message: 'Agendamento atualizado com sucesso'
      })
    } catch (error: any) {
      next(error)
    }
  }

  async remove (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> {
    const { id } = req.params

    try {
      const result = await this.scheduleService.delete({ id: parseInt(id) })

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

export { ScheduleController }
