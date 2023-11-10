import { Prisma } from '@prisma/client'

import { prisma } from '../../database/prisma'

import { UserInterface } from '../../interfaces/UserInterface'

class UserRepository {
  async create ({ name, username, phone, email, password }: UserInterface) {
    const result = await prisma.user.create({
      data: {
        name,
        username,
        phone,
        email,
        password
      }
    })

    return result
  }

  async read (where: Prisma.UserWhereInput | {}) {
    const result = await prisma.user.findMany({
      where,
      include: {
        avatar: {
          select: {
            id: true,
            name: true,
            url: true
          }
        }
      }
    })

    if (!result) return false

    return result
  }

  async readOne (where: Prisma.UserWhereUniqueInput) {
    const result = await prisma.user.findUnique({
      where,
      include: {
        avatar: {
          select: {
            id: true,
            name: true,
            url: true
          }
        }
      }
    })

    if (result == null) return false

    return result
  }

  async update (data: {}, where: Prisma.UserWhereUniqueInput) {
    const result = await prisma.user.update({
      where,
      data,
      include: {
        avatar: {
          select: {
            id: true,
            name: true,
            url: true
          }
        }
      }
    })

    // if (!result) return false

    return result
  }

  async delete (where: Prisma.UserWhereUniqueInput) {
    const result = await prisma.user.delete({ where })

    if (!result) return false

    return result
  }
}

export { UserRepository }
