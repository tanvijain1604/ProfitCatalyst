import React, { useEffect } from 'react';
import { DetailedClient } from '../types';
import { XIcon } from './icons';
import { StatusBadge, CsatScore } from './ClientComponents';

interface ClientDetailModalProps {
  client: DetailedClient | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <div className="text-lg font-semibold text-white">{children}</div>
    </div>
);


const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    if (!client) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="glassmorphic rounded-2xl w-full max-w-2xl m-4 p-8 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=7F56D9&color=fff&font-size=0.4`}
                            alt={`${client.name} Logo`}
                            className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-[#7F56D9]/50"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-white">{client.name}</h2>
                            <p className="text-gray-400">Client ID: {client.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-white/10 transition-colors"
                        aria-label="Close modal"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <DetailItem label="Status">
                        <StatusBadge status={client.status} />
                    </DetailItem>
                    <DetailItem label="CSAT Score">
                        <CsatScore score={client.csat} />
                    </DetailItem>
                    <DetailItem label="Open Tickets">
                        {client.openTickets}
                    </DetailItem>
                    <DetailItem label="Lifetime Value (LTV)">
                        <span className="font-mono">${new Intl.NumberFormat().format(client.ltv)}</span>
                    </DetailItem>
                    <DetailItem label="Join Date">
                        {client.joinDate}
                    </DetailItem>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailModal;