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
  Paper,
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
  pro: '#4ade80',      // green-400
  contra: '#f87171',   // red-400
  neutral: '#94a3b8',  // slate-400
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
  const color = stanceColour[value.stance] ?? '#ffffffff'; // zinc-600
  const bg = alpha(color, 0.15);
  const textShadow = `0 0 8px ${alpha(color, 0.4)}`;

  return (
    <Tooltip title={`${value.stance.toUpperCase()}: ${value.gist}`} arrow>
      <Chip
        size="small"
        label={truncate(value.gist, 50)}
        sx={{
          height: 'auto',
          minHeight: '24px',
          backgroundColor: bg,
          color: lighten(color, 0.2),
          textShadow: textShadow,
          fontWeight: 600,
          lineHeight: 1.45,
          whiteSpace: 'normal',
          textAlign: 'center',
          maxWidth: 180,
          '& .MuiChip-label': {
            paddingBlock: '4px',
            paddingInline: '8px',
          },
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
        muiTableBodyCellProps: {
          sx: {
            fontWeight: 600,
            minWidth: 140,
          },
        },
      },
      {
        id: 'science',
        header: '🧪 Expertos (PCA)',
        accessorFn: (row) => row.science,
        Cell: ({ cell }) => <StanceChip value={cell.getValue<StanceDetails>()} />,
        size: 200,
      },
      ...candidateCols,
    ];
  }, [selectedCandidateIds]);

  // — custom dark theme tweaks —
  const darkTheme = useMemo(() =>
    createTheme({
      palette: {
        mode: 'dark',
        background: { default: '#020617', paper: '#0f172a' }, // slate-950, slate-900
        primary: { main: '#38bdf8' }, // sky-400
        text: { primary: '#e2e8f0', secondary: '#94a3b8' }, // slate-200, slate-400
        divider: 'rgba(148, 163, 184, 0.2)', // slate-400/20%
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
            body: {
              background: 'radial-gradient(circle at 10% 20%, rgb(2, 6, 23, 0.9), rgb(2, 6, 23) 80%), radial-gradient(circle at 90% 80%, rgb(15, 23, 42, 0.8), rgb(2, 6, 23) 70%)',
              backgroundAttachment: 'fixed',
            }
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: ({ theme }) => ({
              transition: 'background-color 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }),
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: ({ theme }) => ({
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(8px)',
              borderBottom: `1px solid ${theme.palette.divider}`,
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'none',
              letterSpacing: '0.2px',
            }),
            root: ({ theme }) => ({
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              borderRight: 'none', // remove vertical borders
              padding: '12px 16px',
              fontSize: '0.93rem',
            }),
          },
        },
        MuiChip: {
          styleOverrides: {
            root: { borderRadius: 6, paddingInline: 4 },
            label: { paddingInline: 4 },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none', // remove weird gradient on paper
            }
          }
        },
        MuiSelect: {
          styleOverrides: {
            icon: {
              color: '#e2e8f0', // slate-400
            }
          }
        }
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
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h1"
              sx={{
                color: '#f0f0f0',
                fontFamily: "'Press Start 2P', cursive",
                textShadow: '0 0 4px #ec4899, 0 0 10px #ec4899, 0 0 20px #ec4899',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                mb: 1,
              }}
            >
              Debate Matrix
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Análisis comparativo de las posturas de los candidatos.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              mb: 4,
              bgcolor: 'rgba(15, 23, 42, 0.5)', // slate-900
              backdropFilter: 'blur(12px)',
              border: '1px solid',
              borderColor: 'rgba(148, 163, 184, 0.2)', // slate-400
              borderRadius: 4,
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
          </Paper>

          <Paper
            elevation={12}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'rgba(148, 163, 184, 0.2)',
              bgcolor: 'background.default',
              backgroundImage: 'none',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)',
            }}
          >
            <MaterialReactTable
              columns={columns}
              data={tableData}
              enableColumnResizing
              enableStickyHeader
              enablePinning
              initialState={{
                density: 'compact',
                columnPinning: { left: ['mrt-expand', 'name'] },
              }}
              muiTableContainerProps={{ sx: { maxHeight: '70vh' } }}
              renderDetailPanel={({ row }) => (
                <Box sx={{ p: { xs: 2, md: 3 }, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: { xs: 3, md: 4 }, bgcolor: 'rgba(0,0,0,0.2)' }}>
                  <div>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      Evidencia Científica (RCT)
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1, color: 'text.secondary' }}>
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
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1, color: 'text.secondary' }}>
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
          </Paper>

          <Box component="footer" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.75rem', mt: 6 }}>
            <p>Última actualización: 31 de julio de 2025</p>
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
              <Link to="/about" className="underline hover:text-sky-400 transition-colors">
                Nuestra Metodología
              </Link>
              <span className="opacity-50">|</span>
              <MuiLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Descarga de CSV próximamente');
                }}
                className="underline hover:text-sky-400 transition-colors"
              >
                Descargar CSV
              </MuiLink>
            </Stack>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
