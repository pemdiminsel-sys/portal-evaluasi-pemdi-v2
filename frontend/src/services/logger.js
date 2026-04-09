import { supabase } from './supabase';
import useAuthStore from '../store/authStore';

/**
 * Logs user activity to the Supabase 'logs' table
 * @param {Object} params
 * @param {string} params.action - Description of the action (e.g., 'Menambahkan OPD baru')
 * @param {string} params.module - The module name (e.g., 'Manajemen OPD')
 * @param {string} params.type - Action type: 'info', 'create', 'update', 'delete'
 * @param {Object} [params.payload] - Additional data to store
 */
export const logActivity = async ({ action, module, type = 'info', payload = null }) => {
    try {
        const { user } = useAuthStore.getState();
        
        if (!user) {
            console.warn('Logging skipped: No active user session.');
            return;
        }

        const logData = {
            user_id: user.id,
            user_name: user.name,
            user_email: user.email,
            user_role: user.role,
            action,
            module,
            type,
            payload,
            created_at: new Date().toISOString()
        };

        const { error } = await supabase.from('logs').insert([logData]);
        if (error) throw error;
    } catch (err) {
        console.error('Activity Log Error:', err.message);
    }
};

export default logActivity;
