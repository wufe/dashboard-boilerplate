import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

export type CollectionStatusType = 'ok';

@Entity()
export class Collection{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    status: CollectionStatusType;

    @Column()
    metadata: string;

    @Column()
    issuer: string;

    @Column()
    createdAt: string;

    @Column()
    updatedAt: string;
    
}


// protected $fillable = [
//     "name",
//     "path",
//     "status",
//     "metadata",
//     "issuer"
// ];

// protected $hidden = [
//     "status",
//     "metadata",
//     "created_at",
//     "updated_at"
// ];