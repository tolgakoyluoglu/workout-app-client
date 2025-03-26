import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <div>
        <h2 className="text-lg font-medium mb-4 text-center ">
          Welcome {user?.email}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md border">
          <h3 className="font-medium mb-2">Your Workout Programs</h3>
          <p className="text-sm text-gray-600 mb-3">
            Create and manage your workout programs.
          </p>
          <Link to="/programs">
            <Button>View Programs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
