import { compareSync, hashSync } from "bcryptjs";
import { environment } from "server/infrastructure/environment";

export const cryptPassword: (plain: string) => string =
    (plain) => {
        return hashSync(plain, environment.authentication.bcrypt.rounds);
    };

export const verifyPassword: (plain: string, hash: string) => boolean =
    (plain, hash) => {
        return compareSync(plain, hash);
    };