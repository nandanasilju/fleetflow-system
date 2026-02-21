import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const Maintenance = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLog, setNewLog] = useState({ vehicleId: '', serviceType: '', cost: '' });

    const fetchData = async () => {
        try {
            const [logsRes, vehiclesRes] = await Promise.all([
                api.get('/maintenance'),
                api.get('/vehicles')
            ]);
            setLogs(logsRes.data);
            setVehicles(vehiclesRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maintenance', {
                ...newLog,
                cost: Number(newLog.cost)
            });
            setNewLog({ vehicleId: '', serviceType: '', cost: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create log');
        }
    };

    const handleComplete = async (id) => {
        try {
            await api.put(`/maintenance/${id}/complete`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to complete maintenance');
        }
    };

    if (loading) return <div>Loading maintenance...</div>;

    const canManageMaintenance = user?.role === 'Manager' || user?.role === 'Safety Officer';

    return (
        <div className="space-y-6">
            {canManageMaintenance && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Record Maintenance</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                            <select required value={newLog.vehicleId} onChange={e => setNewLog({ ...newLog, vehicleId: e.target.value })} className="w-full border p-2 rounded">
                                <option value="">Select Vehicle</option>
                                {vehicles.filter(v => v.status !== 'OnTrip').map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                            <input type="text" required value={newLog.serviceType} onChange={e => setNewLog({ ...newLog, serviceType: e.target.value })} className="w-full border p-2 rounded" placeholder="e.g. Oil Change" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                            <input type="number" required value={newLog.cost} onChange={e => setNewLog({ ...newLog, cost: e.target.value })} className="w-full border p-2 rounded" placeholder="Cost" />
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-orange-500 text-white p-2 rounded font-medium hover:bg-orange-600">Add Record & Set InShop</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Maintenance Logs</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                <th className="p-4 rounded-tl-lg">Date</th>
                                <th className="p-4">Vehicle</th>
                                <th className="p-4">Service</th>
                                <th className="p-4">Cost</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 rounded-tr-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map((l) => (
                                <tr key={l._id} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-600">{new Date(l.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-medium text-gray-900">{l.vehicleId?.name}</td>
                                    <td className="p-4 text-gray-600">{l.serviceType}</td>
                                    <td className="p-4 text-gray-600">${l.cost}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${l.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {l.status === 'InProgress' && canManageMaintenance && (
                                            <button onClick={() => handleComplete(l._id)} className="text-blue-600 hover:underline text-sm font-medium">
                                                Mark Completed
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && <div className="text-center p-8 text-gray-500">No logs found</div>}
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
