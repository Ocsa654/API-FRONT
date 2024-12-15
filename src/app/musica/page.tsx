'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/app/components/headers/headerDs'
import { withAuth } from '@/app/components/auth/withAuth'
import {
    FaSearch, FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight,
    FaEye, FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa'
import VerCancion from '@/app/components/listacanciones/vercancion'
import EditarCancion from '@/app/components/listacanciones/editarcancion'
import AgregarCancion from '@/app/components/listacanciones/agregarcancion'
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

function MusicaPage() {
    const [canciones, setCanciones] = useState<Cancion[]>([])
    const [busqueda, setBusqueda] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [cancionesPorPagina, setCancionesPorPagina] = useState(10)
    const [cancionSeleccionada, setCancionSeleccionada] = useState<Cancion | null>(null)
    const [mostrarVerCancion, setMostrarVerCancion] = useState(false)
    const [mostrarEditarCancion, setMostrarEditarCancion] = useState(false)
    const [mostrarAgregarCancion, setMostrarAgregarCancion] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCanciones = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                throw new Error('No se encontró el token de autenticación')
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/musica`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error al obtener canciones')
            }

            const data = await response.json()
            setCanciones(data)
        } catch (error) {
            console.error('Error:', error)
            setError(error instanceof Error ? error.message : 'Error desconocido al obtener canciones')
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las canciones. Por favor, intente de nuevo más tarde.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCanciones()
    }, [])

    const handleEliminarCancion = async (cancion: Cancion) => {
        try {
            const result = await MySwal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar!',
                cancelButtonText: 'Cancelar'
            })

            if (result.isConfirmed) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/musica/${cancion.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Error al eliminar la canción')
                }

                await fetchCanciones() // Recargar la lista después de eliminar
                MySwal.fire(
                    'Eliminada!',
                    'La canción ha sido eliminada.',
                    'success'
                )
            }
        } catch (error) {
            console.error('Error:', error)
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la canción. Por favor, intente de nuevo.',
            })
        }
    }

    const cancionesFiltradas = canciones.filter(cancion =>
        cancion.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        cancion.artist.toLowerCase().includes(busqueda.toLowerCase()) ||
        cancion.album.toLowerCase().includes(busqueda.toLowerCase())
    )

    const indexOfLastCancion = paginaActual * cancionesPorPagina
    const indexOfFirstCancion = indexOfLastCancion - cancionesPorPagina
    const cancionesActuales = cancionesFiltradas.slice(indexOfFirstCancion, indexOfLastCancion)
    const totalPaginas = Math.ceil(cancionesFiltradas.length / cancionesPorPagina)

    const cambiarPagina = (numeroPagina: number) => setPaginaActual(numeroPagina)
    const irAPrimeraPagina = () => setPaginaActual(1)
    const irAUltimaPagina = () => setPaginaActual(totalPaginas)

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <div className="p-4 flex justify-between items-center border-b border-gray-700">
                        <h1 className="text-2xl font-bold">Música</h1>
                        <button
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded flex items-center"
                            onClick={() => setMostrarAgregarCancion(true)}
                        >
                            <FaPlus className="mr-2" />
                            Agregar Canción
                        </button>
                    </div>
                    <div className="p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center flex-1 mr-4">
                                <FaSearch className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Buscar canciones..."
                                    className="w-full p-2 border rounded-md bg-gray-700 text-white"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                            <select
                                className="p-2 border rounded-md bg-gray-700 text-white"
                                value={cancionesPorPagina}
                                onChange={(e) => setCancionesPorPagina(Number(e.target.value))}
                            >
                                <option value={5}>5 por página</option>
                                <option value={10}>10 por página</option>
                                <option value={20}>20 por página</option>
                                <option value={cancionesFiltradas.length}>Mostrar todas</option>
                            </select>
                        </div>
                        {isLoading ? (
                            <p className="text-white">Cargando canciones...</p>
                        ) : error ? (
                            <p className="text-red-500">Error: {error}</p>
                        ) : (
                            <>
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-700 text-gray-200 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 text-left">Título</th>
                                            <th className="py-3 px-6 text-left">Artista</th>
                                            <th className="py-3 px-6 text-left">Álbum</th>
                                            <th className="py-3 px-6 text-center">Duración</th>
                                            <th className="py-3 px-6 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-200 text-sm font-light">
                                        {cancionesActuales.map((cancion) => (
                                            <tr key={cancion.id} className="border-b border-gray-700 hover:bg-gray-600">
                                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="mr-2">
                                                            {cancion.cover_art_url ? (
                                                                <img
                                                                    className="w-12 h-12 rounded-full object-cover"
                                                                    src={cancion.cover_art_url}
                                                                    alt={`Portada de ${cancion.title}`}
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                                                                    <span className="text-gray-200 font-medium">{cancion.title[0]}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span>{cancion.title}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6 text-left">{cancion.artist}</td>
                                                <td className="py-3 px-6 text-left">{cancion.album}</td>
                                                <td className="py-3 px-6 text-center">{Math.floor(cancion.duration / 60)}:{(cancion.duration % 60).toString().padStart(2, '0')}</td>
                                                <td className="py-3 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center"
                                                            onClick={() => {
                                                                setCancionSeleccionada(cancion)
                                                                setMostrarVerCancion(true)
                                                            }}
                                                        >
                                                            <FaEye className="mr-1" />
                                                            Ver
                                                        </button>
                                                        <button
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs flex items-center"
                                                            onClick={() => {
                                                                setCancionSeleccionada(cancion)
                                                                setMostrarEditarCancion(true)
                                                            }}
                                                        >
                                                            <FaEdit className="mr-1" />
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center"
                                                            onClick={() => handleEliminarCancion(cancion)}
                                                        >
                                                            <FaTrash className="mr-1" />
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-between items-center mt-4">
                                    <div>
                                        Mostrando {indexOfFirstCancion + 1} - {Math.min(indexOfLastCancion, cancionesFiltradas.length)} de {cancionesFiltradas.length} canciones
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={irAPrimeraPagina}
                                            disabled={paginaActual === 1}
                                            className="px-3 py-1 border border-orange-500 rounded-md disabled:opacity-50 bg-transparent hover:bg-orange-500 hover:text-white text-orange-500"
                                        >
                                            <FaAngleDoubleLeft />
                                        </button>
                                        <button
                                            onClick={() => cambiarPagina(paginaActual - 1)}
                                            disabled={paginaActual === 1}
                                            className="px-3 py-1 border border-orange-500 rounded-md disabled:opacity-50 bg-transparent hover:bg-orange-500 hover:text-white text-orange-500"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        {[...Array(totalPaginas)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => cambiarPagina(index + 1)}
                                                className={`px-3 py-1 border border-orange-500 rounded-md ${paginaActual === index + 1 ? 'bg-orange-500 text-white' : 'bg-transparent hover:bg-orange-500 hover:text-white text-orange-500'}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => cambiarPagina(paginaActual + 1)}
                                            disabled={paginaActual === totalPaginas}
                                            className="px-3 py-1 border border-orange-500 rounded-md disabled:opacity-50 bg-transparent hover:bg-orange-500 hover:text-white text-orange-500"
                                        >
                                            <FaChevronRight />
                                        </button>
                                        <button
                                            onClick={irAUltimaPagina}
                                            disabled={paginaActual === totalPaginas}
                                            className="px-3 py-1 border border-orange-500 rounded-md disabled:opacity-50 bg-transparent hover:bg-orange-500 hover:text-white text-orange-500"
                                        >
                                            <FaAngleDoubleRight />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
            {mostrarVerCancion && cancionSeleccionada && (
                <VerCancion
                    cancion={cancionSeleccionada}
                    onClose={() => {
                        setMostrarVerCancion(false)
                        setCancionSeleccionada(null)
                    }}
                />
            )}
            {mostrarEditarCancion && cancionSeleccionada && (
                <EditarCancion
                    cancion={cancionSeleccionada}
                    onClose={() => {
                        setMostrarEditarCancion(false)
                        setCancionSeleccionada(null)
                    }}
                    onUpdate={async () => {
                        await fetchCanciones()
                        setMostrarEditarCancion(false)
                        setCancionSeleccionada(null)
                    }}
                />
            )}
            {mostrarAgregarCancion && (
                <AgregarCancion
                    onClose={() => setMostrarAgregarCancion(false)}
                    onAdd={async () => {
                        await fetchCanciones()
                        setMostrarAgregarCancion(false)
                    }}
                />
            )}
        </div>
    )
}

export default withAuth(MusicaPage)
