'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Loader, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Group, Mesh } from 'three';

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden bg-gradient-to-br from-neutral-950 via-purple-950/20 to-neutral-900 text-white min-h-screen relative">
      <div className="absolute inset-0 -z-50">
        <Canvas>
          <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      <section className="relative min-h-screen w-full py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-violet-950/20 to-neutral-950/90 z-10" />

        <Suspense fallback={<div className="absolute inset-0 bg-neutral-950" />}>
          <Canvas className="absolute inset-0 -z-10" camera={{ position: [0, 0, 16], fov: 60 }}>
            <ambientLight intensity={1.2} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#e879f9" />
            <Environment preset="night" />
            <HeroVisual />
            <OrbitControls 
              enableZoom={false} 
              autoRotate 
              autoRotateSpeed={0.8}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>
        </Suspense>

        <Loader />

        <div className="relative z-20 flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-7xl font-bold leading-tight max-w-5xl"
          >
            We <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-transparent">skyrocket</span> every single business
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="mt-8 max-w-2xl text-lg md:text-xl text-neutral-300 font-light"
          >
            Our team blends design, code, and emotion into next-gen digital worlds.
          </motion.p>
        </div>
      </section>

      <section className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent transform -translate-x-1/2 z-0" />

        {timelineSections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: idx * 0.15 }}
            className={`relative grid grid-cols-1 lg:grid-cols-12 gap-12 mb-36 ${idx % 2 === 0 ? 'items-start' : 'items-end'}`}
          >
            <div className="absolute left-1/2 top-1/2 w-6 h-6 rounded-full bg-fuchsia-500 border-4 border-neutral-950 transform -translate-x-1/2 -translate-y-1/2 z-10" />
            
            <div className={`lg:col-span-5 ${idx % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-8'}`}>
              <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 backdrop-blur-sm rounded-3xl p-8 border border-neutral-800/50 shadow-xl">
                <h2 className="text-3xl font-bold mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 w-3 h-3 rounded-full mr-3"></span>
                  {section.title}
                </h2>
                <p className="text-neutral-300 text-lg leading-relaxed">{section.description}</p>
              </div>
            </div>
            
            <div className={`lg:col-span-5 ${idx % 2 === 0 ? 'lg:col-start-7' : 'lg:col-start-2'} h-[400px]`}>
              <Canvas shadows camera={{ position: [0, 0, 12], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.2} color="#f472b6" castShadow />
                <Environment preset="apartment" />
                {section.visual}
              </Canvas>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="relative py-40 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/90 via-fuchsia-950/20 to-neutral-950/90 z-0" />
        
        <div className="absolute inset-0 z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 40 - 20, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '244,114,182' : '192,38,211'},0.8), transparent)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            Ready to <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-transparent">enhance your online presence</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-neutral-300 text-xl mb-12 max-w-2xl mx-auto"
          >
            build stunning, immersive digital experiences — With Us.
          </motion.p>
          <Link
            href="/add"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-600 to-rose-600 px-10 py-5 font-medium shadow-lg hover:brightness-110 hover:shadow-fuchsia-500/30 text-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <span>Add the business</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

function HeroVisual() {
  const mainGroup = useRef<Group | null>(null);
  const shapes = useRef<Array<Mesh | null>>([]);

  useFrame((state, delta) => {
    if (mainGroup.current) {
      mainGroup.current.rotation.y += delta * 0.15;
    }

    shapes.current.forEach((shape, i) => {
      if (shape) {
        shape.rotation.x += delta * (0.1 + i * 0.05);
        shape.rotation.y += delta * (0.05 + i * 0.03);
        shape.position.y = Math.sin(state.clock.getElapsedTime() * 0.5 + i) * 0.8;
      }
    });
  });

  return (
    <group ref={mainGroup}>
      <mesh ref={(el) => (shapes.current[0] = el)} position={[0, 0, 0]}>
        <icosahedronGeometry args={[3.5, 3]} />
        <meshPhysicalMaterial
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          transmission={0.7}
          thickness={3}
          color="#f472b6"
          emissive="#f472b6"
          emissiveIntensity={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      <mesh ref={(el) => (shapes.current[1] = el)} position={[5, 2, -2]}>
        <torusKnotGeometry args={[1.5, 0.4, 256, 32]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#c084fc"
          metalness={0.8}
          roughness={0.2}
          wireframe
        />
      </mesh>

      <mesh ref={(el) => (shapes.current[2] = el)} position={[-4, -1, 3]}>
        <dodecahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Enhanced Timeline Sections
const timelineSections = [
    {
        title: 'Our Origin',
        description: 'Founded with a vision to empower businesses through innovative digital solutions, we started our journey by blending creativity and technology. Our roots are in pushing boundaries and delivering excellence.',
        visual: (
            <mesh rotation={[0.2, 0.5, 0]}>
                <torusKnotGeometry args={[2.8, 0.6, 256, 64]} />
                <meshPhysicalMaterial
                    color="#a855f7"
                    emissive="#a855f7"
                    metalness={0.9}
                    roughness={0.15}
                    clearcoat={0.5}
                    transmission={0.4}
                    thickness={2}
                />
            </mesh>
        ),
    },
    {
        title: 'Our Mission',
        description: 'To redefine digital experiences with meaningful interactions. We combine cutting-edge technology with human-centered design to create solutions that inspire and transform.',
        visual: (
            <group>
                <mesh position={[0, 0, 0]}>
                    <dodecahedronGeometry args={[2.5, 0]} />
                    <meshStandardMaterial
                        color="#ec4899"
                        emissive="#ec4899"
                        metalness={0.8}
                        roughness={0.2}
                        wireframe
                    />
                </mesh>
                <mesh position={[0, 0, 0]} scale={1.8}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhysicalMaterial
                        thickness={3}
                        transmission={0.9}
                        roughness={0.1}
                        clearcoat={1}
                        color="#f472b6"
                        envMapIntensity={2}
                    />
                </mesh>
            </group>
        ),
    },
    {
        title: 'The Team',
        description: 'Our team is driven by passion and expertise in technology. Led by Saba Foladashviili, CEO and CTO, we are dedicated to continuous growth and delivering impactful results for every client.',
        visual: (
            <group>
                {[...Array(7)].map((_, i) => (
                    <mesh 
                        key={i}
                        position={[
                            Math.sin(i * 0.9) * 2.5,
                            Math.cos(i * 0.7) * 1.8,
                            Math.sin(i * 0.5) * 2
                        ]}
                        scale={0.7}
                    >
                        <icosahedronGeometry args={[1, 0]} />
                        <meshStandardMaterial
                            color={i % 2 === 0 ? "#f43f5e" : "#8b5cf6"}
                            emissive={i % 2 === 0 ? "#f43f5e" : "#8b5cf6"}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>
                ))}
            </group>
        ),
    },
];