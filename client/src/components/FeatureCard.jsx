
import { motion } from "framer-motion";
import { Link } from "react-router";



export default function FeatureCard({ title, description, icon, to }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="w-full sm:w-72"
    >
      <div className="card rounded-2xl shadow-md border border-base-200 hover:shadow-lg transition-all bg-base-100">
        <div className="card-body p-6">
          <div className="flex items-center gap-3 mb-4">
            {icon && <div className="text-primary text-2xl">{icon}</div>}
            <h3 className="card-title text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">{description}</p>
          <Link to={to}>
            <button className="btn btn-primary w-full rounded-xl">
              Open
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}