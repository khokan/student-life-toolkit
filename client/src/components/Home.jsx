import React from 'react'
import FeatureCard from '../components/FeatureCard'

const features = [
  { title: 'Class Schedule', desc: 'CRUD subjects, time, instructor, color-coded', to: '/schedule' },
  { title: 'Budget Tracker', desc: 'Track income & expenses with charts', to: '/budget' },
  { title: 'Exam Q&A', desc: 'Generate random practice questions', to: '/exam' },
  { title: 'Study Planner', desc: 'Tasks, deadlines, slots & priorities', to: '/planner' }
]

export default function Home(){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map(f=> <FeatureCard key={f.title} {...f} />)}
    </div>
  )
}