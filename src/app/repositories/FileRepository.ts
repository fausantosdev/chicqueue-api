import { Prisma } from '@prisma/client'

import { prisma } from '../../database/prisma'

import { FileInterface } from '../../interfaces/FileInterface'

class FileRepository {
  async create ({ name, type, url, userId }: FileInterface) { // 1:03:19
    const result = await prisma.file.create({
      data: {
        name,
        type,
        url,
        userId
      }
    })

    return result
  }

  async read (where: Prisma.FileWhereInput | {}) {
    const result = await prisma.file.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!result) return false

    return result
  }

  async readOne (where: Prisma.FileWhereUniqueInput) {
    const result = await prisma.file.findUnique({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })// name

    if (result == null) return false

    return result
  }

  async update (data: {}, where: {}) {
    console.log('Update')
  }

  async delete (where: Prisma.FileWhereUniqueInput) {
    const result = await prisma.file.delete({ where })// name

    if (!result) return false

    return result
  }
}

export { FileRepository }
