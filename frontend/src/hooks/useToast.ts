import { useSnackbar } from "notistack";

export function useToast() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    return {
        success: (message: string) => {
            return enqueueSnackbar(message, {
                variant: "success",
                preventDuplicate: true,
            });
        },
        error: (error: unknown, fallbackMessage = "Operation failed.") => {
            const message =
                (error as any)?.response?.data?.message ||
                (error as any)?.message ||
                (typeof error === "string" ? error : fallbackMessage);

            return enqueueSnackbar(message, {
                variant: "error",
                preventDuplicate: true,
            });
        },
        warning: (message: string) => {
            return enqueueSnackbar(message, {
                variant: "warning",
                preventDuplicate: true,
            });
        },
        info: (message: string) => {
            return enqueueSnackbar(message, {
                variant: "info",
                preventDuplicate: true,
            });
        },
        close: closeSnackbar,
    };
}
