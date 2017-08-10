import * as Moment from 'moment';

export class UserModel{

    constructor(options?: {
        id?: number;
        username?: string,
        email?: string,
        password?: string
    }) {
        if(options){
            const {
                id,
                username,
                email,
                password
            } = options;
            this.id = id;
            this.username = username;
            this.email = email;
            this.password = password;
            this.createdAt = Moment().format()
        }
    }

    id: number;

    username: string;

    email: string;

    password: string;
    
    createdAt: string;

    updatedAt: string;

}