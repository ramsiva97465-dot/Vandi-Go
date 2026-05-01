import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit3, Plus, X, IndianRupee, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useLanguage } from '../context/LanguageContext';

const CabManagement = () => {
  const { lang } = useLanguage();
  
  const t = {
    EN: {
      config: 'Configuration',
      cab: 'Cab',
      manageVehicles: 'Manage vehicle classes and distance-based pricing.',
      addVehicle: 'Add Vehicle Class',
      vehicleType: 'Vehicle Type',
      baseFare: 'Base Fare',
      pricePerKm: 'Price / KM',
      minFare: 'Min Fare',
      leadFeePerKm: 'Lead Fee / KM',
      actions: 'Actions',
      noVehicles: 'No vehicle classes configured',
      edit: 'Edit',
      add: 'Add',
      vehicleClass: 'Vehicle Class',
      typeName: 'Type Name',
      save: 'Save Configuration',
      errSave: 'Error saving cab type',
      errDelete: 'Error deleting',
      confirmDelete: 'Delete this cab type?'
    },
    TA: {
      config: 'கட்டமைப்பு',
      cab: 'கேப்',
      manageVehicles: 'வாகன வகைகள் மற்றும் தூரம் சார்ந்த விலையை நிர்வகிக்கவும்.',
      addVehicle: 'வாகன வகையைச் சேர்க்கவும்',
      vehicleType: 'வாகன வகை',
      baseFare: 'அடிப்படை கட்டணம்',
      pricePerKm: 'விலை / கி.மீ',
      minFare: 'குறைந்தபட்ச கட்டணம்',
      leadFeePerKm: 'லீட் கட்டணம் / கி.மீ',
      actions: 'செயல்கள்',
      noVehicles: 'வாகன வகைகள் எதுவும் கட்டமைக்கப்படவில்லை',
      edit: 'மாற்றவும்',
      add: 'சேர்க்கவும்',
      vehicleClass: 'வாகன வகை',
      typeName: 'வகை பெயர்',
      save: 'கட்டமைப்பைச் சேமிக்கவும்',
      errSave: 'கேப் வகையைச் சேமிப்பதில் பிழை',
      errDelete: 'நீக்குவதில் பிழை',
      confirmDelete: 'இந்த கேப் வகையை நீக்கவா?'
    }
  };
  const [cabTypes, setCabTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCab, setEditingCab] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    base_fare: '',
    price_per_km: '',
    min_fare: '',
    commission_per_km: ''
  });

  const fetchCabTypes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cab-types`);
      setCabTypes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCab) {
        await axios.put(`${API_URL}/api/cab-types/${editingCab._id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/cab-types`, formData);
      }
      setShowModal(false);
      setEditingCab(null);
      setFormData({ name: '', base_fare: '', price_per_km: '', min_fare: '', commission_per_km: '' });
      fetchCabTypes();
    } catch (err) {
      alert(t[lang].errSave);
    }
  };

  const deleteCab = async (id) => {
    if (window.confirm(t[lang].confirmDelete)) {
      try {
        await axios.delete(`${API_URL}/api/cab-types/${id}`);
        fetchCabTypes();
      } catch (err) {
        alert(t[lang].errDelete);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t[lang].cab} <span className="text-blue-600">{t[lang].config}</span></h2>
          <p className="text-slate-400 text-sm">{t[lang].manageVehicles}</p>
        </div>
        <button 
          onClick={() => { setEditingCab(null); setFormData({ name: '', base_fare: '', price_per_km: '', min_fare: '', commission_per_km: '' }); setShowModal(true); }}
          className="px-6 py-4 bg-[#0B1E3F] text-white rounded-2xl text-xs font-bold shadow-xl hover:bg-[#1a2e4f] flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> {t[lang].addVehicle}
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].vehicleType}</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].baseFare}</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].pricePerKm}</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].minFare}</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].leadFeePerKm}</th>
              <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{t[lang].actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {cabTypes.map((cab) => (
              <tr key={cab._id} className="hover:bg-slate-50/30 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm font-bold text-[#0B1E3F]">{cab.name}</p>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-bold text-slate-600">₹{cab.base_fare}</td>
                <td className="px-8 py-6 text-sm font-bold text-slate-600">₹{cab.price_per_km}</td>
                <td className="px-8 py-6 text-sm font-bold text-slate-600">₹{cab.min_fare || 0}</td>
                <td className="px-8 py-6 text-sm font-bold text-blue-600">₹{cab.commission_per_km || 0}</td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => { setEditingCab(cab); setFormData(cab); setShowModal(true); }}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteCab(cab._id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {cabTypes.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="px-8 py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">{t[lang].noVehicles}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(11, 30, 63, 0.4)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold">{editingCab ? t[lang].edit : t[lang].add} <span className="text-blue-600">{t[lang].vehicleClass}</span></h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].typeName}</label>
                  <input required placeholder="e.g. Sedan, SUV" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].baseFare} (₹)</label>
                    <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold outline-none" value={formData.base_fare} onChange={(e) => setFormData({...formData, base_fare: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].pricePerKm} (₹)</label>
                    <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold outline-none" value={formData.price_per_km} onChange={(e) => setFormData({...formData, price_per_km: e.target.value})} />
                  </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].minFare} (₹)</label>
                    <input type="number" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold outline-none" value={formData.min_fare} onChange={(e) => setFormData({...formData, min_fare: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].leadFeePerKm} (₹)</label>
                    <input required type="number" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold outline-none" value={formData.commission_per_km} onChange={(e) => setFormData({...formData, commission_per_km: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-[#0B1E3F] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">{t[lang].save}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CabManagement;
