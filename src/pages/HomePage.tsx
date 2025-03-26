import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header>
        <div>
          <h1>Workout App</h1>
          <Button onClick={logout}>Log Out</Button>
        </div>
      </header>

      <main>
        <div>
          <h2 className="text-lg font-medium mb-4">Welcome, {user?.email}</h2>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
