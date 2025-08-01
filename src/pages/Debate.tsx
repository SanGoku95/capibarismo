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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { alpha, lighten } from '@mui/material/styles';
// import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table'; // No longer needed
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
  const [expanded, setExpanded] = useState<string | false>(false);
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

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

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
        },
        MuiAccordion: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: 'background.paper',
              '&:before': {
                display: 'none',
              },
            },
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
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
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
              Compara qué opinan los candidatos sobre los temas más importantes
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

          <Box sx={{ my: 4, textAlign: 'center' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Opiniones sobre {selectedTopic.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Haz clic en una opinión para expandir y ver las posturas de los candidatos.
            </Typography>
          </Box>

          <Stack spacing={1}>
            {tableData.map((subtopic) => (
              <Accordion
                key={subtopic.id}
                expanded={expanded === subtopic.id}
                onChange={handleAccordionChange(subtopic.id)}
                elevation={3}
                sx={{ borderRadius: 3, overflow: 'hidden' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${subtopic.id}-content`}
                  id={`${subtopic.id}-header`}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      flexDirection: 'column',
                    },
                  }}
                >
                  <Typography variant="h6" component="h3" fontWeight={600}>{subtopic.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{subtopic.description}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.1)' }}>
                  <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
                    {/* Science Stance */}
                    <div>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>🧪 Expertos (PCA)</Typography>
                      <StanceChip value={subtopic.science} />
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1, color: 'text.secondary', fontSize: '0.8rem' }}>
                        {subtopic.science.evidence}
                      </Typography>
                      <MuiLink href={subtopic.science.source} target="_blank" rel="noopener" variant="caption">
                        Fuente
                      </MuiLink>
                    </div>
                    {/* Candidate Stances */}
                    {selectedCandidateIds.map(id => {
                      const stance = subtopic.stances[id];
                      const cand = allCandidates.find((c) => c.id === id);
                      if (!stance || !cand) return null;
                      return (
                        <div key={id}>
                          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>{cand.name}</Typography>
                          <StanceChip value={stance} />
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1, color: 'text.secondary', fontSize: '0.8rem' }}>
                            {stance.evidence}
                          </Typography>
                          <MuiLink href={stance.source} target="_blank" rel="noopener" variant="caption">
                            Fuente
                          </MuiLink>
                        </div>
                      );
                    })}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>

          <Box component="footer" sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.75rem', mt: 6 }}>
            <p>Última actualización: 1 de agosto de 2025</p>
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
