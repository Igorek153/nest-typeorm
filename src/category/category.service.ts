import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateCategoryDto} from './dto/create-category.dto';
import {UpdateCategoryDto} from './dto/update-category.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "./entities/category.entity";
import {FindManyOptions, FindOneOptions, Repository} from "typeorm";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {
    }




    async create(createCategoryDto: CreateCategoryDto, id: number) {


        const findCategory = await this.categoryRepository.findOne({
            where: {
                user: {id},
                title: createCategoryDto.title
            }
        })
        console.log('findCategory', findCategory)
        if (findCategory) throw new BadRequestException('This category already exist')

        const newCategory = {
            title: createCategoryDto.title,
            user: {
                id
            }
        }
        return await this.categoryRepository.save(newCategory)
    }


    async findAll(id: number) {
        return await this.categoryRepository.find({
            where: {
                user: {id},
            },
            relations: ['transactions']
        });
    }

    async findOne(id: number, userId: number) {
        const findCategory = await this.categoryRepository.findOne({
            where: {
                user: {
                    id: userId
                },
                id
            },
            relations: ['user', 'transactions']
        })

        // const findCategory = await userCategories.find(e => e.id === id)
        if (!findCategory) throw new BadRequestException('Category not found!')
        return findCategory
    }

    async update(id: number, userId: number, updateCategoryDto: UpdateCategoryDto) {
        const findCategory = await this.findCategoryFunc(id ,userId)

        if (!findCategory) throw new BadRequestException('Category not found!')
        return await this.categoryRepository.update(id, updateCategoryDto)
    }

    async remove(id: number, userId: number) {
        const findCategory = await this.findCategoryFunc(id ,userId)

        if (!findCategory) throw new BadRequestException('Category not found!')
        return await this.categoryRepository.delete(id);
    }

    async findCategoryFunc(id, userId) {
        return await this.categoryRepository.findOne({
            where: {
                user: {
                    id: userId
                },
                id
            }
        })
    }
}
