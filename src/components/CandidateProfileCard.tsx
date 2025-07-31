import { Link } from 'react-router-dom';
import { Candidate } from '@/data/candidates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CandidateProfileCardProps {
  candidate: Candidate;
}

export function CandidateProfileCard({ candidate }: CandidateProfileCardProps) {
  return (
    <Card className="fighting-game-card">
      <CardHeader>
        <Link to={`/candidate/${candidate.id}`}>
          <CardTitle className="hover:underline">{candidate.nombre}</CardTitle>
        </Link>
        <Badge>{candidate.ideologia}</Badge>
      </CardHeader>
      <CardContent>
        <img src={candidate.fullBody} alt={candidate.nombre} className="w-full rounded-md" />
        <p className="mt-4 text-sm text-muted-foreground">{candidate.summary}</p>
      </CardContent>
    </Card>
  );
}