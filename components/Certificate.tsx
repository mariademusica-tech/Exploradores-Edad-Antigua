import React from 'react';
import { PlayerState } from '../types';
import { Aristoteles } from './Aristoteles';

interface CertificateProps {
  player: PlayerState;
  onRestart: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ player, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-lab-bg animate-fade-in">
      <div className="bg-white border-8 border-pixar-yellow rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden text-center">
        {/* Background decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-pixar-red rounded-full opacity-10 -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-pixar-orange rounded-full opacity-10 translate-x-10 translate-y-10"></div>

        <div className="flex justify-center mb-6">
           <Aristoteles emotion="excited" className="w-32 h-32" />
        </div>

        <h1 className="text-4xl font-extrabold text-pixar-orange mb-2 uppercase tracking-wide">
          Certificado de Excelencia
        </h1>
        <h2 className="text-xl font-bold text-gray-500 mb-6">
          Otorgado a
        </h2>

        <div className="border-b-4 border-dashed border-gray-300 mb-8 mx-auto w-3/4">
          <p className="text-3xl font-bold text-pixar-red pb-2 font-sans italic">
            {player.name || "Explorador Anónimo"}
          </p>
        </div>

        <p className="text-lg text-gray-700 mb-8">
          Por haber completado con éxito todas las misiones y demostrar un conocimiento legendario como:
        </p>

        <div className="bg-pixar-yellow text-white font-bold py-3 px-6 rounded-full inline-block text-xl shadow-lg transform rotate-[-2deg] mb-8">
          EXPLORADOR EXPERTO DE LA EDAD ANTIGUA
        </div>

        <div className="flex justify-between items-center text-sm text-gray-400 mt-4 border-t pt-4">
            <span>Fecha: {new Date().toLocaleDateString()}</span>
            <span>Firmado: Aristóteles 🤖</span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 bg-pixar-coral hover:bg-red-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 text-xl"
      >
        Volver a Jugar
      </button>
    </div>
  );
};