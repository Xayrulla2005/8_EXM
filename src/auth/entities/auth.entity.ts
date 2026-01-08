import { Column, Entity } from "typeorm";

@Entity('user')
export class User {
  
  @Column()
  id:number

  @Column({unique:true})
  email:string

  @Column()
  username:string

  @Column()
  password:string

  @Column()
  createdAt:number
}
