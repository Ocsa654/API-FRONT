'use client'

import { withAuth } from '@/app/components/auth/withAuth'
import { Header } from '@/app/components/headers/headerDs'
import { useAuth } from '@/app/hooks/useAuth'
import { FaUsers, FaMusic } from 'react-icons/fa'
import Link from 'next/link'

function DashboardPage() {
    const { user } = useAuth()

    return (
        <div className="min-h-screen relative bg-gray-900 text-white"> {/* Dark background */}
            {/* Background Image with reduced opacity */}
            <img
                src="/weaves.jpg"
                alt="Background"
                className="absolute inset-0 object-cover opacity-20 z-[-1]"
            />

            <Header />
            <main className="max-w-7xl mx-auto p-6 space-y-8"> {/* Improved main section */}
                <section className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                        {user && (
                            <div>
                                <p className="font-medium">
                                    Bienvenido, {user.nombre} {user.apellido}
                                </p>
                                <p>{user.correo_electronico}</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Responsive grid */}
                    <Link
                        href="/usuarios"
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <FaUsers className="text-xl" />
                        <span>Administrar Usuarios</span>
                    </Link>
                    <Link
                        href="/musica"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full flex items-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <FaMusic className="text-xl" />
                        <span>Administrar musica</span>
                    </Link>
                </section>
            </main>
        </div>
    )
}

export default withAuth(DashboardPage)