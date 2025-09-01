import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function FeatureCard({ title, description, icon, to, gradient, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="w-full group"
    >
      <Link to={to}>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6 h-full group-hover:border-gray-200">
          {/* Icon with gradient background */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">
              {icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Action Link */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
              Explore feature
            </span>
            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <ArrowRight className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Gradient accent line */}
          <div className={`h-1 bg-gradient-to-r ${gradient} rounded-full mt-4 w-0 group-hover:w-full transition-all duration-300`} />
        </div>
      </Link>
    </motion.div>
  );
}