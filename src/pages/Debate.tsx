import { Link } from "react-router-dom";
import { useMemo } from 'react';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Box, Chip, Typography, Link as MuiLink, ThemeProvider, createTheme } from '@mui/material';
import { debateData, issues, type DebateTopic, type Stance } from '@/data/debate';

// Define the missing type for the stance details
type StanceDetails = {
  stance: Stance | null;
  gist: string;
  evidence: string;
  source: string;
};

const StancePill = ({ stance, gist }: { stance: Stance | null, gist: string }) => {
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
  const columns = useMemo<MRT_ColumnDef<DebateTopic>[]>(
    () => [
      {
        accessorKey: 'actor',
        header: 'Candidato',
        size: 150,
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
      ...issues.map((issue) => ({
        id: issue,
        header: issue,
        accessorFn: (row) => row.stances[issue],
        Cell: ({ cell }) => {
          const value = cell.getValue() as StanceDetails | undefined;
          if (!value) {
            return <Typography variant="caption" color="text.secondary">No hay datos</Typography>;
          }
          return <StancePill stance={value.stance} gist={value.gist} />;
        },
        size: 200,
      })),
    ],
    [],
  );

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
      }
    }
  });

  return (
    <div className="container mx-auto py-8">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'hsl(var(--foreground))', fontFamily: "'Press Start 2P', cursive" }}>
        Debate: Matriz de Posturas
      </Typography>
      <ThemeProvider theme={darkTheme}>
        <MaterialReactTable
          columns={columns}
          data={debateData}
          enableColumnResizing
          enableExpanding
          enableStickyHeader
          enableStickyFooter
          muiTableContainerProps={{ sx: { maxHeight: '70vh' } }}
          renderDetailPanel={({ row }) => (
            <Box sx={{ p: 2, display: 'grid', gap: 2 }}>
              {issues.map((issue) => {
                const topicData = row.original.stances[issue];
                if (!topicData) {
                  return (
                    <div key={issue}>
                      <Typography variant="h6" component="h3">{issue}</Typography>
                      <Typography variant="body2" sx={{ my: 1, color: 'text.secondary' }}>
                        No hay información detallada disponible.
                      </Typography>
                    </div>
                  );
                }
                return (
                  <div key={issue}>
                    <Typography variant="h6" component="h3">{issue}</Typography>
                    <Typography variant="body2" sx={{ my: 1, whiteSpace: 'pre-wrap' }}>
                      {topicData.evidence}
                    </Typography>
                    <MuiLink href={topicData.source} target="_blank" rel="noopener" variant="caption">
                      Fuente: {topicData.source}
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