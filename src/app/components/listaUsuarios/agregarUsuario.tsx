'use client'

import { useState, useRef } from 'react'
import { FaTimes, FaUser } from 'react-icons/fa'
import Swal from 'sweetalert2'

interface AgregarUsuarioProps {
    onClose: () => void
    onAdd: () => void
}

interface NuevoUsuario {
    nombre: string
    apellido: string
    correo_electronico: string
    fecha_nacimiento: string
    contraseña: string
}

export default function AgregarUsuario({ onClose, onAdd }: AgregarUsuarioProps) {
    const [formData, setFormData] = useState<NuevoUsuario>({
        nombre: '',
        apellido: '',
        correo_electronico: '',
        fecha_nacimiento: '',
        contraseña: ''
    })
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formDataToSend = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value)
        })

        if (fileInputRef.current?.files?.[0]) {
            formDataToSend.append('imagen_perfil', fileInputRef.current.files[0])
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formDataToSend
            })
            if (!response.ok) throw new Error('Error al crear usuario')

            // Show success alert
            await Swal.fire({
                icon: 'success',
                title: '¡Usuario agregado con éxito!',
                showConfirmButton: false,
                timer: 1500
            })

            onAdd()
            onClose()
        } catch (error) {
            console.error('Error al crear usuario:', error)
            // Show error alert
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo crear el usuario. Por favor, inténtelo de nuevo.',
            })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Agregar Usuario</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-4">
                        <div className="flex flex-col items-center">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Vista previa"
                                    className="w-24 h-24 rounded-full object-cover mb-2"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                    <FaUser className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Subir foto de perfil
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Apellido</label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Correo Electrónico</label>
                            <input
                                type="email"
                                name="correo_electronico"
                                value={formData.correo_electronico}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Contraseña</label>
                            <input
                                type="password"
                                name="contraseña"
                                value={formData.contraseña}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                                minLength={8}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                value={formData.fecha_nacimiento}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-b-lg flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

