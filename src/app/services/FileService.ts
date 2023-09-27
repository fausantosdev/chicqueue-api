import { Prisma } from '@prisma/client'

import CustomException from '../../utils/CustomException'

import { FileRepository } from '../repositories/FileRepository'

import { FileType } from '../../types/FileType'

class FileService {
    private fileRepository: FileRepository

    constructor() {
        this.fileRepository = new FileRepository
    }

    async create () {  
        
    }

    async read (where: Prisma.UserWhereUniqueInput | {}) {
        const result = await this.fileRepository.read(where)

        if ( !result ) throw new CustomException('Arquivo não encontrado')

        return result
    }

    async readOne (where: Prisma.FileWhereUniqueInput) {
        const result = await this.fileRepository.readOne(where)

        if(!result) throw new CustomException('Arquivo não encontrado')

        return result
    }

    async update (data: {}, file: FileType, where: Prisma.UserWhereUniqueInput) {
      
    }

    async delete (where: Prisma.FileWhereUniqueInput) {
        const userExists = await this.fileRepository.readOne(where)

        if(!userExists) throw new CustomException('Usuário não encontrado')
       
        const userDeleted = await this.fileRepository.delete(where)

        return userDeleted
    }
}

export { FileService }