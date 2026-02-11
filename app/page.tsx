"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getYouTubeThumbnail } from "@/lib/youtube";
import { useState, useEffect } from "react";
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Helper to get image path (handles absolute URLs from Google Storage and local paths)
const getImagePath = (image: string) => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  return `/images/${image}`;
};

export default function Home() {
  const [data, setData] = useState<{
    videos: any[],
    websites: any[],
    designs: any[],
    photos: any[]
  }>({
    videos: [],
    websites: [],
    designs: [],
    photos: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedWebsiteCategory, setSelectedWebsiteCategory] = useState<string>("all");
  const [selectedDesignCategory, setSelectedDesignCategory] = useState<string>("all");
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxItem, setLightboxItem] = useState<{type: 'video' | 'design' | 'photo', data: any} | null>(null);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    async function fetchData() {
      // Simulate progress while fetching
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + Math.random() * 5;
          return prev;
        });
      }, 100);

      try {
        const response = await fetch(`${API_URL}/all`);
        const result = await response.json();
        setData(result);
        
        // Finish progress
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setIsLoading(false);
      } finally {
        clearInterval(progressInterval);
      }
    }
    fetchData();
    return () => clearInterval(progressInterval);
  }, []);

  const filteredVideos = selectedCategory === "all" ? data.videos : data.videos.filter(v => v.category === selectedCategory);
  const filteredWebsites = selectedWebsiteCategory === "all" ? data.websites : data.websites.filter(w => w.category === selectedWebsiteCategory);
  const filteredDesigns = selectedDesignCategory === "all" ? data.designs : data.designs.filter(d => d.category === selectedDesignCategory);
  const filteredPhotos = selectedPhotoCategory === "all" ? data.photos : data.photos.filter(p => p.category === selectedPhotoCategory);

  const openLightbox = (type: 'video' | 'design' | 'photo', item: any) => {
    setLightboxItem({ type, data: item });
    setLightboxOpen(true);
  };

  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/\s]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return '';
  };

  const navigateLightbox = (direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lightboxItem) return;

    const { type, data: currentItem } = lightboxItem;
    let items: any[] = [];
    
    if (type === 'video') items = filteredVideos;
    else if (type === 'design') items = filteredDesigns;
    else if (type === 'photo') items = filteredPhotos;

    const currentIndex = items.findIndex(item => 
      type === 'video' ? item.url === currentItem.url : item.image === currentItem.image
    );

    if (currentIndex === -1) return;

    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % items.length 
      : (currentIndex - 1 + items.length) % items.length;

    openLightbox(type, items[newIndex]);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">{Math.round(progress)}%</div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Hero Section */}
      <section id="home" className="section">
        <div className="container">
          <div className="section-content">
            <div className="inner-content">
              <h1 className="title-hero">Bojour</h1>
              <p className="subtitle">En quoi puis-je vous aider ?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'flex-start' }}>
                <Button variant="outline" size="lg" onClick={() => scrollToSection('websites')}>Développement</Button>
                <Button variant="outline" size="lg" onClick={() => scrollToSection('graphic')}>Graphisme</Button>
                <Button variant="outline" size="lg" onClick={() => scrollToSection('videos')}>Vidéos</Button>
                <Button variant="outline" size="lg" onClick={() => scrollToSection('photos')}>Photos</Button>
                <div className="hero-contact-wrapper">
                  <div className="hero-contact-bg" />
                  <Button variant="outline" size="lg" onClick={() => scrollToSection('about')} style={{ position: 'relative' }}>Contact</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Websites Section */}
      <section id="websites" className="section">
        <div className="container">
          <div className="section-content">
            <div className="inner-content">
              <h2 className="title-section">Développement</h2>
              <p className="subtitle">Mes projets data / web.</p>
              
              <div className="grid-gallery" style={{ display: 'flex', overflowX: 'auto', paddingBottom: '1rem' }}>
                {data.websites
                  .filter(p => p.highlight === "oui")
                  .sort((a, b) => (a.title === "GitHub" ? 1 : b.title === "GitHub" ? -1 : 0))
                  .map((project, i) => (
                  <Card 
                    key={i} 
                    className={`card-interactive ${project.title === "GitHub" ? "card-github" : ""}`} 
                    style={{ width: '210px', flexShrink: 0 }} 
                    onClick={() => window.open(project.link, '_blank')}
                  >
                    <CardContent>
                      <div className="card-image-container">
                        <Image src={getImagePath(project.image)} alt={project.title} fill style={{ objectFit: 'cover' }} />
                        <div className="card-hover-overlay">
                          <span className="card-hover-button">Voir</span>
                        </div>
                      </div>
                      <div className="card-content-group">
                        <div className="card-title">{project.title}</div>
                        <div className="card-description">{project.description}</div>
                        <div style={{ marginTop: '0.5rem' }}>
                          {project.technologies?.map((t: string, j: number) => <span key={j} className="tech-tag">{t}</span>)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {['all', 'web', 'data'].map(c => (
                  <Button key={c} variant={selectedWebsiteCategory === c ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedWebsiteCategory(c)}>
                    {c === 'all' ? 'Tous' : c === 'web' ? 'Web' : 'Data'}
                  </Button>
                ))}
              </div>

              <div className="grid-gallery" style={{ marginTop: '2rem' }}>
                {filteredWebsites.filter(p => p.highlight !== "oui").map((project, i) => (
                  <Card key={i} className="card-interactive" onClick={() => window.open(project.link, '_blank')}>
                    <CardContent>
                      <div className="card-image-container">
                        <Image src={getImagePath(project.image)} alt={project.title} fill style={{ objectFit: 'cover' }} />
                        <div className="card-hover-overlay">
                          <span className="card-hover-button">Voir</span>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div className="card-description">{project.description}</div>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        {project.technologies?.map((t: string, j: number) => <span key={j} className="tech-tag">{t}</span>)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Graphic Design Section */}
      <section id="graphic" className="section">
        <div className="container">
          <div className="section-content">
            <div className="inner-content">
              <h2 className="title-section">Graphisme</h2>
              <p className="subtitle">Mes créations graphiques.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                {['all', 'Entreprise', 'Création', 'Autre'].map(c => (
                  <Button key={c} variant={selectedDesignCategory === c ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedDesignCategory(c)}>
                    {c === 'all' ? 'Tous' : c}
                  </Button>
                ))}
              </div>
              <div className="grid-gallery">
                {filteredDesigns.map((d, i) => (
                  <Card key={i} className="card-interactive" onClick={() => openLightbox('design', d)}>
                    <CardContent>
                      <div className="card-image-container" style={{ aspectRatio: '1/1' }}>
                        <Image src={getImagePath(d.image)} alt="design" fill style={{ objectFit: 'cover' }} />
                        <div className="card-hover-overlay">
                          <span className="card-hover-button">Voir</span>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div className="card-description">{d.description}</div>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <span className="tech-tag">{d.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="section">
        <div className="container">
          <div className="section-content">
            <div className="inner-content">
              <h2 className="title-section">Vidéos</h2>
              <p className="subtitle">Tournage et montage seul.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                {['all', 'interview', 'évènementiel', 'motion design', 'autre'].map(c => (
                  <Button key={c} variant={selectedCategory === c ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedCategory(c)}>
                    {c === 'all' ? 'Toutes' : c}
                  </Button>
                ))}
              </div>
              <div className="grid-gallery">
                {filteredVideos.map((v, i) => (
                  <Card key={i} className="card-interactive" onClick={() => openLightbox('video', v)}>
                    <CardContent>
                      <div className="card-image-container">
                        <Image src={getYouTubeThumbnail(v.url)} alt="video" fill style={{ objectFit: 'cover' }} />
                        <div className="card-hover-overlay">
                          <span className="card-hover-button">Voir</span>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div className="card-description">{v.description}</div>
                      </div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="tech-tag" style={{ margin: 0 }}>{v.category}</span>
                        {v.platform && (
                          <Image 
                            src={`/${v.platform.toLowerCase()}.svg`} 
                            alt={v.platform} 
                            width={60} 
                            height={v.platform.toLowerCase() === 'youtube' ? 30 : 23} 
                            className="platform-icon"
                            style={{ height: v.platform.toLowerCase() === 'youtube' ? '30px' : '23px', width: 'auto' }}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photos Section */}
      <section id="photos" className="section">
        <div className="container">
          <div className="section-content">
            <div className="inner-content">
              <h2 className="title-section">Photos</h2>
              <p className="subtitle">Ma galerie photo.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                {['all', 'paysage', 'portrait', 'évènement', 'pub', 'autre'].map(c => (
                  <Button key={c} variant={selectedPhotoCategory === c ? 'primary' : 'outline'} size="sm" onClick={() => setSelectedPhotoCategory(c)}>
                    {c === 'all' ? 'Toutes' : c}
                  </Button>
                ))}
              </div>
              <div className="grid-gallery">
                {filteredPhotos.map((p, i) => (
                  <Card key={i} className="card-interactive" onClick={() => openLightbox('photo', p)}>
                    <CardContent>
                      <div className="card-image-container" style={{ aspectRatio: '1/1' }}>
                        <Image src={getImagePath(p.image)} alt="photo" fill style={{ objectFit: 'cover' }} />
                        <div className="card-hover-overlay">
                          <span className="card-hover-button">Voir</span>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <div className="card-description">{p.description}</div>
                      </div>
                      <div style={{ marginTop: '0.5rem' }}>
                        <span className="tech-tag">{p.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="section-content">
            <div className="inner-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                  <h2 className="title-section">Qui suis-je ?</h2>
                  <div style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
                    <p style={{ marginBottom: '1rem' }}>mon parcours rapidement :</p>
                    <p>Après un Bac S, j'ai été diplômé d'un Bachelor Web effectué à Hétic. J'ai travaillé pendant presque 5 ans dans un groupe du CAC 40 et aujourd'hui, je suis freelance depuis 3 ans.</p>
                  </div>
                  <h3 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Contact</h3>
                  <p>
                    <a href="mailto:t@tanguym.fr" style={{ color: 'var(--foreground)' }}>t@tanguym.fr</a>
                    <span style={{ margin: '0 0.5rem', color: 'var(--muted-foreground)' }}>ou</span>
                    <a href="https://www.linkedin.com/in/tanguy-mombert-a68b81159/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--foreground)', textDecoration: 'underline' }}>LinkedIn</a>
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '300px', height: '300px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <Image src="/images/_DSC1998-copie-3.jpeg" alt="Tanguy" fill style={{ objectFit: 'cover' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && lightboxItem && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => navigateLightbox('prev', e)}>‹</button>
          <button className="lightbox-nav lightbox-next" onClick={(e) => navigateLightbox('next', e)}>›</button>
          <button className="lightbox-close">✕</button>
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            {lightboxItem.type === 'video' ? (
              <iframe src={getEmbedUrl(lightboxItem.data.url)} style={{ width: '60vw', aspectRatio: '16/9', border: 'none' }} allowFullScreen />
            ) : (
              <div style={{ position: 'relative', width: 'auto', height: 'auto' }}>
                 <img src={getImagePath(lightboxItem.data.image)} alt="preview" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
              </div>
            )}
          </div>
        </div>
      )}

      <footer style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>© 2026 TanguyM.fr. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
