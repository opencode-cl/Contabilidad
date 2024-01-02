export interface IToast{
    id: number,
    message:string,
    duration:number,
    type: 'warning' | 'success' | 'info' | 'danger'| 'confirmation';
    onConfirm?: () => void; 
}

export const confirmationToast = (message: string, onConfirm: () => void): IToast => {
  return {
    id: Date.now(),
    message: message,
    duration: 0, // Duración infinita o hasta que el usuario confirme/cancele
    type: 'confirmation',
    onConfirm: onConfirm, 
  };
};

export const defaultSuccessToast: IToast = {
    id: Date.now(),
    message: "Operación realizada con éxito.",
    duration: 3000,
    type: 'success'
}

export const defaultDangerToast: IToast = {
    id: Date.now(),
    message: "Ha ocurrido un error en la operación.",
    duration: 3000,
    type: 'danger'
}

export const dangerToast = (message: string): IToast => {
    return {
        id: Date.now(),
        message: message,
        duration: 3000,
        type: 'danger'
    };
};