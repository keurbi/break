import React, { useState } from 'react';

type DonationModalProps = {
  open: boolean;
  onClose: () => void;
  onDonate: (amountCents: number) => void | Promise<void>;
  presetAmounts?: number[]; // in cents
};

export const DonationModal: React.FC<DonationModalProps> = ({ open, onClose, onDonate, presetAmounts = [500, 1000, 2000] }) => {
  const [customAmount, setCustomAmount] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#7346FF]">Faire un don</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {presetAmounts.map(v => (
            <button
              key={v}
              type="button"
              onClick={() => onDonate(v)}
              className="bg-[#E5E0FF] hover:bg-[#D5CCFF] text-[#5a36cc] font-bold py-3 rounded-lg"
            >
              {(v/100).toFixed(0)}€
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            placeholder="Montant libre (€)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            type="button"
            onClick={() => {
              const euros = Number(customAmount);
              if (!Number.isFinite(euros) || euros < 1) return;
              onDonate(Math.round(euros * 100));
            }}
            className="bg-[#7346FF] hover:bg-[#5a36cc] text-white font-bold px-4 py-2 rounded-lg"
          >
            Payer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
