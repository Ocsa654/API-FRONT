'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaUser } from 'react-icons/fa'
import { format } from 'date-fns'

interface VerUsuarioProps {
    usuarioId: number
    onClose: () => void
}

interface Usuario {
    id: number
    nombre: string
    apellido: string
    correo_electronico: string
    fecha_nacimiento: string
    url_imagenPerfil: string | null
}

export default function VerUsuario({ usuarioId, onClose }: VerUsuarioProps) {
    const [usuario, setUsuario] = useState<Usuario | null>(null)

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuarioId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                })
                if (!response.ok) throw new Error('Error al obtener usuario')
                const data = await response.json()
                setUsuario(data)
            } catch (error) {
                console.error('Error:', error)
            }
        }

        fetchUsuario()
    }, [usuarioId])

    if (!usuario) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Detalles del Usuario</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex flex-col items-center mb-6">
                        {usuario.url_imagenPerfil ? (
                            <img
                                src={usuario.url_imagenPerfil}
                                alt={`${usuario.nombre} ${usuario.apellido}`}
                                className="w-24 h-24 rounded-full object-cover mb-2"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                <FaUser className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                        <h3 className="text-lg font-semibold">{usuario.nombre} {usuario.apellido}</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Correo Electrónico</label>
                            <p className="mt-1">{usuario.correo_electronico}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                            <p className="mt-1">{format(new Date(usuario.fecha_nacimiento), 'dd/MM/yyyy')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

