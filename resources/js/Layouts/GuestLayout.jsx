import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#F6F8F7] pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="text-2xl" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden border-l-4 border-l-[#2C5578] bg-white px-6 py-4 shadow-sm sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}