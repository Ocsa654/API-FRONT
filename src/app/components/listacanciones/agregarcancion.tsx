'use client'

import { useState, useRef } from 'react'
import { FaTimes, FaMusic } from 'react-icons/fa'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

interface Cancion {
    id: number
    title: string
    artist: string
    album: string
    duration: number
    file_path: string
    cover_art_url: string | null
}

interface AgregarCancionProps {
    onClose: () => void
    onAdd: (newCancion: Cancion) => void
}

interface NuevaCancion {
    title: string
    artist: string
    album: string
    duration: number
    file_path?: string
    cover_art_url?: string | null
}

export default function AgregarCancion({ onClose, onAdd }: AgregarCancionProps) {
    const [formData, setFormData] = useState<NuevaCancion>({
        title: '',
        artist: '',
        album: '',
        duration: 0,
        file_path: '',
        cover_art_url: null
    })
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    //const audioInputRef = useRef<HTMLInputElement>(null) //Removed

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formDataToSend = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formDataToSend.append(key, value.toString())
            }
        })

        if (fileInputRef.current?.files?.[0]) {
            formDataToSend.append('cover_art', fileInputRef.current.files[0])
        }

    

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/musica`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formDataToSend
            })

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Error al agregar canción: ${response.status} ${response.statusText}\nDetalles: ${errorBody}`);
            }

            const nuevaCancion = await response.json()

            onAdd(nuevaCancion)
            MySwal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Canción agregada correctamente',
            })
        } catch (error) {
            console.error('Error al agregar canción:', error)
            let errorMessage = 'No se pudo agregar la canción. Por favor, intente de nuevo.'
            if (error instanceof Error) {
                errorMessage += `\nDetalles: ${error.message}`
            }
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
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
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-white">Agregar Nueva Canción</h2>
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
                                    className="w-32 h-32 rounded-full object-cover mb-2"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                    <FaMusic className="w-16 h-16 text-gray-400" />
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
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2"
                            >
                                Subir portada
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white">Título</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white">Artista</label>
                            <input
                                type="text"
                                name="artist"
                                value={formData.artist}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white">Álbum</label>
                            <input
                                type="text"
                                name="album"
                                value={formData.album}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white">Duración (segundos)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                            />
                        </div>
                        {/*Removed audio input*/}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-600">Archivo de Audio</label>
                            <input
                                type="file"
                                ref={audioInputRef}
                                accept="audio/*"
                                className="mt-1 block w-full"
                                required
                            />
                        </div> */}
                    </div>
                    <div className="p-4 bg-gray-700 rounded-b-lg flex gap-4">
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
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

