'use client';
import Link from "next/link";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Loader } from "@react-three/drei";
import { Business } from "@/types/business";
import Image from "next/image";

interface HomePageProps {
  businesses: Business[];
}

export default function HomePage({ businesses }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBusinesses = businesses.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );



  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  return (
    <main className="overflow-x-hidden bg-gradient-to-b from-neutral-950 to-neutral-900 text-white">
      {/* Hero Section */}
     <section className="relative min-h-screen w-full">
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/30 to-neutral-950/80 z-0" />

  {/* 3D Canvas */}
  <Suspense fallback={<div className="absolute inset-0 bg-neutral-950" />}>
    <Canvas
      className="absolute inset-0 -z-10"
      camera={{ position: [0, 0, 14] }}
    >
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <FloatingBlob />
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />
    </Canvas>
  </Suspense>
  <Loader />

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center gap-10 px-4 pt-32 pb-24 text-center">
    {/* Title and Subtitle */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col items-center"
    >
    <motion.h1
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="w-full max-w-4xl text-center text-3xl font-extrabold leading-tight md:text-7xl lg:text-8xl mx-auto"
>
  Discover{" "}
  <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
    local gems
  </span>{" "}
  around you.
</motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-6 max-w-2xl text-xl text-neutral-300 md:text-2xl"
      >
        Find the best local businesses curated by your community
      </motion.p>
    </motion.div>

    {/* Search Input */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="relative">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cafés, gyms, salons…"
          className="w-full rounded-full border-0 bg-neutral-900/80 px-6 py-4 text-lg shadow-xl outline-none ring-1 ring-neutral-800 placeholder:text-neutral-500 focus:ring-2 focus:ring-rose-500 backdrop-blur-sm transition-all duration-300 hover:shadow-fuchsia-500/20 focus:hover:shadow-fuchsia-500/30"
        />
        <Link href="/search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-fuchsia-600 to-rose-600 p-2 shadow-md hover:shadow-fuchsia-500/30 transition-shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </Link>
      </div>
      
      {/* Advanced Search Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-4 text-center"
      >
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-rose-500 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3l18 18M9 9a6 6 0 0 1 8.5-5.5"/>
            <path d="M9 9a6 6 0 0 0 6 6"/>
          </svg>
          Advanced Search & Filters
        </Link>
      </motion.div>
    </motion.div>

    {/* Down Arrow */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="mt-20"
    >
      <div className="animate-bounce">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </motion.div>
  </div>
</section>


      {/* Businesses Section */}
      <section id="explore" className="mx-auto mt-12 max-w-7xl px-4 pb-32 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 text-center text-4xl font-bold md:text-5xl lg:text-6xl">
            Featured <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-transparent">businesses</span>
          </h2>
          <p className="mx-auto max-w-2xl text-center text-lg text-neutral-400 md:text-xl">
            Handpicked selections from our community
          </p>

          {filteredBusinesses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-16 text-center"
            >
              <div className="mx-auto max-w-md rounded-2xl bg-neutral-900/50 p-8 backdrop-blur-sm border border-neutral-800 shadow-lg">
                <svg className="mx-auto h-12 w-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-xl font-medium">No businesses found</h3>
                <p className="mt-2 text-neutral-400">
                  {searchQuery ?
                    `No matches for "${searchQuery}"` :
                    "No businesses available yet"}
                </p>
                <Link
                  href="/add"
                  className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-fuchsia-600 to-rose-600 px-6 py-3 font-medium shadow-lg transition hover:brightness-110 hover:shadow-fuchsia-500/30"
                >
                  Be the first to list
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredBusinesses.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -8 }}
                    className="group relative cursor-pointer overflow-hidden rounded-3xl bg-neutral-900/50 shadow-2xl backdrop-blur-sm transition-all hover:shadow-fuchsia-500/20 border border-neutral-800/50 hover:border-neutral-700"
                  >
                    <Link href={`/business/${b.id}`} className="block h-full">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          priority
                          src={b.image_url || "/placeholder-business.jpg"}
                          alt={b.name}
                          width={600}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-business.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">{b.name}</h3>
                            <p className="mt-1 text-sm text-neutral-400">{b.category}</p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400">
                            {b.rating || 'New'}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-neutral-300">
                          <svg className="mr-1.5 h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{b.rating || 'Not rated yet'}</span>
                          <span className="mx-2 text-neutral-500">•</span>
                          <span>{b.location || 'Unknown location'}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/90 via-fuchsia-950/30 to-neutral-950/90 z-0" />
        <BackgroundTorus />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              Ready to&nbsp;
              <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
                shine
              </span>
              ?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-neutral-300 md:text-2xl">
              List your business for free in minutes and reach thousands of locals each day.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/add"
                className="flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-600 to-rose-600 px-8 py-4 font-medium shadow-lg transition hover:brightness-110 hover:shadow-fuchsia-500/30 text-lg"
              >
                <span>➕ Add your business</span>
              </Link>
              <Link
                href="#explore"
                className="flex items-center justify-center rounded-full bg-neutral-800 px-6 py-3 font-medium transition hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600"
              >
                <span>Explore more</span>
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            <ul className="mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl text-left">
              {[
                "Completely free forever",
                "SEO‑ready profile",
                "No credit card needed",
              ].map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="flex items-start gap-3 rounded-xl bg-neutral-900/50 p-5 backdrop-blur-sm border border-neutral-800 hover:border-neutral-700 transition-colors"
                >
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-600 to-rose-600 shadow-md">
                    <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-neutral-200">{t}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function FloatingBlob() {
  return (
    <mesh>
      <icosahedronGeometry args={[5, 64]} />
      <meshStandardMaterial
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1.2}
        color="#f472b6"
        emissive="#f472b6"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function BackgroundTorus() {
  return (
    <Suspense fallback={null}>
      <Canvas
        className="absolute inset-0 -z-10"
        camera={{ position: [0, 0, 12] }}
      >
        <ambientLight intensity={0.5} />
        <Environment preset="studio" />
        <mesh rotation={[0.6, 0.2, -0.3]}>
          <torusKnotGeometry args={[3.8, 0.6, 240, 16]} />
          <meshStandardMaterial
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.2}
            color="#f472b6"
            emissive="#f472b6"
            emissiveIntensity={0.2}
          />
        </mesh>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </Suspense>
  );
}
