import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import SummaryCard from '../components/user/SummaryCard';
import NotificationToast from '../components/NotificationToast.jsx';
import { Package, TrendingUp, CheckCircle, Search, RefreshCw, Scissors, AlertCircle } from 'lucide-react';

const statusStyles = {
  pending: 'bg-gray-700/40 text-gray-300 border border-gray-600/40',
  cutting: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
  stitching: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  ready: 'bg-green-500/20 text-green-300 border border-green-500/40',
  'picked-up': 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
};

const UserDashboard = () => {
  const { user, token, request } = useAuth();
  const { notifications, removeNotification } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackingSearch, setTrackingSearch] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Filter out picked-up orders from display
  const activeOrders = orders.filter((o) => o.status !== 'picked-up');
  const readyOrders = activeOrders.filter((o) => o.status === 'ready');
  const inProgressOrders = activeOrders.filter((o) => o.status !== 'ready');

  const loadOrders = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await request('/orders/my', { method: 'GET' });
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Auto-hide tracked order after 10 seconds
  useEffect(() => {
    if (searchedOrder) {
      const timer = setTimeout(() => {
        setSearchedOrder(null);
        setTrackingSearch('');
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [searchedOrder]);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchedOrder(null);

    if (!trackingSearch.trim()) {
      setSearchError('Please enter a tracking number');
      return;
    }

    const found = orders.find(
      (o) => o.trackingNo?.toLowerCase() === trackingSearch.trim().toLowerCase()
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchError('Order not found. Please check the tracking number.');
    }
  };

  const showToast = (message, type = 'success', duration = 3000) => {
    const toastMsg = { message, type };
    console.log('Showing toast:', toastMsg);
    // Show for 1 minute or custom duration
    setTimeout(() => {
      console.log('Toast dismissed');
    }, duration);
  };

  return (
    <section id="user-dashboard" className="min-h-screen pt-20 pb-10 bg-gradient-to-b from-[#0a0a0f] to-[#0b0b12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="text-center">
            <p className="text-sm text-purple-300/80 uppercase tracking-[0.28em] font-semibold">Your Dashboard</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Welcome, {user?.name || 'Guest'}
              </span>
            </h1>
            <p className="mt-2 text-gray-400">Track your suit progress and orders in one place</p>
          </div>
        </motion.div>

        {!user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 border border-purple-500/20 rounded-2xl p-8 text-center"
          >
            <AlertCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-lg text-gray-300 mb-2">Please login or sign up to view your dashboard</p>
            <p className="text-sm text-gray-500">After login, scroll here to see your orders</p>
          </motion.div>
        )}

        {user && (
          <>
            {/* Summary Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SummaryCard icon={Package} label="Total Orders" value={activeOrders.length} color="blue" delay={0} />
              <SummaryCard icon={Scissors} label="In Progress" value={inProgressOrders.length} color="purple" delay={0.1} />
              <SummaryCard icon={CheckCircle} label="Ready to Pickup" value={readyOrders.length} color="green" delay={0.2} />
            </motion.div>

            {/* Tracking Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Track Your Order</h2>
              <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={trackingSearch}
                  onChange={(e) => setTrackingSearch(e.target.value)}
                  placeholder="Enter tracking number..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-400 hover:to-blue-400 transition-all flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </form>

              {searchError && (
                <p className="mt-3 text-sm text-red-400">{searchError}</p>
              )}

              {/* Searched Order Display */}
              <AnimatePresence>
                {searchedOrder && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 bg-gray-800/50 border border-purple-500/30 rounded-lg p-4"
                  >
                    <p className="text-sm text-gray-400 mb-2">Found: {searchedOrder.trackingNo}</p>
                    <div className="bg-gray-800 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[searchedOrder.status] || 'bg-gray-700 text-gray-200'}`}>
                          {searchedOrder.status}
                        </span>
                        <p className="text-sm text-gray-300">{searchedOrder.dressType}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Ready Orders Banner */}
            {readyOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-green-500/10 border border-green-500/40 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-green-300 mb-3">✓ Ready to Pickup</h3>
                <div className="space-y-2">
                  {readyOrders.map((order) => (
                    <p key={order.id} className="text-green-200 text-sm">
                      <span className="font-semibold">{order.trackingNo}</span> — {order.dressType}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 bg-red-500/10 border border-red-500/40 rounded-lg p-4 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Your Orders Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Orders</h2>
                <button
                  onClick={loadOrders}
                  disabled={loading}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 hover:border-purple-500/60 text-gray-300 flex items-center gap-2 transition-all"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {loading && !orders.length && (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-2"></div>
                  Loading your orders...
                </div>
              )}

              {!loading && orders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No orders yet</p>
                  <p className="text-gray-500 text-sm mt-1">When an order is created for you, it will appear here.</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Tracking</p>
                        <p className="font-semibold text-white">{order.trackingNo}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status] || 'bg-gray-700 text-gray-200'}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-300">
                      <p><span className="text-gray-500">Suit Type:</span> {order.dressType}</p>
                      <p><span className="text-gray-500">Price:</span> Rs. {order.price}</p>
                      {order.createdAt && (
                        <p className="text-xs text-gray-400 border-t border-gray-700 pt-2">
                          <span className="text-gray-500">Created:</span> {' '}
                          {new Date(order.createdAt).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })} • {new Date(order.createdAt).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Notification Toast */}
      <NotificationToast 
        notifications={notifications} 
        onRemove={removeNotification}
      />
    </section>
  );
};

export default UserDashboard;
