'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/app/components/headers/headerDs'
import { withAuth } from '@/app/components/auth/withAuth'
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaChevronLeft, FaChevronRight, FaEye, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import VerUsuario from '@/app/components/listaUsuarios/verusuario'
import EditarUsuario from '@/app/components/listaUsuarios/editarUsuario'
import AgregarUsuario from '@/app/components/listaUsuarios/agregarUsuario'
import { format } from 'date-fns'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

interface Usuario {
    id: number
    nombre: string
    apellido: string
    correo_electronico: string
    fecha_nacimiento: string
    url_imagenPerfil: string | null
}

function UsuariosPage() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [busqueda, setBusqueda] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)
    const [usuariosPorPagina, setUsuariosPorPagina] = useState(10)
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(null)
    const [mostrarVerUsuario, setMostrarVerUsuario] = useState(false)
    const [mostrarEditarUsuario, setMostrarEditarUsuario] = useState(false)
    const [mostrarAgregarUsuario, setMostrarAgregarUsuario] = useState(false)

    useEffect(() => {
        fetchUsuarios()
    }, [])

    const fetchUsuarios = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
            if (!response.ok) throw new Error('Error al obtener usuarios')
            const data = await response.json()
            setUsuarios(data)
        } catch (error) {
            console.error('Error:', error)
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los usuarios. Por favor, intente de nuevo más tarde.',
            })
        }
    }

    const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.correo_electronico.toLowerCase().includes(busqueda.toLowerCase())
    )

    const indexOfLastUsuario = paginaActual * usuariosPorPagina
    const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina
    const usuariosActuales = usuariosFiltrados.slice(indexOfFirstUsuario, indexOfLastUsuario)

    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina)

    const cambiarPagina = (numeroPagina: number) => {
        setPaginaActual(numeroPagina)
    }

    const irAPrimeraPagina = () => setPaginaActual(1)
    const irAUltimaPagina = () => setPaginaActual(totalPaginas)

    const handleVerUsuario = (id: number) => {
        setUsuarioSeleccionado(id)
        setMostrarVerUsuario(true)
    }

    const handleEditarUsuario = (id: number) => {
        setUsuarioSeleccionado(id)
        setMostrarEditarUsuario(true)
    }

    const handleEliminarUsuario = async (id: number) => {
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
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                    }
                })
                if (!response.ok) throw new Error('Error al eliminar usuario')
                await fetchUsuarios() // Recargar la lista de usuarios
                MySwal.fire(
                    'Eliminado!',
                    'El usuario ha sido eliminado.',
                    'success'
                )
            } catch (error) {
                console.error('Error:', error)
                MySwal.fire(
                    'Error',
                    'No se pudo eliminar el usuario. Por favor, intente de nuevo.',
                    'error'
                )
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-blue-400">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {/* Contenido principal */}
                <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
                    <div className="p-4 flex justify-between items-center border-b border-gray-700">
                        <h1 className="text-2xl font-bold text-blue-400">Usuarios</h1>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
                            onClick={() => setMostrarAgregarUsuario(true)}
                        >
                            <FaUserPlus className="mr-2" />
                            Agregar Usuario
                        </button>
                    </div>
                    <div className="p-4">
                        <div className="mb-4 flex flex-wrap items-center justify-between">
                            <div className="flex items-center flex-1 mr-0 md:mr-4 mb-2 md:mb-0 w-full md:w-auto">
                                <FaSearch className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Buscar usuarios..."
                                    className="w-full p-2 border rounded-md bg-gray-700 text-blue-200"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                />
                            </div>
                            <select
                                className="p-2 border rounded-md bg-gray-700 text-blue-200 w-full md:w-auto"
                                value={usuariosPorPagina}
                                onChange={(e) => setUsuariosPorPagina(Number(e.target.value))}
                            >
                                <option value={5}>5 por página</option>
                                <option value={10}>10 por página</option>
                                <option value={20}>20 por página</option>
                                <option value={usuariosFiltrados.length}>Mostrar todos</option>
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-700 text-blue-300 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Nombre</th>
                                        <th className="py-3 px-6 text-left">Correo Electrónico</th>
                                        <th className="py-3 px-6 text-left">Fecha de Nacimiento</th>
                                        <th className="py-3 px-6 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="text-blue-200 text-sm font-light">
                                    {usuariosActuales.map((usuario) => (
                                        <tr key={usuario.id} className="border-b border-gray-700 hover:bg-gray-600">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="mr-2">
                                                        {usuario.url_imagenPerfil ? (
                                                            <img className="w-8 h-8 rounded-full" src={usuario.url_imagenPerfil} alt={`${usuario.nombre} ${usuario.apellido}`} />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                                                <span className="text-blue-200 font-medium">{usuario.nombre[0]}{usuario.apellido[0]}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span>{usuario.nombre} {usuario.apellido}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-left">{usuario.correo_electronico}</td>
                                            <td className="py-3 px-6 text-left">
                                                {format(new Date(usuario.fecha_nacimiento), 'dd/MM/yyyy')}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex flex-wrap items-center justify-center gap-2">
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center"
                                                        onClick={() => handleVerUsuario(usuario.id)}
                                                    >
                                                        <FaEye className="mr-1" />
                                                        Ver
                                                    </button>
                                                    <button
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs flex items-center"
                                                        onClick={() => handleEditarUsuario(usuario.id)}
                                                    >
                                                        <FaEdit className="mr-1" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center"
                                                        onClick={() => handleEliminarUsuario(usuario.id)}
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
                        </div>
                        <div className="flex flex-wrap justify-between items-center mt-4">
                            <div className="text-sm mb-2 md:mb-0">
                                Mostrando {indexOfFirstUsuario + 1} - {Math.min(indexOfLastUsuario, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={irAPrimeraPagina}
                                    disabled={paginaActual === 1}
                                    className="px-3 py-1 border border-blue-500 rounded-md disabled:opacity-50 bg-transparent hover:bg-blue-500 hover:text-white text-blue-500"
                                >
                                    <FaAngleDoubleLeft />
                                </button>
                                <button
                                    onClick={() => cambiarPagina(paginaActual - 1)}
                                    disabled={paginaActual === 1}
                                    className="px-3 py-1 border border-blue-500 rounded-md disabled:opacity-50 bg-transparent hover:bg-blue-500 hover:text-white text-blue-500"
                                >
                                    <FaChevronLeft />
                                </button>
                                {[...Array(totalPaginas)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => cambiarPagina(index + 1)}
                                        className={`px-3 py-1 border border-blue-500 rounded-md ${paginaActual === index + 1 ? 'bg-blue-500 text-white' : 'bg-transparent hover:bg-blue-500 hover:text-white text-blue-500'}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => cambiarPagina(paginaActual + 1)}
                                    disabled={paginaActual === totalPaginas}
                                    className="px-3 py-1 border border-blue-500 rounded-md disabled:opacity-50 bg-transparent hover:bg-blue-500 hover:text-white text-blue-500"
                                >
                                    <FaChevronRight />
                                </button>
                                <button
                                    onClick={irAUltimaPagina}
                                    disabled={paginaActual === totalPaginas}
                                    className="px-3 py-1 border border-blue-500 rounded-md disabled:opacity-50 bg-transparent hover:bg-blue-500 hover:text-white text-blue-500"
                                >
                                    <FaAngleDoubleRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {mostrarVerUsuario && usuarioSeleccionado && (
                <VerUsuario
                    usuarioId={usuarioSeleccionado}
                    onClose={() => setMostrarVerUsuario(false)}
                />
            )}
            {mostrarEditarUsuario && usuarioSeleccionado && (
                <EditarUsuario
                    usuarioId={usuarioSeleccionado}
                    onClose={() => setMostrarEditarUsuario(false)}
                    onUpdate={fetchUsuarios}
                />
            )}
            {mostrarAgregarUsuario && (
                <AgregarUsuario
                    onClose={() => setMostrarAgregarUsuario(false)}
                    onAdd={fetchUsuarios}
                />
            )}
        </div>
    )
}

export default withAuth(UsuariosPage)