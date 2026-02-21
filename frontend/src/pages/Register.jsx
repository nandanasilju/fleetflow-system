import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Truck } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Dispatcher');
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const res = await register(name, email, password, role);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md my-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-green-600 p-3 rounded-full text-white mb-4">
                        <Truck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
                    <p className="text-gray-500 text-sm mt-1">Join FleetFlow System</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@fleetflow.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            className="w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Dispatcher">Dispatcher</option>
                            <option value="Safety Officer">Safety Officer</option>
                            <option value="Financial Analyst">Financial Analyst</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-2.5 rounded font-medium hover:bg-green-700 transition mt-6"
                    >
                        Sign Up
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-green-600 font-medium hover:underline"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
