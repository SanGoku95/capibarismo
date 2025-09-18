import { useMemo } from "react";
import { candidates, Candidate } from "@/data/candidates";
import { candidateIssuePositions, onboardingIssues, normaliseLean } from "@/data/issues";
import { useOnboardingStore } from "@/store/useOnboardingStore";

export interface MatchScore {
  candidate: Candidate;
  score: number;
}

export function useMatchResults() {
  const { selectedIssues, lean } = useOnboardingStore((state) => ({
    selectedIssues: state.selectedIssues,
    lean: state.lean,
  }));

  return useMemo<MatchScore[]>(() => {
    const activeIssues = selectedIssues.length > 0 ? selectedIssues : onboardingIssues.map((issue) => issue.id).slice(0, 3);
    const userLean = normaliseLean(lean);

    const weight = activeIssues.length > 0 ? 1 / activeIssues.length : 0;

    const scores = candidates.map((candidate) => {
      const issueScores = activeIssues.map((issueId) => {
        const candidateValue = candidateIssuePositions[candidate.id]?.[issueId];
        if (candidateValue === undefined) {
          return 0.35 * weight;
        }
        const difference = Math.abs(candidateValue - userLean);
        const closeness = Math.max(0, 1 - difference / 2);
        return closeness * weight;
      });

      const totalScore = issueScores.reduce((sum, value) => sum + value, 0);
      return { candidate, score: totalScore };
    });

    return scores.sort((a, b) => b.score - a.score);
  }, [lean, selectedIssues]);
}

