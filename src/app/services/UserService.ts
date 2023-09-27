import { Prisma } from '@prisma/client'
import { hash } from 'bcrypt'
import { v4 as uuid } from 'uuid'


import CustomException from '../../utils/CustomException'

import { s3 } from '../../config/aws'   

import { UserRepository } from '../repositories/UserRepository'
import { FileRepository } from '../repositories/FileRepository'

import { UserInterface } from '../../interfaces/UserInterface'

import { FileType } from '../../types/FileType'
import { UserType } from '../../types/UserType'

class UserService {
    private userRepository: UserRepository
    private fileRepository: FileRepository

    constructor() {
        this.userRepository = new UserRepository
        this.fileRepository = new FileRepository
    }

    async create (data: UserInterface, file: FileType) {  
        const { name, username, phone, email, password } = data

        const emailAlreadyExists = await this.userRepository.readOne({ email })

        if (emailAlreadyExists) throw new CustomException('Email já está sendo usado')
        
        const usernameAlreadyExists = await this.userRepository.readOne({ username })

        if (usernameAlreadyExists) throw new CustomException('Username já está sendo usado')
        
        const phoneAlreadyExists = await this.userRepository.readOne({ phone })

        if (phoneAlreadyExists) throw new CustomException('Telefone já está sendo usado')
        
        const passwordHash = await hash(password, 10)

        const newUser = await this.userRepository.create({ name, username, phone, email, password: passwordHash })
    
        if (newUser.id && !(typeof file === 'undefined')) {

            const uniqueName = `${uuid()}-${file.originalname}`

            const uploadS3 = await s3.upload({  
                Bucket: 'fausantosdev-hero-week',
                Key: uniqueName,
                //ACL: 'public-read',
                Body: file.buffer// 1:28:30
            }).promise()

            if (uploadS3.ETag) {
                //OBS: resolver a questão das imagens estarem fazendo upload
                const newFile = await this.fileRepository.create({ 
                    name: uniqueName,
                    type: file.mimetype,
                    url: uploadS3.Location,
                    userId: newUser.id
                })
            }
        }

        return newUser
    }

    async read (where: Prisma.UserWhereUniqueInput | {}) {
        const result = await this.userRepository.read(where)

        if ( !result ) throw new CustomException('Usuário não encontrado')

        return result
    }

    async readOne (where: Prisma.UserWhereUniqueInput) {
        const result = await this.userRepository.readOne(where)

        if(!result) throw new CustomException('Usuário não encontrado')

        return result
    }

    async update (data: UserType, file: FileType, where: Prisma.UserWhereUniqueInput) {

        // FIX: Prisma Argument `id`: Invalid value provided. Expected Int, provided String."
        if ('id' in where && typeof where.id === 'string') {
            where.id = parseInt(where.id, 10);  
        }

        const userExists = await this.userRepository.readOne(where)

        if(!userExists) throw new CustomException('Usuário não encontrado')
        //const userUpdated = await this.userRepository.update(data, where)

        if(data.email) {
            const usernameExists = await this.userRepository.readOne({ email: data.email })

            if(!usernameExists) throw new CustomException('E-mail já utilizado')
        }

        if(data.username) {
            const usernameExists = await this.userRepository.readOne({ username: data.username })

            if(!usernameExists) throw new CustomException('Nome de usuário já utilizado')
        }

        if(data.phone) {
            const usernameExists = await this.userRepository.readOne({ phone: data.phone })

            if(!usernameExists) throw new CustomException('Telefone já utilizado')
        }

        if(data.password) {
            data.password = await hash(data.password, 10)
        }
        
        const userUpdated = await this.userRepository.update(data, where)

        if (userUpdated.id && !(typeof file === 'undefined')) {

            const uniqueName = `${uuid()}-${file.originalname}`

            const uploadS3 = await s3.upload({  
                Bucket: 'fausantosdev-hero-week',
                Key: uniqueName,
                //ACL: 'public-read',
                Body: file.buffer
            }).promise()

            if (uploadS3.ETag) {
                //OBS: resolver a questão das imagens estarem fazendo upload
                const newFile = await this.fileRepository.create({ 
                    name: uniqueName,
                    type: file.mimetype,
                    url: uploadS3.Location,
                    userId: userUpdated.id
                })
            }
        }
        return userUpdated     
    }

    async delete (where: Prisma.UserWhereUniqueInput) {
        const userExists = await this.userRepository.readOne(where)

        if(!userExists) throw new CustomException('Usuário não encontrado')
       
        const userDeleted = await this.userRepository.delete(where)

        return userDeleted
    }
}

export { UserService }