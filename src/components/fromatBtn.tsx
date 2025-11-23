interface FormatButtonProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    onClick: () => void;
}

function FormatButton({ icon: Icon, label,onClick }: FormatButtonProps) {
    return (
        <button
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            onClick={onClick}
            title={label}
        >
            <Icon size={18} className="text-gray-700" />
        </button>
    );
}

export default FormatButton