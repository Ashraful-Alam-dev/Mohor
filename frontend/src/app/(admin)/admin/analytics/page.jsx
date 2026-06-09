"use client";

import Link from "next/link";
import KpiCard from "@/components/KpiCard";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex">

      
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-black mb-6">Analytics Overview</h1>

       
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KpiCard title="Revenue" value="$12,450" />
          <KpiCard title="Orders" value="1,240" />
          <KpiCard title="Customers" value="860" />
          <KpiCard title="Conversion" value="3.2%" />
        </div>

      
        <div className="bg-white border rounded-xl p-6 mb-6">
          <h2 className="font-bold mb-4">Sales Performance</h2>

          <div className="h-72 bg-gradient-to-br from-emerald-50 to-white border rounded-xl flex items-center justify-center">
            <div className="text-center text-neutral-500">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">Chart will be integrated here later</p>
            </div>
          </div>
        </div>

        
        <div className="grid md:grid-cols-2 gap-4">
          
          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-bold mb-4">Traffic Sources</h2>

            <div className="space-y-3">
              {[
                { label: "Direct", value: "45%" },
                { label: "Search", value: "30%" },
                { label: "Social", value: "20%" },
                { label: "Referral", value: "5%" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between text-sm"
                >
                  <span className="text-neutral-600">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

         
          <div className="bg-white border rounded-xl p-6">
            <h2 className="font-bold mb-4">Top Products</h2>

            <div className="space-y-3">
              {["Product A", "Product B", "Product C", "Product D"].map(
                (p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span className="text-sm">{p}</span>
                    <span className="text-sm font-bold text-emerald-700">
                      ${Math.floor(Math.random() * 500 + 50)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

      
        <div className="mt-8 text-center text-sm text-neutral-400">
          Analytics is UI-only. Backend integration coming soon.
        </div>
      </div>
    </div>
  );
}