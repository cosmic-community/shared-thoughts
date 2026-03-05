import { getAllPixels, getBillboardSettings, buildPixelMap, calculateStats } from '@/lib/cosmic';
import Billboard from '@/components/Billboard';
import ProgressBar from '@/components/ProgressBar';
import BillboardInfo from '@/components/BillboardInfo';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [settings, pixels] = await Promise.all([
    getBillboardSettings(),
    getAllPixels(),
  ]);

  const columns = settings?.metadata?.grid_columns ?? 100;
  const rows = settings?.metadata?.grid_rows ?? 100;
  const totalPixels = columns * rows;
  const pixelMap = buildPixelMap(pixels);
  const stats = calculateStats(pixelMap, totalPixels);
  const billboardTitle = settings?.metadata?.billboard_title ?? 'Shared Thoughts';
  const description =
    settings?.metadata?.description ??
    'A collaborative canvas where 10,000 people each design one pixel to create a shared masterpiece.';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 pt-8 pb-6 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-neon-pink/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-neon-purple/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
            <span className="gradient-text">{billboardTitle}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed">
            {description}
          </p>

          <ProgressBar stats={stats} />
        </div>
      </section>

      {/* Billboard Section */}
      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <BillboardInfo stats={stats} />
          <Billboard
            columns={columns}
            rows={rows}
            initialPixelMap={pixelMap}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            <span className="gradient-text">How It Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel rounded-2xl p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-pink/10 rounded-2xl flex items-center justify-center text-3xl">
                👆
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">1. Pick a Pixel</h3>
              <p className="text-gray-400">
                Browse the billboard and click on any available pixel to claim it as yours.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue/10 rounded-2xl flex items-center justify-center text-3xl">
                🎨
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">2. Design It</h3>
              <p className="text-gray-400">
                Choose your perfect color from the palette or create a custom one in the editor.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-green/10 rounded-2xl flex items-center justify-center text-3xl">
                ✨
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">3. Save & Share</h3>
              <p className="text-gray-400">
                Save your pixel and watch it become part of the shared masterpiece forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-canvas-800">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p>
            Each pixel is saved permanently. Together we create something beautiful.
          </p>
          <p className="mt-2">
            {stats.designed.toLocaleString()} of {stats.total.toLocaleString()} pixels designed
          </p>
        </div>
      </footer>
    </div>
  );
}