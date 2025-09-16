'use client';

import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function PatchModal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop (fundo escurecido)
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose} // Fecha o modal se clicar fora da janela
    >
      {/* Janela do Modal */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 z-50 w-full max-w-lg"
        onClick={(event) => event.stopPropagation()} // Previne que o clique dentro da janela feche o modal
      >
        {/* Botão de fechar no canto superior direito */}
        <button 
          onClick={onClose} 
          className="float-right font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          X
        </button>
        {/* Conteúdo do modal*/}
        {children}
      </div>
    </div>
  );
}