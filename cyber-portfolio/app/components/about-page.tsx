'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from './header'
import { fetchAboutData, fetchSkills, fetchCertifications, fetchExperience } from '../../utils/about'
import { AboutData, Skill, Certification, Experience } from '../../types/about'
import prependApiUrl from '../../utils/imageHelper'
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import { parseDate } from '../../utils/dataParser'; 
const placeholderImage = "/placeholder.svg?height=200&width=200"

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [aboutData, skillsData, certificationsData, experienceData] = await Promise.all([
        fetchAboutData(),
        fetchSkills(),
        fetchCertifications(),
        fetchExperience()
      ])
      setAboutData(aboutData)
      setSkills(skillsData)
      setCertifications(certificationsData)
      setExperience(experienceData)
    } catch (error) {
      console.error('Failed to load data:', error)
      setError('Failed to load data. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8 flex justify-center items-center h-screen">
          <LoadingSpinner size="large" color="text-blue-400" />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage message={error} onRetry={loadData} />
        </main>
      </div>
    )
  }

  if (!aboutData) {
    return null;
  }

  const imageUrl = aboutData.attributes.profile_picture?.data?.attributes?.url
    ? prependApiUrl(aboutData.attributes.profile_picture.data.attributes.url)
    : placeholderImage;

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">About Me</h1>

        <section className="mb-16 overflow-hidden backdrop-blur-sm bg-black/30 border-blue-500/30 shadow-2xl shadow-blue-500/20 rounded-3xl">
          <div className="cyber-gradient-line" />
          <div className="relative h-64 md:h-80">
            <Image
              src={imageError ? placeholderImage : prependApiUrl(imageUrl)}
              alt={`Profile picture of ${aboutData.attributes.name}`}
              fill
              style={{ objectFit: "cover" }}
              className="filter brightness-50"
              onError={() => setImageError(true)}
              priority
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
          </div>
          <div className="relative px-8 py-10 -mt-20 md:-mt-24">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative w-40 h-40 md:w-48 md:h-48 -mt-20 md:-mt-32">
                <Image
                  src={imageError ? placeholderImage : prependApiUrl(imageUrl)}
                  alt={`Profile picture of ${aboutData.attributes.name}`}
                  width={192}
                  height={192}
                  style={{ objectFit: "cover" }}
                  className="rounded-full border-4 border-blue-500 shadow-lg"
                  onError={() => setImageError(true)}
                  priority
                  quality={100}
                />
              </div>
              <div className="text-center md:text-left flex-grow">
                <h2 className="text-3xl md:text-4xl mb-2 font-bold">{aboutData.attributes.name}</h2>
                <p className="text-blue-400 text-lg mb-4">Cybersecurity enthusiast</p>
              </div>
            </div>
            <div className="mt-6 bg-black/30 rounded-xl p-6 shadow-inner">
              <div className="text-gray-300 space-y-4 font-light leading-relaxed">
                {aboutData.attributes.Bio && aboutData.attributes.Bio.map((paragraph, index) => (
                  <p key={index} className="text-lg">{paragraph.children[0].text}</p>
                ))}
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="mr-2">Contact Me</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Professional Experience</h2>
          <div className="space-y-8">
            {Array.isArray(experience) && experience.length > 0 ? (
              experience
                .sort((a: Experience, b: Experience) => {
                  if (!a.attributes || !b.attributes) {
                    return 0;
                  }
                  const dateA = parseDate(a.attributes.duration);
                  const dateB = parseDate(b.attributes.duration);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((job: Experience) => (
                  <div key={job.id} className="relative pl-8 pb-8 border-l-2 border-blue-500/30">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2"></div>
                    <div className="overflow-hidden backdrop-blur-sm bg-black/30 border-blue-500/30 shadow-2xl shadow-blue-500/20 rounded-3xl p-6">
                      <div className="cyber-gradient-line" />
                      <h3 className="text-xl font-semibold text-blue-400">{job.attributes.title}</h3>
                      <p className="text-gray-400 mb-2">{job.attributes.company} | {job.attributes.duration}</p>
                      <ul className="list-disc list-inside text-gray-300">
                        {Array.isArray(job.attributes.description) ? (
                          job.attributes.description.map((item, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {item.children?.[0]?.children?.[0]?.text || 'No description available'}
                            </li>
                          ))
                        ) : (
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            No description available
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))
            ) : (
              <p>No experience data available</p>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.length > 0 && Object.entries(skills[0].attributes).map(([category, skillList]) => {
              if (['Technical_Skills', 'Analytical_Skills', 'Communication_Skills'].includes(category) && Array.isArray(skillList)) {
                return (
                  <div key={category} className="overflow-hidden backdrop-blur-sm bg-black/30 border-blue-500/30 shadow-2xl shadow-blue-500/20 rounded-3xl p-6">
                    <div className="cyber-gradient-line" />
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">{category.replace('_', ' ')}</h3>
                    <ul className="space-y-2">
                      {skillList.map((item, skillIndex) => (
                        <li key={skillIndex} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {item.children[0].children[0].text}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="overflow-hidden backdrop-blur-sm bg-black/30 border-blue-500/30 shadow-2xl shadow-blue-500/20 rounded-3xl p-6">
                <div className="cyber-gradient-line" />
                <div className="flex items-center mb-4">
                  <div className="bg-white p-3 rounded-2xl mr-4 flex-shrink-0">
                    <Image
                      src={prependApiUrl(cert.attributes.logo.data.attributes.url)}
                      alt={`${cert.attributes.Name} logo`}
                      width={80}
                      height={80}
                      style={{ width: "80px", height: "80px", objectFit: "contain" }}
                      priority
                      quality={100}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-400">{cert.attributes.Name}</h3>
                    <p className="text-sm text-gray-400">{cert.attributes.Organization}</p>
                    <p className="text-sm text-gray-400">
                      Obtained: {new Date(cert.attributes.Issued).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <a
                  href={cert.attributes.Show_Credential}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 mt-4 border-2 border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300"
                >
                  <span className="mr-2">View Credential</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}