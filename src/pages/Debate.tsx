import { Link } from "react-router-dom";
import { useMemo, useState } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import {
  Box, Chip, Typography, Link as MuiLink, ThemeProvider, createTheme,
  Select, MenuItem, FormControl, InputLabel, OutlinedInput, useTheme,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import { topics, type Subtopic, type StanceDetails } from '@/data/topics';
import { candidateData, allCandidates } from '@/data/candidateStances';

type TableData = Subtopic & {
  stances: Record<string /* candidate.id */, StanceDetails | undefined>;
};

const StancePill = ({ stance, gist }: { stance: StanceDetails['stance'], gist: string }) => {
  if (!stance) {
    return <Typography variant="caption" color="text.secondary">No hay datos</Typography>;
  }

  const color =
    stance === 'A favor' ? 'success' :
    stance === 'En contra' ? 'error' :
    stance === 'Mixto' ? 'warning' :
    'default';

  return (
    <Chip
      size="small"
      label={gist}
      color={color}
      variant="outlined"
      title={`${stance}: ${gist}`}
      sx={{ height: 'auto', '& .MuiChip-label': { display: 'block', whiteSpace: 'normal', padding: '4px 0' } }}
    />
  );
};

export function DebatePage() {
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState(() => allCandidates.map(c => c.id));
  const muiTheme = useTheme();

  const selectedTopic = useMemo(() => topics.find(t => t.id === selectedTopicId)!, [selectedTopicId]);

  const tableData = useMemo<TableData[]>(() => {
    return selectedTopic.subtopics.map(subtopic => {
      const stances: Record<string, StanceDetails | undefined> = {};
      for (const candidate of candidateData) {
        stances[candidate.id] = candidate.stances[subtopic.id];
      }
      return {
        ...subtopic,
        stances,
      };
    });
  }, [selectedTopic]);

  const columns = useMemo<MRT_ColumnDef<TableData>[]>(() => {
    const candidateColumns: MRT_ColumnDef<TableData>[] = selectedCandidateIds
      .map(id => allCandidates.find(c => c.id === id)!)
      .map(candidate => ({
        id: candidate.id,
        header: candidate.name,
        accessorFn: (row) => row.stances[candidate.id],
        Cell: ({ cell }) => {
          const value = cell.getValue() as StanceDetails | undefined;
          if (!value) {
            return <Typography variant="caption" color="text.secondary">No hay datos</Typography>;
          }
          return <StancePill stance={value.stance} gist={value.gist} />;
        },
        size: 200,
      }));

    return [
      {
        accessorKey: 'name',
        header: 'Sub-tema',
        size: 250,
        muiTableHeadCellProps: {
          sx: {
            position: 'sticky',
            left: 0,
            zIndex: 2,
            backgroundColor: 'var(--card)'
          }
        },
        muiTableBodyCellProps: {
          sx: {
            position: 'sticky',
            left: 0,
            zIndex: 1,
            backgroundColor: 'var(--card)',
            fontWeight: 'bold'
          }
        },
      },
      {
        id: 'science',
        header: 'Science (RCT)',
        accessorFn: (row) => row.science,
        Cell: ({ cell }) => {
          const value = cell.getValue() as StanceDetails;
          return <StancePill stance={value.stance} gist={value.gist} />;
        },
        size: 200,
        muiTableHeadCellProps: {
          sx: {
            position: 'sticky',
            left: 250,
            zIndex: 2,
            backgroundColor: 'var(--card)'
          }
        },
        muiTableBodyCellProps: {
          sx: {
            position: 'sticky',
            left: 250,
            zIndex: 1,
            backgroundColor: 'var(--card)',
          }
        },
      },
      ...candidateColumns,
    ];
  }, [selectedCandidateIds]);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: 'hsl(var(--background))',
        paper: 'hsl(var(--card))',
      },
      text: {
        primary: 'hsl(var(--foreground))',
        secondary: 'hsl(var(--muted-foreground))',
      }
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: 'hsl(var(--border))',
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: 'hsl(var(--card))'
          }
        }
      }
    }
  });

  const handleCandidateChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    const newSelection = typeof value === 'string' ? value.split(',') : value;
    if (newSelection.length > 0) {
      setSelectedCandidateIds(newSelection);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'hsl(var(--foreground))', fontFamily: "'Press Start 2P', cursive", fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Debate: Matriz de Posturas
      </Typography>

      <ThemeProvider theme={darkTheme}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="topic-select-label">Tema</InputLabel>
            <Select
              labelId="topic-select-label"
              value={selectedTopicId}
              label="Tema"
              onChange={(e) => setSelectedTopicId(e.target.value)}
            >
              {topics.map(topic => (
                <MenuItem key={topic.id} value={topic.id}>{topic.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="candidate-select-label">Candidatos</InputLabel>
            <Select
              labelId="candidate-select-label"
              multiple
              value={selectedCandidateIds}
              onChange={handleCandidateChange}
              input={<OutlinedInput label="Candidatos" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const candidate = allCandidates.find(c => c.id === id);
                    return <Chip key={id} label={candidate?.name} size="small" />;
                  })}
                </Box>
              )}
            >
              {allCandidates.map((candidate) => (
                <MenuItem key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <MaterialReactTable
          columns={columns}
          data={tableData}
          enableColumnResizing
          enableExpanding
          enableStickyHeader
          enableStickyFooter
          muiTableContainerProps={{ sx: { maxHeight: '70vh' } }}
          renderDetailPanel={({ row }) => (
            <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              <div>
                <Typography variant="h6" component="h3">Evidencia Científica (RCT)</Typography>
                <Typography variant="body2" sx={{ my: 1, whiteSpace: 'pre-wrap' }}>
                  {row.original.science.evidence}
                </Typography>
                <MuiLink href={row.original.science.source} target="_blank" rel="noopener" variant="caption">
                  Fuente: {row.original.science.source}
                </MuiLink>
              </div>
              {selectedCandidateIds.map(id => {
                const stance = row.original.stances[id];
                const candidate = allCandidates.find(c => c.id === id);
                if (!stance) return null;
                return (
                  <div key={id}>
                    <Typography variant="h6" component="h3">{candidate?.name}</Typography>
                    <Typography variant="body2" sx={{ my: 1, whiteSpace: 'pre-wrap' }}>
                      {stance.evidence}
                    </Typography>
                    <MuiLink href={stance.source} target="_blank" rel="noopener" variant="caption">
                      Fuente: {stance.source}
                    </MuiLink>
                  </div>
                );
              })}
            </Box>
          )}
        />
      </ThemeProvider>
       <footer className="text-center text-muted-foreground text-xs mt-8">
          <p>Última actualización: 31 de julio de 2025</p>
          <Link to="/about" className="underline hover:text-foreground">Nuestra Metodología</Link>
          <span className="mx-2">|</span>
          <a href="#" className="underline hover:text-foreground" onClick={(e) => { e.preventDefault(); alert('Descarga de CSV próximamente'); }}>Descargar CSV</a>
        </footer>
    </div>
  );
}