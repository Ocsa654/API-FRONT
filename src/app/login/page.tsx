"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

export default function LoginPage() {
    const [correoElectronico, setCorreoElectronico] = useState("");
    const [contraseña, setContraseña] = useState("");
    const { login, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(correoElectronico, contraseña);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8"> {/* Changed background to black */}
            <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
                    Bienvenido
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="correoElectronico" className="block text-gray-700 font-bold mb-2">Correo Electrónico</label> {/* Added label */}
                        <input
                            id="correoElectronico"
                            name="correoElectronico"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Tu correo electrónico"
                            value={correoElectronico}
                            onChange={(e) => setCorreoElectronico(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="contraseña" className="block text-gray-700 font-bold mb-2">Contraseña</label> {/* Added label */}
                        <input
                            id="contraseña"
                            name="contraseña"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Tu contraseña"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Iniciar Sesión
                    </button>
                    {error && (
                        <div className="text-red-600 text-center mt-2 font-medium">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}