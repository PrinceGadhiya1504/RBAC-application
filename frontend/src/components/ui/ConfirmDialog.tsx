import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "default" | "outline" | "secondary";
    isLoading?: boolean;
    onConfirm: () => void;
}

export default function ConfirmDialog({
    open,
    onOpenChange,
    title = "Confirm Action",
    description = "Are you sure you want to proceed? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "destructive",
    isLoading = false,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                        className="cursor-pointer"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={variant}
                        size="sm"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className="cursor-pointer"
                    >
                        {isLoading ? "Deleting..." : confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
