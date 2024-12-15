'use client'

import { useState, useEffect, useRef } from 'react'
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/app/hooks/useAuth'

export function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { user, logout } = useAuth()
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <header className="bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    {user && (
                        <div className="flex items-center relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="focus:outline-none" // Elimina el contorno azul al enfocar con el teclado.
                                aria-label="Abrir opciones de usuario"
                            >
                                {user.url_imagenPerfil ? (
                                    <img
                                        src={user.url_imagenPerfil}
                                        alt="Foto de perfil"
                                        className="w-10 h-10 rounded-full cursor-pointer"
                                    />
                                ) : (
                                    <FaUserCircle className="w-10 h-10 text-gray-400 cursor-pointer" />
                                )}
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 shadow-md rounded-md"> {/* Ajustes de estilo */}
                                    <button
                                        onClick={logout}
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
                                    >
                                        <FaSignOutAlt className="mr-2 inline-block" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}

                            <div className="ml-4"> {/* Espacio entre la imagen y el nombre */}
                                <span className="font-semibold text-gray-300">{user.nombre} {user.apellido}</span>
                                <span className="text-sm text-gray-400">{user.correo_electronico}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}