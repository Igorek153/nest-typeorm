import {Column, CreateDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {Category} from "../../category/entities/category.entity";
import {Transaction} from "../../transaction/entities/transaction.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string

    @Column()
    password: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Category,
        (c) => c.user, {
            onDelete: 'CASCADE'
        }
    )
    categories: Category[]

    @OneToMany(() => Transaction,
        (t) => t.user, {
        onDelete: 'CASCADE'
        }
    )
    transactions: Transaction[]
}
