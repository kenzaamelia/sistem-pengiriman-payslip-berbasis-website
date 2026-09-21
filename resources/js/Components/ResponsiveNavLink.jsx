import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                `flex w-full items-start border-l-4 py-2 pe-4 ps-3 text-base font-medium transition duration-150 ease-in-out focus:outline-none ${
                    active
                        ? 'border-[#2E7D52] bg-[#EAF4EE] text-[#215D3D] focus:border-[#2E7D52] focus:bg-[#EAF4EE] focus:text-[#215D3D]'
                        : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus:border-slate-300 focus:bg-slate-50 focus:text-slate-800'
                } ` + className
            }
        >
            {children}
        </Link>
    );
}