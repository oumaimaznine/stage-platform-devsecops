import { useAuth } from "../context/AuthContext";
import RecommendationTinder from "../components/RecommendationTinder";

export default function Recommendations() {
  const { user } = useAuth();

  const studentId = user?.student?.id || user?.student_id || user?.id;

  return (
    <div className="min-h-screen bg-[#f7fafb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <RecommendationTinder studentId={studentId} />
      </div>
    </div>
  );
}