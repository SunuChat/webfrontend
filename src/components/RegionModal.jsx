import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";

const RegionModal = ({ isOpen, onClose, regionData }) => {
  if (!regionData) return null;

  const {
    Region,
    Cas_confirmes,
    Morts,
    Maladie,
    Temperature_moy,
    Humidite_moy,
    Precipitations_tot,
    Densite_moustiques,
    Population,
    Vent_vit_moy,
    Densite,
    Acces_soins,
  } = regionData;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="relative z-50 max-w-lg w-full bg-white p-6 rounded-2xl shadow-xl">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <IoClose size={20} /> {/* Remplacé par react-icons */}
            </button>
            <Dialog.Title className="text-xl font-bold mb-2 text-gray-800">
              Détails pour {Region ?? "Région inconnue"}
            </Dialog.Title>
            <div className="text-gray-700 space-y-1">
              <p><strong>Maladie :</strong> {Maladie ?? "N/A"}</p>
              <p><strong>Cas confirmés :</strong> {Number(Cas_confirmes ?? 0).toLocaleString()}</p>
              <p><strong>Morts :</strong> {Number(Morts ?? 0).toLocaleString()}</p>
              <p><strong>Température moyenne :</strong> {Temperature_moy ?? "N/A"} °C</p>
              <p><strong>Humidité :</strong> {Humidite_moy ?? "N/A"} %</p>
              <p><strong>Précipitations :</strong> {Precipitations_tot ?? "N/A"} mm</p>
              <p><strong>Vitesse du vent :</strong> {Vent_vit_moy ?? "N/A"} m/s</p>
              <p><strong>Densité moustiques :</strong> {Densite_moustiques ?? "N/A"}</p>
              <p><strong>Population :</strong> {Number(Population ?? 0).toLocaleString()}</p>
              <p><strong>Densité population :</strong> {Densite ?? "N/A"} hab/km²</p>
              <p><strong>Accès aux soins :</strong> {Acces_soins ?? "N/A"} %</p>
            </div>
          </div>
        </Transition.Child>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
      </Dialog>
    </Transition>
  );
};

export default RegionModal;
