export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-neutral-900">
          About Us
        </h1>
        <p className="text-sm text-neutral-500">
          Building Mohor with care, precision, and love for simplicity.
        </p>
      </div>

      {/* INTRO */}
      <div className="bg-white border rounded-2xl p-6 text-sm text-neutral-700 leading-relaxed">
        <p>
          We are a small development team building Mohor — a modern e-commerce platform focused on simplicity,
          performance, and clean user experience. Our goal is to make online shopping smooth and reliable for everyone.
        </p>
      </div>

      {/* DEVELOPERS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Developer 1 */}
        <div className="border rounded-2xl p-6 bg-white space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-200" />

          <h2 className="text-lg font-bold text-neutral-900">
            Developer One
          </h2>

          <p className="text-sm text-neutral-600">
            Full-stack developer focused on backend systems, APIs, and database architecture.
            Passionate about building scalable and reliable systems.
          </p>
        </div>

        {/* Developer 2 */}
        <div className="border rounded-2xl p-6 bg-white space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-200" />

          <h2 className="text-lg font-bold text-neutral-900">
            Developer Two
          </h2>

          <p className="text-sm text-neutral-600">
            Frontend developer focused on UI/UX, performance, and smooth user interactions.
            Loves clean design and intuitive experiences.
          </p>
        </div>

      </div>

      {/* FOOTER NOTE */}
      <div className="text-center text-xs text-neutral-400 pt-6">
        © {new Date().getFullYear()} Mohor. All rights reserved.
      </div>

    </div>
  );
}