import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Chip,
  Typography,
  Link as MuiLink,
  ThemeProvider,
  createTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  useTheme,
  Stack,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import { alpha, lighten } from '@mui/material/styles';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { topics, type Subtopic, type StanceDetails } from '@/data/topics';
import { candidateData, allCandidates } from '@/data/candidateStances';

// -----------------------------------------------------------------------------
// 1.  Types & helpers -----------------------------------------------------------
// -----------------------------------------------------------------------------

type TableData = Subtopic & {
  stances: Record<string /* candidate.id */, StanceDetails | undefined>;
};

const stanceColour = {
  pro: '#22c55e',      // green‑500
  contra: '#ef4444',   // red‑500
  neutral: '#a1a1aa',  // zinc‑400
};

function truncate(text: string, n = 35) {
  return text.length > n ? `${text.slice(0, n - 1)}…` : text;
}

const StanceChip = ({ value }: { value?: StanceDetails }) => {
  if (!value) {
    return (
      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        —
      </Typography>
    );
  }
  const bg = alpha(stanceColour[value.stance] ?? '#3f3f46', 0.15);
  const border = stanceColour[value.stance] ?? '#3f3f46';

  return (
    <Tooltip title={`${value.stance}: ${value.gist}`} arrow>
      <Chip
        size="small"
        label={truncate(value.gist)}
        sx={{
          backgroundColor: bg,
          borderColor: border,
          color: border,
          borderWidth: 1,
          borderStyle: 'solid',
          fontWeight: 500,
          lineHeight: 1.3,
          whiteSpace: 'normal',
          maxWidth: 180,
        }}
      />
    </Tooltip>
  );
};

// -----------------------------------------------------------------------------
// 2.  Component ----------------------------------------------------------------
// -----------------------------------------------------------------------------

export default function DebatePage() {
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(
    () => allCandidates.map((c) => c.id),
  );
  const systemTheme = useTheme();

  const selectedTopic = useMemo(() => topics.find((t) => t.id === selectedTopicId)!, [selectedTopicId]);

  const tableData = useMemo<TableData[]>(() => {
    return selectedTopic.subtopics.map((subtopic) => {
      const stances: Record<string, StanceDetails | undefined> = {};
      for (const cand of candidateData) {
        stances[cand.id] = cand.stances[subtopic.id];
      }
      return { ...subtopic, stances };
    });
  }, [selectedTopic]);

  const columns = useMemo<MRT_ColumnDef<TableData>[]>(() => {
    const candidateCols: MRT_ColumnDef<TableData>[] = selectedCandidateIds.map((id) => {
      const cand = allCandidates.find((c) => c.id === id)!;
      return {
        id: id,
        header: cand.name,
        accessorFn: (row) => row.stances[id],
        Cell: ({ cell }) => <StanceChip value={cell.getValue<StanceDetails | undefined>()} />,
        size: 190,
      };
    });

    return [
      {
        accessorKey: 'name',
        header: 'Sub‑tema',
        size: 240,
        muiTableHeadCellProps: {
          sx: {
            position: 'sticky',
            left: 0,
            zIndex: 3,
            backgroundColor: 'hsl(var(--card-dark)) !important',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            position: 'sticky',
            left: 0,
            zIndex: 2,
            backgroundColor: 'hsl(var(--card))',
            fontWeight: 600,
            minWidth: 140,
          },
        },
      },
      {
        id: 'science',
        header: 'Science (RCT)',
        accessorFn: (row) => row.science,
        Cell: ({ cell }) => <StanceChip value={cell.getValue<StanceDetails>()} />,
        size: 200,
        muiTableHeadCellProps: {
          sx: {
            position: 'sticky',
            left: 240,
            zIndex: 3,
            backgroundColor: 'hsl(var(--card-dark)) !important',
          },
        },
        muiTableBodyCellProps: {
          sx: {
            position: 'sticky',
            left: 240,
            zIndex: 2,
            backgroundColor: 'hsl(var(--card))',
          },
        },
      },
      ...candidateCols,
    ];
  }, [selectedCandidateIds]);

  // — custom dark theme tweaks —
  const darkTheme = useMemo(() =>
    createTheme({
      palette: {
        mode: 'dark',
        background: { default: '#0d0d12', paper: '#111116' },
        primary: { main: '#38bdf8' },
        text: { primary: '#e5e5e5', secondary: '#a1a1aa' },
        divider: alpha('#ffffff', 0.12),
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: 15,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            html: {
              fontSize: 'clamp(1rem, 2.2vw, 1.05rem)',
              scrollBehavior: 'smooth',
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              '&:nth-of-type(even)': { backgroundColor: 'rgba(255,255,255,.02)' },
              '&:hover': { backgroundColor: 'rgba(56,189,248,.08)' },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              backgroundColor: '#18181d',
              borderBottom: '1px solid rgba(255,255,255,.12)',
            },
            root: {
              borderColor: 'rgba(255,255,255,.12)',
              fontSize: '0.93rem',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: { borderRadius: 6, paddingInline: 4 },
            label: { paddingInline: 4 },
          },
        },
      },
    }),
    [],
  );

  const handleCandidateChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const newSel = typeof value === 'string' ? value.split(',') : value;
    if (newSel.length) setSelectedCandidateIds(newSel);
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="container mx-auto py-8">
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          color: '#f0f0f0',
          fontFamily: "'Press Start 2P', cursive",
          textShadow: '0 0 6px #ec4899',
          fontSize: { xs: '1.4rem', md: '2rem' },
        }}
      >
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
              {topics.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
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
              renderValue={(sel) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {sel.map((id) => {
                    const cand = allCandidates.find((c) => c.id === id);
                    return <Chip key={id} label={cand?.name} size="small" />;
                  })}
                </Box>
              )}
              MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
            >
              {allCandidates.map((cand) => (
                <MenuItem key={cand.id} value={cand.id}>
                  {cand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Box sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
          <MaterialReactTable
            columns={columns}
            data={tableData}
            enableColumnResizing
            enableStickyHeader
            enableStickyFooter
            enableExpanding
            muiTableContainerProps={{ sx: { maxHeight: '70vh' } }}
            renderDetailPanel={({ row }) => (
              <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 4 }}>
                <div>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Evidencia Científica (RCT)
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                    {row.original.science.evidence}
                  </Typography>
                  <MuiLink href={row.original.science.source} target="_blank" rel="noopener" variant="caption">
                    Fuente
                  </MuiLink>
                </div>
                {selectedCandidateIds.map((id) => {
                  const stance = row.original.stances[id];
                  const cand = allCandidates.find((c) => c.id === id);
                  if (!stance) return null;
                  return (
                    <div key={id}>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        {cand?.name}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                        {stance.evidence}
                      </Typography>
                      <MuiLink href={stance.source} target="_blank" rel="noopener" variant="caption">
                        Fuente
                      </MuiLink>
                    </div>
                  );
                })}
              </Box>
            )}
          />
        </Box>
      </ThemeProvider>

      <footer className="text-center text-muted-foreground text-xs mt-8">
        <p>Última actualización: 31 de julio de 2025</p>
        <Link to="/about" className="underline hover:text-foreground">
          Nuestra Metodología
        </Link>
        <span className="mx-2">|</span>
        <MuiLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert('Descarga de CSV próximamente');
          }}
          className="underline hover:text-foreground"
        >
          Descargar CSV
        </MuiLink>
      </footer>
    </div>
  );
}
