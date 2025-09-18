import { candidates } from "@/data/candidates";
import { candidateIssuePositions, compassIssues, IssueScore } from "@/data/issues";

export type CompassAnswerMap = Record<string, IssueScore | null>;

export const getQuestionsForUser = (selectedIssues: string[] | undefined) => {
  if (selectedIssues && selectedIssues.length > 0) {
    const preferred = compassIssues.filter((issue) => selectedIssues.includes(issue.id));
    const remainder = compassIssues.filter((issue) => !selectedIssues.includes(issue.id)).slice(0, 4 - preferred.length);
    return [...preferred, ...remainder];
  }
  return compassIssues.slice(0, 4);
};

const MAX_SCORE_PER_QUESTION = 2; // absolute difference between -1 and 1

const normaliseScore = (score: number, totalQuestions: number) => {
  const maxPossible = totalQuestions * MAX_SCORE_PER_QUESTION;
  const normalised = Math.max(0, Math.min(1, 1 - score / maxPossible));
  return Math.round(normalised * 100);
};

export const calculateMatchScores = (answers: CompassAnswerMap) => {
  const questionIds = Object.keys(answers);
  const activeQuestions = questionIds.filter((questionId) => answers[questionId] !== null);
  const totalQuestions = activeQuestions.length || questionIds.length || 1;

  return candidates.map((candidate) => {
    const stanceMap = candidateIssuePositions[candidate.id] ?? {};
    let distance = 0;
    questionIds.forEach((questionId) => {
      const userValue = answers[questionId];
      if (userValue === null) {
        distance += MAX_SCORE_PER_QUESTION / 2;
        return;
      }
      const candidateValue = stanceMap[questionId];
      if (typeof candidateValue === "number") {
        distance += Math.abs(candidateValue - userValue);
      } else {
        distance += MAX_SCORE_PER_QUESTION / 2;
      }
    });

    const score = normaliseScore(distance, questionIds.length || totalQuestions);

    return {
      candidateId: candidate.id,
      score,
    };
  });
};

export const buildCompareUrl = (leftId: string, rightId: string) => {
  const base = typeof window !== "undefined" ? window.location.origin : "https://capybarismo.pe";
  return `${base}/compare?a=${leftId}&b=${rightId}`;
};

export const buildCandidateUrl = (candidateId: string) => {
  const base = typeof window !== "undefined" ? window.location.origin : "https://capybarismo.pe";
  return `${base}/candidate/${candidateId}`;
};
