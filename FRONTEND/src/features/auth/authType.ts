
type AT={
    accessToken:string
}
export type MessageResponse = {
    success: boolean;
    message: AT;
};

export interface errTypo{
    data:{
        message:string
    }
}