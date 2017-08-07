import {development as dev, production as prod} from 'configuration/settings';

import {Environment, EnvironmentKind, EnvironmentKindDevelopment, EnvironmentKindProduction} from 'server/framework/types';

export const environmentKindProduction: EnvironmentKindProduction = 'production';
export const environmentKindDevelopment: EnvironmentKindDevelopment = 'development';

const getEnvironment: (kind: EnvironmentKind) => Environment =
    (kind) => {
        return kind == environmentKindDevelopment ?
                dev : prod;
    };

export const env: EnvironmentKind =
    process.env.NODE_ENV == 'production' ||
    process.env.NODE_ENV == 'prod' ||
    process.env.ENV == 'production' ||
    process.env.ENV == 'prod' ?
    environmentKindProduction : environmentKindDevelopment;

export const environment =
    env == environmentKindProduction ? 
        getEnvironment(environmentKindProduction) :
        getEnvironment(environmentKindDevelopment);