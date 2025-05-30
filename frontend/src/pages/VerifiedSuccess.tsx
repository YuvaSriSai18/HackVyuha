import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"

const VerifiedSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-700 mb-2">Verification Successful!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Your email address has been successfully verified. You may now access all features of ResearchChain.
        </p>
        <Button onClick={() => navigate("/dashboard")} className="w-full">
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  )
}

export default VerifiedSuccess
