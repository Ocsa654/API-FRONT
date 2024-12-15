'use client'

import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaUser } from 'react-icons/fa'
import { format, parse } from 'date-fns'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

interface EditarUsuarioProps {
    usuarioId: number
    onClose: () => void
    onUpdate: () => void
}

interface Usuario {
    id: number
    nombre: string
    apellido: string
    correo_electronico: string
    fecha_nacimiento: string
    url_imagenPerfil: string | null
}

export default function EditarUsuario({ usuarioId, onClose, onUpdate }: EditarUsuarioProps) {
    const [formData, setFormData] = useState<Omit<Usuario, 'id'>>({
        nombre: '',
        apellido: '',
        correo_electronico: '',
        fecha_nacimiento: '',
        url_imagenPerfil: null
    })
    const [nuevaContraseña, setNuevaContraseña] = useState('')
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

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
                setFormData({
                    ...data,
                    fecha_nacimiento: format(new Date(data.fecha_nacimiento), 'yyyy-MM-dd')
                })
                setPreviewImage(data.url_imagenPerfil)
            } catch (error) {
                console.error('Error:', error)
                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar la información del usuario. Por favor, intente de nuevo.',
                })
            }
        }

        fetchUsuario()
    }, [usuarioId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formDataToSend = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'fecha_nacimiento') {
                    const parsedDate = parse(value, 'yyyy-MM-dd', new Date())
                    formDataToSend.append(key, format(parsedDate, 'yyyy-MM-dd'))
                } else {
                    formDataToSend.append(key, value.toString())
                }
            }
        })

        if (nuevaContraseña) {
            formDataToSend.append('contraseña', nuevaContraseña)
        }

        if (fileInputRef.current?.files?.[0]) {
            formDataToSend.append('imagen_perfil', fileInputRef.current.files[0])
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${usuarioId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'X-HTTP-Method-Override': 'PUT',
                },
                body: formDataToSend
            })
            if (!response.ok) throw new Error('Error al actualizar usuario')
            if (response.ok) {
                const updatedUser = await response.json();
                setFormData(prev => ({
                    ...prev,
                    url_imagenPerfil: updatedUser.url_imagenPerfil
                }));
                setPreviewImage(updatedUser.url_imagenPerfil);
            }
            onUpdate()
            onClose()
            MySwal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Usuario actualizado correctamente',
            })
        } catch (error) {
            console.error('Error al actualizar usuario:', error)
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el usuario. Por favor, intente de nuevo.',
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
                    <h2 className="text-xl font-bold">Editar Usuario</h2>
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
                                Cambiar foto de perfil
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
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Nueva Contraseña (opcional)</label>
                            <input
                                type="password"
                                value={nuevaContraseña}
                                onChange={(e) => setNuevaContraseña(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                minLength={8}
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
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

