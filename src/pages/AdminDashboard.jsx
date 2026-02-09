import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import StatCard from '../components/admin/StatCard';
import FilterTabs from '../components/admin/FilterTabs';
import Toast from '../components/admin/Toast';
import StatusBadge from '../components/admin/StatusBadge';
import {
  Users,
  CheckCircle,
  Package,
  CheckCheck,
  Search,
  Zap,
  ChevronDown,
  ChevronRight,
  Trash2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

const statusOptions = ['pending', 'cutting', 'stitching', 'ready'];

const getBadgeClass = (status) => {
  const statusMap = {
    'pending': 'bg-yellow-600/30 text-yellow-200 border border-yellow-700/40',
    'cutting': 'bg-orange-600/30 text-orange-200 border border-orange-700/40',
    'stitching': 'bg-blue-600/30 text-blue-200 border border-blue-700/40',
    'ready': 'bg-green-600/30 text-green-200 border border-green-700/40',
  };
  return statusMap[status] || 'bg-gray-600/30 text-gray-200 border border-gray-700/40';
};

const AdminDashboard = () => {
  const { user, request } = useAuth();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [signupRequests, setSignupRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [editingMeasurements, setEditingMeasurements] = useState(null);
  const [expandedMeasurements, setExpandedMeasurements] = useState({});
  const [form, setForm] = useState({ userId: '', dressType: '', price: '', status: 'pending' });
  const [shirtForm, setShirtForm] = useState({ length: '', armLength: '', armHole: '', armCuff: '', teera: '', chest: '', waist: '', hip: '', daman: '', sideNeck: '', neckDesign: '', extraDetails: '' });
  const [trouserForm, setTrouserForm] = useState({ length: '', thigh: '', ankle: '', extraDetails: '' });
  const [editShirtForm, setEditShirtForm] = useState({ length: '', armLength: '', armHole: '', armCuff: '', teera: '', chest: '', waist: '', hip: '', daman: '', sideNeck: '', neckDesign: '', extraDetails: '' });
  const [editTrouserForm, setEditTrouserForm] = useState({ length: '', thigh: '', ankle: '', extraDetails: '' });

  const headingName = useMemo(() => user && user.name ? user.name : 'Admin', [user]);
  const totalUsers = users.length;
  const pendingSignups = signupRequests.filter(r => r.status === 'pending').length;
  const totalBookings = orders.length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request('/orders', { method: 'GET' });
      setOrders(data.orders || []);
    } catch (err) {
      const errMsg = err && err.message ? err.message : 'Failed to load orders';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await request('/users', { method: 'GET' });
      setUsers(data.users || []);
    } catch (err) {
      setError(err && err.message ? err.message : 'Failed to load users');
    }
  };

  const loadSignupRequests = async () => {
    try {
      const data = await request('/auth/pending-signups', { method: 'GET' });
      setSignupRequests(data.requests || []);
    } catch (err) {
      setError(err && err.message ? err.message : 'Failed to load signup requests');
    }
  };

  useEffect(() => {
    loadOrders();
    loadUsers();
    loadSignupRequests();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignupRequests(prev => [...prev]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleShirtChange = (e) => {
    const { name, value } = e.target;
    setShirtForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTrouserChange = (e) => {
    const { name, value } = e.target;
    setTrouserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditShirtChange = (e) => {
    const { name, value } = e.target;
    setEditShirtForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditTrouserChange = (e) => {
    const { name, value } = e.target;
    setEditTrouserForm(prev => ({ ...prev, [name]: value }));
  };

  const startEditMeasurements = (order) => {
    setEditingMeasurements(order.id);
    setEditShirtForm(order.measurements?.shirt || { length: '', armLength: '', armHole: '', armCuff: '', teera: '', chest: '', waist: '', hip: '', daman: '', sideNeck: '', neckDesign: '', extraDetails: '' });
    setEditTrouserForm(order.measurements?.trouser || { length: '', thigh: '', ankle: '', extraDetails: '' });
  };

  const handleSaveMeasurements = async (orderId) => {
    setSaving(true);
    try {
      await request('/orders/' + orderId, {
        method: 'PUT',
        body: JSON.stringify({
          measurements: { shirt: editShirtForm, trouser: editTrouserForm }
        }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, measurements: { shirt: editShirtForm, trouser: editTrouserForm } } : o));
      setEditingMeasurements(null);
      showToast('Measurements saved successfully!', 'success');
    } catch (err) {
      showToast(err && err.message ? err.message : 'Failed to save measurements', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMeasurements(null);
  };

  const toggleMeasurementSection = (orderId, section) => {
    setExpandedMeasurements(prev => ({
      ...prev,
      [orderId]: prev[orderId] === section ? null : section
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.dressType || !form.price) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSaving(true);
    try {
      await request('/orders', {
        method: 'POST',
        body: JSON.stringify({
          userId: form.userId.trim(),
          dressType: form.dressType.trim(),
          price: Number(form.price),
          status: form.status,
          measurements: { shirt: shirtForm, trouser: trouserForm }
        }),
      });
      setForm({ userId: '', dressType: '', price: '', status: 'pending' });
      setShirtForm({ length: '', armLength: '', armHole: '', armCuff: '', teera: '', chest: '', waist: '', hip: '', daman: '', sideNeck: '', neckDesign: '', extraDetails: '' });
      setTrouserForm({ length: '', thigh: '', ankle: '', extraDetails: '' });
      await loadOrders();
      showToast('Booking created successfully!', 'success');
    } catch (err) {
      showToast(err && err.message ? err.message : 'Failed to create booking', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await request('/orders/' + id, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      showToast('Order status updated!', 'success');
    } catch (err) {
      showToast(err && err.message ? err.message : 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      await request('/orders/' + id, { method: 'DELETE' });
      setOrders(prev => prev.filter(o => o.id !== id));
      showToast('Order deleted', 'success');
    } catch (err) {
      showToast(err && err.message ? err.message : 'Failed to delete order', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user and all their orders?')) return;
    try {
      await request('/users/' + id, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== id));
      setOrders(prev => prev.filter(o => o.userId !== id));
      if (form.userId === id) {
        setForm(prev => ({ ...prev, userId: '' }));
      }
      showToast('User deleted', 'success');
    } catch (err) {
      showToast(err && err.message ? err.message : 'Failed to delete user', 'error');
    }
  };

  const handleApproveSignup = async (requestId) => {
    setSaving(true);
    try {
      const data = await request('/auth/approve-signup/' + requestId, { method: 'POST' });
      setSignupRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
      setUsers(prev => [...prev, data.user]);
      showToast((data.user && data.user.name ? data.user.name : 'User') + ' approved! Account created.', 'success');
    } catch (err) {
      showToast(err && err.message ? err.message : 'Failed to approve signup', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRejectSignup = async (requestId) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return;
    setSaving(true);
    try {
      await request('/auth/reject-signup/' + requestId, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      setSignupRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
      showToast('Signup request rejected', 'success');
    } catch (err) {
      showToast(err && err.message ? err.message : 'Failed to reject signup', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = orders
    .filter(o => orderFilter === 'all' || o.status === orderFilter)
    .filter(o => !searchQuery || (o.trackingNo && o.trackingNo.toLowerCase().includes(searchQuery.toLowerCase())));

  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const orderFilters = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'cutting', label: 'Cutting' },
    { id: 'stitching', label: 'Stitching' },
    { id: 'ready', label: 'Ready' },
  ];

  const hasShirtValues = (measurements) => {
    if (!measurements || !measurements.shirt) return false;
    return Object.values(measurements.shirt).some(val => val);
  };

  const hasTrouserValues = (measurements) => {
    if (!measurements || !measurements.trouser) return false;
    return Object.values(measurements.trouser).some(val => val);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-gray-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage bookings, approvals, and orders</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-gray-400">Welcome back</p>
            <p className="text-white font-semibold">{user && user.name}</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <motion.div 
          initial={{ y: -20 }} 
          animate={{ y: 0 }}
          className="mx-6 mt-4 p-4 bg-red-900/20 border border-red-600/40 rounded-lg text-red-300 flex items-start gap-3"
        >
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </motion.div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* ======================== SECTION 1: DASHBOARD OVERVIEW ======================== */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
            <CheckCircle size={20} /> Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value={totalUsers} icon={Users} color="blue" />
            <StatCard label="Pending Signups" value={pendingSignups} icon={AlertCircle} color="orange" />
            <StatCard label="Total Orders" value={totalBookings} icon={Package} color="purple" />
            <StatCard label="Orders Ready" value={readyOrders} icon={CheckCircle} color="green" />
          </div>
        </motion.div>

        {/* ======================== SECTION 2: SIGNUP REQUESTS ======================== */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-[#141420] to-[#0f0f15] rounded-2xl border border-gray-800/50 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600/10 to-amber-600/10 px-6 py-4 border-b border-gray-800/50">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-orange-600/20 rounded-lg">
                  <Users size={20} className="text-orange-400" />
                </div>
                Pending Signup Requests
                <span className="ml-auto bg-orange-600/30 text-orange-300 px-3 py-1 rounded-full text-sm font-semibold">
                  {pendingSignups}
                </span>
              </h2>
            </div>

            <div className="p-6">
              {signupRequests.filter(r => r.status === 'pending').length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-600 mb-2">
                    <CheckCircle size={40} className="mx-auto opacity-50" />
                  </div>
                  <p className="text-gray-400 font-medium">No pending requests</p>
                  <p className="text-gray-500 text-sm">All signup requests have been processed</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {signupRequests.filter(r => r.status === 'pending').map((req, idx) => (
                    <motion.div
                      key={req.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gradient-to-r from-[#1a1a24] to-[#161620] rounded-lg p-4 border border-gray-800/50 hover:border-orange-600/30 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-white group-hover:text-orange-300 transition">{req.name}</p>
                          <p className="text-gray-400 text-sm">{req.email}</p>
                          <p className="text-gray-500 text-xs mt-1">Requested at {new Date(req.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleApproveSignup(req.id)}
                          disabled={saving}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectSignup(req.id)}
                          disabled={saving}
                          className="flex-1 bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/40 hover:to-pink-600/40 text-red-300 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50 transition-all border border-red-600/30"
                        >
                          Reject
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ======================== SECTION 3: BOOKING MANAGEMENT ======================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BOOKING FORM */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-[#141420] to-[#0f0f15] rounded-2xl border border-gray-800/50 overflow-hidden lg:sticky lg:top-24 h-fit">
              <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 px-6 py-4 border-b border-gray-800/50">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap size={20} className="text-blue-400" />
                  Create New Order
                </h2>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Customer *</label>
                  <select
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  >
                    <option value="" className="bg-[#0a0a0f]">-- Choose a customer --</option>
                    {users.filter(u => u.role === 'user').map(user => (
                      <option key={user.id} value={user.id} className="bg-[#0a0a0f]">
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {users.filter(u => u.role === 'user').length === 0 && (
                    <p className="text-xs text-gray-500 mt-1">No approved customers yet</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dress Type *</label>
                  <input
                    type="text"
                    name="dressType"
                    placeholder="e.g., Shirt, Trouser, Suit"
                    value={form.dressType}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (Rs) *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0f] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status} className="bg-[#0a0a0f]">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shirt Measurements */}
                <div className="pt-4 border-t border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Shirt Measurements (Optional)</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input type="text" name="length" placeholder="Length" value={shirtForm.length} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="armLength" placeholder="Arm Length" value={shirtForm.armLength} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="armHole" placeholder="Arm Hole" value={shirtForm.armHole} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="armCuff" placeholder="Arm Cuff" value={shirtForm.armCuff} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="teera" placeholder="Teera" value={shirtForm.teera} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="chest" placeholder="Chest" value={shirtForm.chest} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="waist" placeholder="Waist" value={shirtForm.waist} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="hip" placeholder="Hip" value={shirtForm.hip} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="daman" placeholder="Daman" value={shirtForm.daman} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="sideNeck" placeholder="Side Neck" value={shirtForm.sideNeck} onChange={handleShirtChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="neckDesign" placeholder="Neck Design" value={shirtForm.neckDesign} onChange={handleShirtChange} className="col-span-2 bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="extraDetails" placeholder="Extra Details" value={shirtForm.extraDetails} onChange={handleShirtChange} className="col-span-2 bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                  </div>
                </div>

                {/* Trouser Measurements */}
                <div className="pt-4 border-t border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Trouser Measurements (Optional)</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input type="text" name="length" placeholder="Length" value={trouserForm.length} onChange={handleTrouserChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="thigh" placeholder="Thigh" value={trouserForm.thigh} onChange={handleTrouserChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="ankle" placeholder="Ankle" value={trouserForm.ankle} onChange={handleTrouserChange} className="bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                    <input type="text" name="extraDetails" placeholder="Extra Details" value={trouserForm.extraDetails} onChange={handleTrouserChange} className="col-span-2 bg-[#0a0a0f] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg py-2.5 font-semibold disabled:opacity-50 transition-all mt-6"
                >
                  {saving ? 'Creating...' : 'Create Order'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* ORDERS TABLE */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-[#141420] to-[#0f0f15] rounded-2xl border border-gray-800/50 overflow-hidden lg:sticky lg:top-24 h-fit flex flex-col">
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 px-6 py-4 border-b border-gray-800/50 flex-shrink-0">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <Package size={20} className="text-purple-400" />
                  </div>
                  Orders Management
                </h2>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-shrink-0">
                  <span className="text-sm text-gray-400 font-medium">Filter:</span>
                  <FilterTabs filters={orderFilters} activeFilter={orderFilter} onFilterChange={setOrderFilter} />
                </div>

                {/* Search */}
                <div className="flex items-center bg-[#0a0a0f] rounded-lg px-4 py-2.5 border border-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition flex-shrink-0">
                  <Search size={18} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by tracking number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full ml-3 text-white placeholder-gray-500"
                  />
                </div>

                {/* Orders List */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin mx-auto mb-3">
                      <Package size={32} className="text-gray-600" />
                    </div>
                    <p className="text-gray-400">Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={40} className="mx-auto text-gray-600 opacity-50 mb-2" />
                    <p className="text-gray-400 font-medium">No orders found</p>
                    <p className="text-gray-500 text-sm">Create a new order to get started</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredOrders.map((order, idx) => (
                      <motion.div
                        key={order.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gradient-to-r from-[#1a1a24] to-[#161620] rounded-lg border border-gray-800/50 hover:border-purple-600/30 transition-all overflow-hidden"
                      >
                        <button
                          onClick={() => toggleOrderExpanded(order.id)}
                          className="w-full text-left p-4 hover:bg-[#1f1f2a] transition flex items-center justify-between group"
                        >
                          <div className="flex-1 flex items-center gap-4">
                            <div>
                              <div className="font-semibold text-white group-hover:text-blue-300 transition">
                                #{order.trackingNo || order.id}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{order.dressType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={order.status} />
                            <div className="text-gray-500 group-hover:text-white transition">
                              {expandedOrders[order.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                          </div>
                        </button>

                        {/* Expanded Details - Hidden by default */}
                        <AnimatePresence>
                          {expandedOrders[order.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-gray-800/50 bg-[#0f0f15] px-4 py-4 space-y-4"
                            >
                              {/* Order Info Grid */}
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-400 text-xs mb-1">Customer Name</p>
                                  <p className="text-white font-semibold">{order.userName || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs mb-1">Customer Email</p>
                                  <p className="text-white font-semibold break-all text-xs">{order.userEmail || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs mb-1">Dress Type</p>
                                  <p className="text-white font-semibold">{order.dressType}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs mb-1">Price</p>
                                  <p className="text-white font-semibold">Rs. {order.price}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 text-xs mb-1">Current Status</p>
                                  <p className="text-white font-semibold">{order.status}</p>
                                </div>
                              </div>

                              {/* Status Update */}
                              <div className="border-t border-gray-800/50 pt-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Update Status</label>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                  className="w-full bg-[#0a0a0f] text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 outline-none"
                                >
                                  {statusOptions.map(status => (
                                    <option key={status} value={status} className="bg-[#0a0a0f]">
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Measurements Info */}
                              {(hasShirtValues(order.measurements) || hasTrouserValues(order.measurements)) && editingMeasurements !== order.id && (
                                <div className="bg-[#141420] rounded-lg border border-green-600/30 overflow-hidden">
                                  {/* Shirt Measurements */}
                                  {hasShirtValues(order.measurements) && (
                                    <div>
                                      <button
                                        onClick={() => toggleMeasurementSection(order.id, 'shirt')}
                                        className="w-full px-4 py-3 text-left hover:bg-[#1a1a24] transition flex items-center justify-between group"
                                      >
                                        <p className="text-green-300 font-semibold text-sm flex items-center gap-2">
                                          <span>✓ Shirt Measurements</span>
                                        </p>
                                        <span className="text-green-300 transition">
                                          {expandedMeasurements[order.id] === 'shirt' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </span>
                                      </button>
                                      <AnimatePresence>
                                        {expandedMeasurements[order.id] === 'shirt' && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-green-600/30 bg-[#0f0f15] px-4 py-3 text-xs space-y-2"
                                          >
                                            <div className="grid grid-cols-2 gap-2">
                                              {order.measurements.shirt.length && <div><span className="text-gray-400">Length:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.length}</span></div>}
                                              {order.measurements.shirt.armLength && <div><span className="text-gray-400">Arm Length:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.armLength}</span></div>}
                                              {order.measurements.shirt.armHole && <div><span className="text-gray-400">Arm Hole:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.armHole}</span></div>}
                                              {order.measurements.shirt.armCuff && <div><span className="text-gray-400">Arm Cuff:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.armCuff}</span></div>}
                                              {order.measurements.shirt.teera && <div><span className="text-gray-400">Teera:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.teera}</span></div>}
                                              {order.measurements.shirt.chest && <div><span className="text-gray-400">Chest:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.chest}</span></div>}
                                              {order.measurements.shirt.waist && <div><span className="text-gray-400">Waist:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.waist}</span></div>}
                                              {order.measurements.shirt.hip && <div><span className="text-gray-400">Hip:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.hip}</span></div>}
                                              {order.measurements.shirt.daman && <div><span className="text-gray-400">Daman:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.daman}</span></div>}
                                              {order.measurements.shirt.sideNeck && <div><span className="text-gray-400">Side Neck:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.sideNeck}</span></div>}
                                              {order.measurements.shirt.neckDesign && <div className="col-span-2"><span className="text-gray-400">Neck Design:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.neckDesign}</span></div>}
                                              {order.measurements.shirt.extraDetails && <div className="col-span-2"><span className="text-gray-400">Extra Details:</span> <span className="text-green-300 font-semibold">{order.measurements.shirt.extraDetails}</span></div>}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )}
                                  
                                  {/* Trouser Measurements */}
                                  {hasShirtValues(order.measurements) && hasTrouserValues(order.measurements) && (
                                    <div className="border-t border-green-600/30" />
                                  )}
                                  
                                  {hasTrouserValues(order.measurements) && (
                                    <div>
                                      <button
                                        onClick={() => toggleMeasurementSection(order.id, 'trouser')}
                                        className="w-full px-4 py-3 text-left hover:bg-[#1a1a24] transition flex items-center justify-between group"
                                      >
                                        <p className="text-green-300 font-semibold text-sm flex items-center gap-2">
                                          <span>✓ Trouser Measurements</span>
                                        </p>
                                        <span className="text-green-300 transition">
                                          {expandedMeasurements[order.id] === 'trouser' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </span>
                                      </button>
                                      <AnimatePresence>
                                        {expandedMeasurements[order.id] === 'trouser' && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-green-600/30 bg-[#0f0f15] px-4 py-3 text-xs space-y-2"
                                          >
                                            <div className="grid grid-cols-2 gap-2">
                                              {order.measurements.trouser.length && <div><span className="text-gray-400">Length:</span> <span className="text-green-300 font-semibold">{order.measurements.trouser.length}</span></div>}
                                              {order.measurements.trouser.thigh && <div><span className="text-gray-400">Thigh:</span> <span className="text-green-300 font-semibold">{order.measurements.trouser.thigh}</span></div>}
                                              {order.measurements.trouser.ankle && <div><span className="text-gray-400">Ankle:</span> <span className="text-green-300 font-semibold">{order.measurements.trouser.ankle}</span></div>}
                                              {order.measurements.trouser.extraDetails && <div className="col-span-2"><span className="text-gray-400">Extra Details:</span> <span className="text-green-300 font-semibold">{order.measurements.trouser.extraDetails}</span></div>}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Edit Measurements Section */}
                              {editingMeasurements === order.id ? (
                                <div className="border-t border-gray-800/50 pt-4 space-y-4">
                                  <h4 className="font-semibold text-gray-300 text-sm">Edit Measurements</h4>
                                  
                                  {/* Shirt Measurements */}
                                  <div className="bg-[#0a0a0f] rounded-lg p-3 space-y-2 border border-blue-600/30">
                                    <p className="text-blue-300 font-semibold text-xs">Shirt Measurements</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <input type="text" name="length" placeholder="Length" value={editShirtForm.length} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="armLength" placeholder="Arm Length" value={editShirtForm.armLength} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="armHole" placeholder="Arm Hole" value={editShirtForm.armHole} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="armCuff" placeholder="Arm Cuff" value={editShirtForm.armCuff} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="teera" placeholder="Teera" value={editShirtForm.teera} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="chest" placeholder="Chest" value={editShirtForm.chest} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="waist" placeholder="Waist" value={editShirtForm.waist} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="hip" placeholder="Hip" value={editShirtForm.hip} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="daman" placeholder="Daman" value={editShirtForm.daman} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="sideNeck" placeholder="Side Neck" value={editShirtForm.sideNeck} onChange={handleEditShirtChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="neckDesign" placeholder="Neck Design" value={editShirtForm.neckDesign} onChange={handleEditShirtChange} className="col-span-2 bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="extraDetails" placeholder="Extra Details" value={editShirtForm.extraDetails} onChange={handleEditShirtChange} className="col-span-2 bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                    </div>
                                  </div>

                                  {/* Trouser Measurements */}
                                  <div className="bg-[#0a0a0f] rounded-lg p-3 space-y-2 border border-blue-600/30">
                                    <p className="text-blue-300 font-semibold text-xs">Trouser Measurements</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <input type="text" name="length" placeholder="Length" value={editTrouserForm.length} onChange={handleEditTrouserChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="thigh" placeholder="Thigh" value={editTrouserForm.thigh} onChange={handleEditTrouserChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="ankle" placeholder="Ankle" value={editTrouserForm.ankle} onChange={handleEditTrouserChange} className="bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                      <input type="text" name="extraDetails" placeholder="Extra Details" value={editTrouserForm.extraDetails} onChange={handleEditTrouserChange} className="col-span-2 bg-[#0f0f15] text-white rounded px-2 py-1.5 border border-gray-700 outline-none focus:border-blue-500" />
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2 pt-2">
                                    <button
                                      onClick={() => handleSaveMeasurements(order.id)}
                                      disabled={saving}
                                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg px-3 py-2 font-semibold disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                      <CheckCircle size={16} />
                                      Save Measurements
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      disabled={saving}
                                      className="flex-1 bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 rounded-lg px-3 py-2 font-semibold disabled:opacity-50 transition-all text-sm border border-gray-600/30"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="border-t border-gray-800/50 pt-4">
                                  <button
                                    onClick={() => startEditMeasurements(order)}
                                    className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded-lg px-3 py-2 font-semibold transition-all flex items-center justify-center gap-2 border border-blue-600/30"
                                  >
                                    <RefreshCw size={16} />
                                    Edit/Add Measurements
                                  </button>
                                </div>
                              )}

                              {/* Delete Button */}
                              <div className="border-t border-gray-800/50 pt-4">
                                <button
                                  onClick={() => handleDelete(order.id)}
                                  className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg px-3 py-2 font-semibold transition-all flex items-center justify-center gap-2 border border-red-600/30"
                                >
                                  <Trash2 size={16} />
                                  Delete Order
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ======================== REGISTERED USERS CARD ======================== */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <div className="bg-gradient-to-br from-[#141420] to-[#0f0f15] rounded-2xl border border-gray-800/50 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 px-6 py-4 border-b border-gray-800/50">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <Users size={20} className="text-green-400" />
                </div>
                Registered Users
                <span className="ml-auto bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                  {users.filter(u => u.role === 'user').length}
                </span>
              </h2>
            </div>

            <div className="p-6">
              {users.filter(u => u.role === 'user').length === 0 ? (
                <div className="text-center py-12">
                  <Users size={40} className="mx-auto text-gray-600 opacity-50 mb-2" />
                  <p className="text-gray-400 font-medium">No registered users</p>
                  <p className="text-gray-500 text-sm">Approved customers will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.filter(u => u.role === 'user').map((user, idx) => (
                    <motion.div
                      key={user.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gradient-to-r from-[#1a1a24] to-[#161620] rounded-lg p-4 border border-gray-800/50 hover:border-green-600/30 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white group-hover:text-green-300 transition truncate">{user.name}</p>
                          <p className="text-gray-400 text-sm truncate">{user.email}</p>
                          <p className="text-gray-500 text-xs mt-2">ID: {user.id}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={saving}
                          className="flex-shrink-0 bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg p-2 transition-all disabled:opacity-50 border border-red-600/30"
                          title="Delete user and all their orders"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default AdminDashboard;
