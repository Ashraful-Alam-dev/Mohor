export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center space-y-6">

      {/* ICON */}
      <div className="text-5xl">⚙️</div>

      {/* TITLE */}
      <h1 className="text-3xl font-black text-neutral-900">
        Settings
      </h1>

      {/* MESSAGE */}
      <p className="text-sm text-neutral-600 leading-relaxed">
        We are currently building advanced account settings, privacy controls,
        and personalization features. This section will be available soon.
      </p>

      {/* BADGE */}
      <div className="inline-block px-4 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
        Coming Soon
      </div>

      {/* NOTE */}
      <p className="text-xs text-neutral-400 pt-6">
        Stay tuned for updates 🚀
      </p>

    </div>
  );
}