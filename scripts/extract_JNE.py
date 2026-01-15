import requests
import pandas as pd
import json
from datetime import datetime
import time
import warnings

# Suppress SSL warnings
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

# Define the candidates data
candidates_data = [
    {"partido": "FUERZA POPULAR", "persona": "Keiko Fujimori", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=245741"},
    {"partido": "FUERZA POPULAR", "persona": "Luis Galarreta", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=246699"},
    {"partido": "FUERZA POPULAR", "persona": "Miguel Torres", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=251995"},
    {"partido": "RENOVACION POPULAR", "persona": "Rafael Lopez", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=245620"},
    {"partido": "RENOVACION POPULAR", "persona": "Norma Yarrow", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=251570"},
    {"partido": "RENOVACION POPULAR", "persona": "Jhon Ramos", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=246127"},
    {"partido": "PARTIDO POLITICO COOPERACION POPULAR", "persona": "Yonhy Lescano", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=245572"},
    {"partido": "PARTIDO POLITICO COOPERACION POPULAR", "persona": "Carmela Salazar", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=243645"},
    {"partido": "PARTIDO POLITICO COOPERACION POPULAR", "persona": "Vanessa Lazo", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=246583"},
    {"partido": "PARTIDO PAIS PARA TODOS", "persona": "Carlos Alvarez", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=247143"},
    {"partido": "PARTIDO PAIS PARA TODOS", "persona": "Maria Chambizea", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=248698"},
    {"partido": "PARTIDO PAIS PARA TODOS", "persona": "Diego Guevara", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=248124"},
    {"partido": "ALIANZA PARA EL PROGRESO", "persona": "Cesar Acuña", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=245682"},
    {"partido": "ALIANZA PARA EL PROGRESO", "persona": "Jessica Tumi", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=246620"},
    {"partido": "ALIANZA PARA EL PROGRESO", "persona": "Alejandro Soto", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=246179"},
    {"partido": "AHORA NACION - AN", "persona": "Alfonso Lopez Chau", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=248006"},
    {"partido": "AHORA NACION - AN", "persona": "Luis Villanueva", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=244896"},
    {"partido": "AHORA NACION - AN", "persona": "Ruth Buendia", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=244518"},
    {"partido": "PARTIDO CIVICO OBRAS", "persona": "Ricardo Belmont", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=251773"},
    {"partido": "PARTIDO CIVICO OBRAS", "persona": "Daniel Barragan", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=251521"},
    {"partido": "PARTIDO CIVICO OBRAS", "persona": "Dina Hancco", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=243959"},
    {"partido": "PARTIDO POLITICO NACIONAL PERU LIBRE", "persona": "Vladimir Cerron", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=244668"},
    {"partido": "PARTIDO POLITICO NACIONAL PERU LIBRE", "persona": "Flavio Cruz", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=252233"},
    {"partido": "PARTIDO POLITICO NACIONAL PERU LIBRE", "persona": "Bertha Rojas", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=252374"},
    {"partido": "PARTIDO FRENTE DE LA ESPERANZA 2021", "persona": "Fernando Olivera", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=252450"},
    {"partido": "PARTIDO FRENTE DE LA ESPERANZA 2021", "persona": "Elizabeth Leon", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=252087"},
    {"partido": "PARTIDO FRENTE DE LA ESPERANZA 2021", "persona": "Carlos Cuaresma", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=243625"},
    {"partido": "JUNTOS POR EL PERU", "persona": "Roberto Sanchez", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=246281"},
    {"partido": "JUNTOS POR EL PERU", "persona": "Anali Marquez", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=245814"},
    {"partido": "JUNTOS POR EL PERU", "persona": "Brigida Curo", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=252388"},
    {"partido": "PARTIDO MORADO", "persona": "Mesias Guevara", "candidatura": "Presidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=246025"},
    {"partido": "PARTIDO MORADO", "persona": "Heber Cueva", "candidatura": "1er Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=252805"},
    {"partido": "PARTIDO MORADO", "persona": "Marisol Liñan", "candidatura": "2do Vicepresidente", "api": "https://apiplataformaelectoral8.jne.gob.pe/api/v1/candidato/hoja-vida?idHojaVida=252097"},
]

def fetch_candidate_data(url):
    """Fetch data from the API endpoint."""
    try:
        response = requests.get(url, verify=False,  timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_relevant_fields(api_data):
    """Extract relevant fields from the API response."""
    if not api_data:
        return {}
    
    extracted = {}
    
    # Extract basic information from datoGeneral
    dato_general = api_data.get('datoGeneral', {})
    if dato_general:
        extracted['nombres'] = dato_general.get('nombres', '')
        extracted['apellido_paterno'] = dato_general.get('apellidoPaterno', '')
        extracted['apellido_materno'] = dato_general.get('apellidoMaterno', '')
        extracted['dni'] = dato_general.get('numeroDocumento', '')
        sexo_code = dato_general.get('sexo', '')
        extracted['sexo'] = 'FEMENINO' if sexo_code == '2' else 'MASCULINO' if sexo_code == '1' else ''
        extracted['fecha_nacimiento'] = dato_general.get('feNacimiento', '')
        extracted['lugar_nacimiento'] = f"{dato_general.get('naciDistrito', '')} - {dato_general.get('naciProvincia', '')} - {dato_general.get('naciDepartamento', '')}"
        extracted['domicilio'] = f"{dato_general.get('domiDistrito', '')} - {dato_general.get('domiProvincia', '')} - {dato_general.get('domiDepartamento', '')}"
        extracted['estado_candidatura'] = dato_general.get('estado', '')
    
    # Extract education - Universidad
    educacion_universitaria = api_data.get('formacionAcademica', {}).get('educacionUniversitaria', [])
    if educacion_universitaria:
        edu_uni = []
        for edu in educacion_universitaria:
            universidad = edu.get('universidad', '')
            carrera = edu.get('carreraUni', '')
            concluido = 'Concluido' if edu.get('concluidoEduUni') == 'SI' else 'En curso'
            edu_uni.append(f"{universidad} - {carrera} ({concluido})")
        extracted['educacion_universitaria'] = ' | '.join(edu_uni)
    else:
        extracted['educacion_universitaria'] = ''
    
    # Extract education - Posgrado
    educacion_posgrado = api_data.get('formacionAcademica', {}).get('educacionPosgrado', [])
    if educacion_posgrado:
        posgrados = []
        for pg in educacion_posgrado:
            centro = pg.get('txCenEstudioPosgrado', '')
            especialidad = pg.get('txEspecialidadPosgrado', '')
            posgrados.append(f"{centro} - {especialidad}")
        extracted['posgrados'] = ' | '.join(posgrados)
    else:
        extracted['posgrados'] = ''
    
    # Extract work experience
    experiencia_list = api_data.get('experienciaLaboral', [])
    if experiencia_list:
        experiencia = []
        for exp in experiencia_list[:5]:  # Limit to first 5
            empresa = exp.get('centroTrabajo', '')
            cargo = exp.get('ocupacionProfesion', '')
            desde = exp.get('anioTrabajoDesde', '')
            hasta = exp.get('anioTrabajoHasta', '')
            experiencia.append(f"{cargo} en {empresa} ({desde}-{hasta})")
        extracted['experiencia_laboral'] = ' | '.join(experiencia)
    else:
        extracted['experiencia_laboral'] = ''
    
    # Extract political party experience
    cargo_partidario = api_data.get('trayectoria', {}).get('cargoPartidario', [])
    if cargo_partidario:
        cargos_part = []
        for cargo in cargo_partidario:
            org = cargo.get('orgPolCargoPartidario', '')
            cargo_nombre = cargo.get('cargoPartidario', '')
            desde = cargo.get('anioCargoPartiDesde', '')
            hasta = cargo.get('anioCargoPartiHasta', '')
            cargos_part.append(f"{cargo_nombre} en {org} ({desde}-{hasta})")
        extracted['cargos_partidarios'] = ' | '.join(cargos_part)
    else:
        extracted['cargos_partidarios'] = ''
    
    # Extract electoral positions held
    cargo_eleccion = api_data.get('trayectoria', {}).get('cargoEleccion', [])
    if cargo_eleccion:
        cargos_elec = []
        for cargo in cargo_eleccion:
            cargo_nombre = cargo.get('cargoEleccion', '')
            org = cargo.get('orgPolCargoElec', '')
            desde = cargo.get('anioCargoElecDesde', '')
            hasta = cargo.get('anioCargoElecHasta', '')
            cargos_elec.append(f"{cargo_nombre} por {org} ({desde}-{hasta})")
        extracted['cargos_eleccion_previos'] = ' | '.join(cargos_elec)
    else:
        extracted['cargos_eleccion_previos'] = ''
    
    # Extract penal sentences
    sentencia_penal = api_data.get('sentenciaPenal', [])
    extracted['tiene_sentencias_penales'] = 'SÍ' if sentencia_penal else 'NO'
    extracted['num_sentencias_penales'] = len(sentencia_penal)
    if sentencia_penal:
        sentencias = []
        for sent in sentencia_penal:
            delito = sent.get('delito', '')
            fallo = sent.get('fallo', '')
            sentencias.append(f"{delito} - {fallo}")
        extracted['detalle_sentencias_penales'] = ' | '.join(sentencias)
    else:
        extracted['detalle_sentencias_penales'] = ''
    
    # Extract civil sentences
    sentencia_obliga = api_data.get('sentenciaObliga', [])
    extracted['tiene_sentencias_civiles'] = 'SÍ' if sentencia_obliga else 'NO'
    extracted['num_sentencias_civiles'] = len(sentencia_obliga)
    
    # Extract income information
    ingresos = api_data.get('declaracionJurada', {}).get('ingreso', [])
    if ingresos:
        ultimo_ingreso = ingresos[0]
        extracted['año_ingresos'] = ultimo_ingreso.get('anioIngresos', '')
        extracted['ingreso_total'] = ultimo_ingreso.get('totalIngresos', 0)
        extracted['ingreso_publico'] = ultimo_ingreso.get('remuBrutaPublico', 0)
        extracted['ingreso_privado'] = ultimo_ingreso.get('remuBrutaPrivado', 0)
    else:
        extracted['año_ingresos'] = ''
        extracted['ingreso_total'] = 0
        extracted['ingreso_publico'] = 0
        extracted['ingreso_privado'] = 0
    
    # Extract real estate
    bienes_inmuebles = api_data.get('declaracionJurada', {}).get('bienInmueble', [])
    extracted['num_bienes_inmuebles'] = len(bienes_inmuebles)
    if bienes_inmuebles:
        valor_inmuebles = sum(float(b.get('autoavaluo', 0) or 0) for b in bienes_inmuebles)
        extracted['valor_total_inmuebles'] = valor_inmuebles
    else:
        extracted['valor_total_inmuebles'] = 0
    
    # Extract vehicles and other movable property
    bienes_muebles = api_data.get('declaracionJurada', {}).get('bienMueble', [])
    extracted['num_vehiculos'] = len(bienes_muebles)
    if bienes_muebles:
        valor_vehiculos = sum(float(v.get('valor', 0) or 0) for v in bienes_muebles)
        extracted['valor_total_vehiculos'] = valor_vehiculos
    else:
        extracted['valor_total_vehiculos'] = 0
    
    return extracted

def main():
    print("Starting data extraction from JNE API...")
    print(f"Total candidates to process: {len(candidates_data)}\n")
    
    all_data = []
    
    for i, candidate in enumerate(candidates_data, 1):
        print(f"Processing {i}/{len(candidates_data)}: {candidate['persona']} ({candidate['partido']})")
        
        # Fetch API data
        api_response = fetch_candidate_data(candidate['api'])
        
        # Extract relevant fields
        extracted_data = extract_relevant_fields(api_response)
        
        # Combine with base data
        row_data = {
            'Partido': candidate['partido'],
            'Persona': candidate['persona'],
            'Candidatura': candidate['candidatura'],
            'ID_HojaVida': candidate['api'].split('=')[-1],
            **extracted_data
        }
        
        all_data.append(row_data)
        
        # Be nice to the API - wait a bit between requests
        time.sleep(0.5)
    
    # Create DataFrame
    df = pd.DataFrame(all_data)
    
    # Reorder columns for better readability
    column_order = [
        'Partido', 'Candidatura', 'Persona', 
        'nombres', 'apellido_paterno', 'apellido_materno',
        'dni', 'sexo', 'fecha_nacimiento', 'lugar_nacimiento', 'domicilio',
        'estado_candidatura',
        'educacion_universitaria', 'posgrados',
        'experiencia_laboral', 'cargos_partidarios', 'cargos_eleccion_previos',
        'tiene_sentencias_penales', 'num_sentencias_penales', 'detalle_sentencias_penales',
        'tiene_sentencias_civiles', 'num_sentencias_civiles',
        'año_ingresos', 'ingreso_total', 'ingreso_publico', 'ingreso_privado',
        'num_bienes_inmuebles', 'valor_total_inmuebles',
        'num_vehiculos', 'valor_total_vehiculos',
        'ID_HojaVida'
    ]
    
    # Only include columns that exist
    column_order = [col for col in column_order if col in df.columns]
    df = df[column_order]
    
    # Export to Excel
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    excel_filename = f'candidatos_jne_{timestamp}.xlsx'
    
    df.to_excel(excel_filename, index=False, engine='openpyxl')
    print(f"\n[OK] Data extracted successfully!")
    print(f"[OK] Excel file saved as: {excel_filename}")
    print(f"[OK] Total rows: {len(df)}")
    print(f"[OK] Total columns: {len(df.columns)}")
    
    # Also save as CSV for easier inspection
    csv_filename = f'candidatos_jne_{timestamp}.csv'
    df.to_csv(csv_filename, index=False, encoding='utf-8-sig')
    print(f"[OK] CSV file saved as: {csv_filename}")
    
    # Print summary
    print("\n--- Summary ---")
    print(f"Parties: {df['Partido'].nunique()}")
    print(f"Candidates: {len(df)}")
    print("\nCandidates by position:")
    print(df['Candidatura'].value_counts())
    
    return df

if __name__ == "__main__":
    df = main()
