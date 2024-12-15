import { FaSignInAlt } from 'react-icons/fa';

export default function HeaderPrincipal() {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Bienvenido</h1>
                <a
                    href="/login"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                    <FaSignInAlt className="mr-2" />
                    Login
                </a>
            </div>
            <div className="w-full h-px bg-blue-500"></div>
        </header>
    );
}
