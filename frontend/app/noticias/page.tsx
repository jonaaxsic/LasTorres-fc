import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { newsApi, News } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { NewsSlider } from "@/components/news-slider";

async function getNews() {
  const { data } = await newsApi.getAll();
  return data || [];
}

export default async function NoticiasPage() {
  const news = await getNews();

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb />
          
          <div className="mb-6">
            <Badge variant="outline" className="mb-3">Noticias</Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight">
              Todas las Noticias
            </h1>
          </div>

          <NewsSlider news={news} />
        </div>
      </main>
      <Footer />
    </>
  );
}