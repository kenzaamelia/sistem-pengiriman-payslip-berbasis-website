export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-[#2C5578] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-colors duration-150 hover:bg-[#1F3E59] focus:outline-none focus:ring-2 focus:ring-[#2C5578] focus:ring-offset-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}