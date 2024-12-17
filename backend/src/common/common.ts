export type StandardResponse<T>  = {
    success: Boolean;
    data: T;
}

export type UserInfo  = {
    user_id: string;
    email: string;
    fullname: string;
}   
