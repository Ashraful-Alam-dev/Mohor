'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminAuditPanel() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchLogs = async (type = 'all') => {
    try {
      setLoading(true);

      const url =
        type === 'all'
          ? '/admin/audit/logs'
          : `/admin/audit/logs?type=${type}`;

      const res = await api.get(url);

      if (res.data?.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(filter);
  }, [filter]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-neutral-500 animate-pulse">
        Loading system activity logs...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-black text-neutral-900">
          Audit Logs
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          System activity tracking for database interaction
        </p>
      </div>
      <div className="flex gap-2">
        {['all', 'product', 'user'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              filter === t
                ? 'bg-black text-white'
                : 'bg-white text-black border-neutral-300'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <div className="relative border-l pl-6 space-y-6">

          {logs.map((log) => (
            <div key={log.id} className="relative">

              <div className={`absolute -left-[30px] top-1 w-3 h-3 rounded-full ${
                log.entity_type === 'product'
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`} />

           
              <div className="space-y-1">

               
                <div className="flex justify-between items-center">

                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${
                    log.entity_type === 'product'
                      ? 'text-amber-700 bg-amber-50 border-amber-200'
                      : 'text-indigo-700 bg-indigo-50 border-indigo-200'
                  }`}>
                    {log.entity_type}
                  </span>

                  <span className="text-[11px] text-neutral-400">
                    {new Date(log.executed_at).toLocaleString()}
                  </span>

                </div>

               
                <p className="text-[11px] text-neutral-500">
                  By: {log.actor_name || 'System'}
                </p>

              
                <p className="text-sm font-semibold text-neutral-800">
                  {log.description}
                </p>

              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center text-neutral-400 italic py-10">
              No audit logs found
            </div>
          )}

        </div>
      </div>
    </div>
  );
}