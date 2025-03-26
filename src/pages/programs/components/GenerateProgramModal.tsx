import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

enum FitnessGoal {
  MUSCLE_GAIN = "muscle_gain",
  WEIGHT_LOSS = "weight_loss",
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    daysPerWeek: number,
    goal: FitnessGoal,
    sessionMinutes: number
  ) => void;
};

export default function GenerateProgramModal({
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [goal, setGoal] = useState<FitnessGoal>(FitnessGoal.MUSCLE_GAIN);
  const [sessionMinutes, setSessionMinutes] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(daysPerWeek, goal, sessionMinutes);
    setDaysPerWeek(3);
    setGoal(FitnessGoal.MUSCLE_GAIN);
    setSessionMinutes(60);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Generate Program</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="daysPerWeek" className="block mb-1 font-medium">
              Days Per Week
            </label>
            <Select
              value={daysPerWeek.toString()}
              onValueChange={(val) => setDaysPerWeek(Number(val))}
            >
              <SelectTrigger className="input">
                <SelectValue placeholder="Select days per week" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day} {day === 1 ? "day" : "days"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label htmlFor="goal" className="block mb-1 font-medium">
              Fitness Goal
            </label>
            <Select
              value={goal}
              onValueChange={(val) => setGoal(val as FitnessGoal)}
            >
              <SelectTrigger className="input">
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FitnessGoal.MUSCLE_GAIN}>
                  Muscle Gain
                </SelectItem>
                <SelectItem value={FitnessGoal.WEIGHT_LOSS}>
                  Weight Loss
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4">
            <label htmlFor="sessionMinutes" className="block mb-1 font-medium">
              Session Duration (minutes)
            </label>
            <Select
              value={sessionMinutes.toString()}
              onValueChange={(val) => setSessionMinutes(Number(val))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {[30, 45, 60, 75, 90].map((minutes) => (
                  <SelectItem key={minutes} value={minutes.toString()}>
                    {minutes} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Generate Program</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
