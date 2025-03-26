import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/api";
import { Button } from "../../components/ui/button";
import CreateProgramModal from "./components/CreateProgramModal";
import GenerateProgramModal from "./components/GenerateProgramModal";

interface Program {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

enum FitnessGoal {
  MUSCLE_GAIN = "muscle_gain",
  WEIGHT_LOSS = "weight_loss",
}

const ProgramCard = ({ program }: { program: Program }) => {
  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">{program.name}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {program.description || "No description"}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Created: {new Date(program.createdAt).toLocaleDateString()}
        </span>
        <Button variant="outline" size="sm">
          View
        </Button>
      </div>
    </div>
  );
};

const EmptyState = ({
  onCreateClick,
  onGenerateClick,
}: {
  onCreateClick: () => void;
  onGenerateClick: () => void;
}) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium mb-2">No programs yet</h3>
      <p className="text-gray-600 mb-6">
        Create or generate your first workout program to get started
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={onCreateClick}>Create Program</Button>
        <Button onClick={onGenerateClick} variant="secondary">
          Generate with AI
        </Button>
      </div>
    </div>
  );
};

export default function ProgramsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: programs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const response = await api.get("/programs");
      return response.data;
    },
  });

  const createProgramMutation = useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      const response = await api.post("/programs", { name, description });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setIsCreateModalOpen(false);
    },
  });

  const generateProgramMutation = useMutation({
    mutationFn: async ({
      daysPerWeek,
      goal,
      sessionMinutes,
    }: {
      daysPerWeek: number;
      goal: FitnessGoal;
      sessionMinutes: number;
    }) => {
      setIsGenerating(true);
      setIsGenerateModalOpen(false);
      const generateResponse = await api.post("/programs/generate", {
        daysPerWeek,
        goal,
        sessionMinutes,
      });

      return generateResponse.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      setIsGenerating(false);
    },
    onError: () => {
      setIsGenerating(false);
    },
  });

  const handleCreateProgram = (name: string, description: string) => {
    createProgramMutation.mutate({ name, description });
  };

  const handleGenerateProgram = (
    daysPerWeek: number,
    goal: FitnessGoal,
    sessionMinutes: number
  ) => {
    generateProgramMutation.mutate({
      daysPerWeek,
      goal,
      sessionMinutes,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold">My Programs</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Program
            </Button>
            <Button
              onClick={() => setIsGenerateModalOpen(true)}
              variant="secondary"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-500">
            Failed to load programs. Please try again.
          </div>
        ) : programs.length === 0 ? (
          <EmptyState
            onCreateClick={() => setIsCreateModalOpen(true)}
            onGenerateClick={() => setIsGenerateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program: Program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}

        {isGenerating && (
          <div className="fixed inset-0 bg-black/30 flex flex-col items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium mb-2">
                Generating Your Program...
              </h3>
            </div>
          </div>
        )}
      </main>

      <CreateProgramModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProgram}
      />

      <GenerateProgramModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onSubmit={handleGenerateProgram}
      />
    </div>
  );
}
