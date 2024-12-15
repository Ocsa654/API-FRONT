'use client'

import { FaTimes, FaMusic } from 'react-icons/fa'

interface VerCancionProps {
    cancion: Cancion
    onClose: () => void
}

interface Cancion {
    id: number
    title: string
    artist: string
    album: string
    duration: number
    file_path: string
    cover_art_url: string | null
}

export default function VerCancion({ cancion, onClose }: VerCancionProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-white">Detalles de la Canción</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex flex-col items-center mb-6">
                        {cancion.cover_art_url ? (
                            <img
                                src={cancion.cover_art_url}
                                alt={`Portada de ${cancion.title}`}
                                className="w-32 h-32 rounded-full object-cover mb-2"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                <FaMusic className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                        <h3 className="text-lg font-semibold text-white">{cancion.title}</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white">Artista</label>
                            <p className="mt-1 text-white">{cancion.artist}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white">Álbum</label>
                            <p className="mt-1 text-white">{cancion.album}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white">Duración</label>
                            <p className="mt-1 text-white">{Math.floor(cancion.duration / 60)}:{(cancion.duration % 60).toString().padStart(2, '0')}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-700 rounded-b-lg">
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

