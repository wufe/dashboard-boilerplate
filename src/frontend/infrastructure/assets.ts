export const IMAGE_BRANDLOGO = 'image.brandLogo';

export type Assets = {
    ['image.brandLogo']?: string;
};

export const assets: Assets = {
    [IMAGE_BRANDLOGO]: 'http://acmelogos.com/images/logo-8.svg'
};

export const getAsset: (key: keyof Assets) => string =
    key => assets[key];