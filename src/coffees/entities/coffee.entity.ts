import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity() // sql table === 'coffee'
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  description: string;

  @Column()
  brand: string;

  @JoinTable() // 👈 Join the 2 tables - only the OWNER-side does this
  @ManyToMany(
    type => Flavor,
    flavor => flavor.coffees, // what is "coffee" within the Flavor Entity
    { cascade: true },
  ) //  👈 Cascade all the way down
  flavors: Flavor[];

  @Column({ default: 0 })
  recommendations: number;
}
