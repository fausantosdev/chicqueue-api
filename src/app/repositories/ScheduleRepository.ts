import { Prisma } from '@prisma/client'

import { prisma } from '../../database/prisma'

import { ScheduleInterface } from '../../interfaces/ScheduleInterface'
import { ScheduleType } from '../../types/ScheduleType'

class ScheduleRepository {
  async create ({ date, userId }: ScheduleInterface) {
    const result = await prisma.schedule.create({
      data: { date, userId }// Orário deve ser único?
    })

    return result
  }

  async read (where: Prisma.ScheduleWhereInput | {}) {
    const result = await prisma.schedule.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    if (!result) return false

    return result
  }

  async readOne (where: Prisma.ScheduleWhereUniqueInput) {
    const result = await prisma.schedule.findUnique({
      where,
      include: {
        user: {
          select: {
            name: true,
            phone: true
          }
        }
      }
    })

    if (result == null) return false

    return result
  }

  async update (data: ScheduleType, where: Prisma.ScheduleWhereUniqueInput) {
    const result = await prisma.schedule.update({
      where,
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // if (!result) return false

    return result
  }

  async delete (where: Prisma.ScheduleWhereUniqueInput) {
    const result = await prisma.schedule.delete({ where })

    if (!result) return false

    return result
  }
}

export { ScheduleRepository }
