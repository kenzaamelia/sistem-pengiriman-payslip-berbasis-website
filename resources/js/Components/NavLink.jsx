import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-[#2E7D52] text-[#14202B] focus:border-[#2E7D52]'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 focus:border-slate-300 focus:text-slate-700') +
                className
            }
        >
            {children}
        </Link>
    );
}