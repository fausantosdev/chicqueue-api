import { Prisma } from '@prisma/client'
import { isBefore, startOfHour, parseISO, startOfDay, endOfDay, getHours } from 'date-fns'

import CustomException from '../../utils/CustomException'

import { ScheduleRepository } from '../repositories/ScheduleRepository'

import { ScheduleInterface } from '../../interfaces/ScheduleInterface'

import { ScheduleType } from '../../types/ScheduleType'

interface TypeRead {
  _id?: string
  date?: Date | Prisma.ScheduleWhereInput | any
}

class ScheduleService {
  private readonly scheduleRepository: ScheduleRepository

  constructor () {
    this.scheduleRepository = new ScheduleRepository()
  }

  async create (data: ScheduleInterface) {
    const { userId, date } = data

    const dateFormatted = new Date(date)

    const hourStart = startOfHour(dateFormatted)

    const hour = getHours(hourStart)

    if (hour < 9 || hour > 19) throw new CustomException('Faça seu atendimento das 9 às 19h')

    if (isBefore(hourStart, new Date())) throw new CustomException('Horário inválido')

    const isAvailable = await this.scheduleRepository.readOne({ date: hourStart }) as ScheduleType

    if (isAvailable) throw new CustomException('Horário indisponível')

    const newSchedule = await this.scheduleRepository.create({ date: hourStart, userId })

    return newSchedule
  }

  async read (where: TypeRead) {
    if (where.date) {
      where.date = where.date ? startOfHour(parseISO(where.date.toString())) : new Date()

      where = {
        date: {
          gte: startOfDay(where.date),
          lt: endOfDay(where.date)
        }
      }
    }

    const result = await this.scheduleRepository.read(where)

    if (!result) throw new CustomException('Agendamento não encontrado')

    return result
  }

  async readOne (where: Prisma.ScheduleWhereUniqueInput) {
    if (where.date) where.date = startOfHour(parseISO(where.date.toString()))

    const result = await this.scheduleRepository.readOne(where)

    if (!result) throw new CustomException('Nenhum agendamento encontrado')

    return result
  }

  async update (data: ScheduleType, where: Prisma.ScheduleWhereUniqueInput) {
    // FIX: Prisma Argument `id`: Invalid value provided. Expected Int, provided String."
    /* if ('id' in where && typeof where.id === 'string') {
            where.id = parseInt(where.id, 10)
        } */
    const dateFormatted = new Date(data.date)

    const hourStart = startOfHour(dateFormatted)

    const hour = getHours(hourStart)

    if (hour < 9 || hour > 19) throw new CustomException('Faça seu atendimento das 9 às 19h')

    if (isBefore(hourStart, new Date())) throw new CustomException('Horário inválido')

    const dateExists = await this.scheduleRepository.readOne(where)

    if (!dateExists) throw new CustomException('Agendamento não localizado')

    const isAvailable = await this.scheduleRepository.readOne({ date: data.date }) as ScheduleType

    if (isAvailable) throw new CustomException('Horário indisponível')

    const scheduleUpdated = await this.scheduleRepository.update(data, where)

    return scheduleUpdated
  }

  async delete (where: Prisma.ScheduleWhereUniqueInput) {
    const scheduleExists = await this.scheduleRepository.readOne(where)

    if (!scheduleExists) throw new CustomException('Horário não encontrado')

    const scheduleDeleted = await this.scheduleRepository.delete(where)

    return scheduleDeleted
  }
}

export { ScheduleService }
