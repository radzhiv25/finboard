import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TransactionForm } from '@/components/TransactionForm';

interface TransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function TransactionDialog({ open, onOpenChange, onSuccess }: TransactionDialogProps) {
    const handleSuccess = () => {
        // Close dialog immediately on success
        onOpenChange(false);
        onSuccess?.();
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                    <DialogDescription>
                        Record a new financial transaction with AI-powered category prediction
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full">
                    <TransactionForm
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                        showCard={false}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
