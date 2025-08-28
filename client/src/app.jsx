import React from 'react'
// import Home from './routes/Home'
// import SchedulePage from './routes/SchedulePage'
// import BudgetPage from './routes/BudgetPage'
// import ExamPage from './routes/ExamPage'
// import PlannerPage from './routes/PlannerPage'

export default function App(){
  return (
    <div className="min-h-screen bg-base-200">
      <nav className="p-4 shadow-sm bg-white">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold">Student Life Toolkit</Link>
          <div className="space-x-2">
            <Link to="/">Home</Link>
            <Link to="/schedule">Schedule</Link>
            <Link to="/budget">Budget</Link>
            <Link to="/exam">Exam</Link>
            <Link to="/planner">Planner</Link>
          </div>
        </div>
      </nav>

    
    </div>
  )
}

