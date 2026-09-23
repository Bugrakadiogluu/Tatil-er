'use client';

import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Info } from 'lucide-react';
import { VATRefundRule } from '../lib/types';

interface CustomsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  vatRules: VATRefundRule[];
}

export const CustomsInfoModal: React.FC<CustomsInfoModalProps> = ({
  isOpen,
  onClose,
  vatRules,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel-glow rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/20 p-6 sm:p-8 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Turkish Customs & Global Tax-Free Guide
            </h3>
            <p className="text-xs text-slate-400">
              Crucial legal regulations, IMEI fees, and VAT refund validation procedures
            </p>
          </div>
        </div>

        {/* Turkish Customs & IMEI Rules */}
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Turkish IMEI Kayıt & Smartphone Quota (2025/2026 Fiscal Year)</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>
              <strong className="text-white">IMEI Registration Fee:</strong> Set at{' '}
              <span className="text-amber-300 font-mono font-bold">45,614.00 ₺</span>. Registration must be submitted via e-Devlet and paid within <strong className="text-white">120 days</strong> of entry into Turkey.
            </li>
            <li>
              <strong className="text-white">Quota Limit:</strong> Exactly <strong className="text-white">1 smartphone per passenger every 3 calendar years</strong>. The phone’s IMEI can only be paired with cellular SIM cards registered to the traveler’s own TC Kimlik number for 3 years.
            </li>
            <li>
              <strong className="text-white">TRT Bandrol Fee:</strong> Smartphones brought from abroad are subject to a <strong className="text-white">€20 TRT Bandrol fee</strong> paid at customs / e-Devlet.
            </li>
          </ul>
        </div>

        {/* Duty-Free Accompanied Luggage Allowances */}
        <div className="bg-slate-900/80 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-300 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Personal Baggage Allowance for Non-Phone Electronics</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Under Turkish Customs Law (Yolcu Beraberinde Kişisel Eşya Muafiyeti), a passenger entering Turkey is legally permitted to bring accompanying personal items <strong className="text-white">free of customs import duties</strong> if brought for personal use without commercial packaging:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
              <strong className="text-cyan-400">GPUs & PC Components:</strong> 1 personal unit unboxed or carried as personal gear (0% customs tariff).
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
              <strong className="text-cyan-400">Game Consoles (PS5):</strong> 1 personal video gaming console per traveler (0% customs tariff).
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
              <strong className="text-cyan-400">Monitors & Displays:</strong> 1 display unit allowed. Subject to €10 TRT Bandrol fee.
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-white/5">
              <strong className="text-cyan-400">Luxury Clothing:</strong> Personal apparel within reasonable suitcase volume (0% customs tariff).
            </div>
          </div>
        </div>

        {/* Global VAT Refund Summary Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
            <FileText className="w-4 h-4 mr-1.5 text-cyan-400" /> Destination VAT Refund Protocols
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Country</th>
                  <th className="p-3">Standard VAT</th>
                  <th className="p-3">Net Tourist Refund</th>
                  <th className="p-3">Process & Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-950/40">
                {vatRules.map((rule) => (
                  <tr key={rule.countryCode} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-white flex items-center space-x-1.5">
                      <span>{rule.countryName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({rule.countryCode})</span>
                    </td>
                    <td className="p-3 font-mono">{rule.standardVatRate}%</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {rule.netRefundPctMax > 0 ? `${rule.netRefundPctMax}%` : '0%'}
                    </td>
                    <td className="p-3 text-slate-300">{rule.refundOperator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            I Understand the Regulations
          </button>
        </div>
      </div>
    </div>
  );
};
