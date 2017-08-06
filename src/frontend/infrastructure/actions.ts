export type Action<TPayload = any> = {
    type: string;
    payload: TPayload;
    [key: string]: any;
};