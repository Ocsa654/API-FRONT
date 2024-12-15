// Ruta: C:\Users\ke451\OneDrive\Documentos\APIS-Consumo\src\app\components\img\imgbackground.tsx

import Image from 'next/image';

export default function ImgBackground() {
    return (
        <div className="relative w-full h-64">
            <Image
                src="/building-5506466_1920.jpg"
                alt="Fondo de agradecimiento"
                layout="fill"
                objectFit="cover"
                quality={100}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <h1 className="text-3xl font-light text-white">
                    Gracias por visitar nuestra aplicación
                </h1>
            </div>
        </div>
    );
}
