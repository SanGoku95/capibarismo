import requests
import pandas as pd
import os
from pathlib import Path
import time
import warnings
import csv

# Suppress SSL warnings
warnings.filterwarnings('ignore', message='Unverified HTTPS request')

# IDs oficiales de símbolos de partidos desde votoinformado.jne.gob.pe
# Actualizados: 14 de enero de 2026
partidos_simbolos = {
    "FUERZA POPULAR": 1366,
    "RENOVACION POPULAR": 22,
    "PARTIDO POLITICO COOPERACION POPULAR": 2995,
    "PARTIDO PAIS PARA TODOS": 2956,
    "ALIANZA PARA EL PROGRESO": 1257,
    "AHORA NACION - AN": 2980,
    "PARTIDO CIVICO OBRAS": 2941,
    "PARTIDO POLITICO NACIONAL PERU LIBRE": 2218,
    "PARTIDO FRENTE DE LA ESPERANZA 2021": 2857,
    "JUNTOS POR EL PERU": 1264,
    "PARTIDO MORADO": 2840,
}

# Mapeo de nombres simplificados para archivos
nombres_simplificados = {
    "FUERZA POPULAR": "fuerza_popular",
    "RENOVACION POPULAR": "renovacion_popular",
    "PARTIDO POLITICO COOPERACION POPULAR": "cooperacion_popular",
    "PARTIDO PAIS PARA TODOS": "pais_para_todos",
    "ALIANZA PARA EL PROGRESO": "alianza_progreso",
    "AHORA NACION - AN": "ahora_nacion",
    "PARTIDO CIVICO OBRAS": "obras",
    "PARTIDO POLITICO NACIONAL PERU LIBRE": "peru_libre",
    "PARTIDO FRENTE DE LA ESPERANZA 2021": "frente_esperanza",
    "JUNTOS POR EL PERU": "juntos_peru",
    "PARTIDO MORADO": "morado",
}

def crear_directorio():
    """Crea el directorio para guardar los iconos"""
    output_dir = Path("iconos_partidos")
    output_dir.mkdir(exist_ok=True)
    return output_dir

def descargar_icono(id_simbolo, nombre_partido, output_dir):
    """Descarga el icono del partido desde el JNE"""
    url = f"https://sroppublico.jne.gob.pe/Consulta/Simbolo/GetSimbolo/{id_simbolo}"
    
    try:
        print(f"Descargando: {nombre_partido} (ID: {id_simbolo})...")
        response = requests.get(url, verify=False, timeout=15)
        
        if response.status_code == 200 and len(response.content) > 100:
            # Determinar la extensión del archivo
            content_type = response.headers.get('Content-Type', '').lower()
            
            if 'image/png' in content_type or response.content[:4] == b'\x89PNG':
                extension = 'png'
            elif 'image/jpeg' in content_type or response.content[:2] == b'\xff\xd8':
                extension = 'jpg'
            elif 'image/gif' in content_type or response.content[:4] == b'GIF8':
                extension = 'gif'
            elif 'image/svg' in content_type or b'<svg' in response.content[:100]:
                extension = 'svg'
            else:
                extension = 'png'
            
            # Usar nombre simplificado
            nombre_archivo = f"{nombres_simplificados.get(nombre_partido, nombre_partido.lower().replace(' ', '_'))}.{extension}"
            filepath = output_dir / nombre_archivo
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            size_kb = len(response.content) / 1024
            print(f"  ✓ Guardado: {nombre_archivo} ({size_kb:.1f} KB)")
            return True, extension
        else:
            print(f"  ✗ Error {response.status_code} o contenido vacío")
            return False, None
            
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return False, None

def buscar_ids_automaticamente(start_id=2800, end_id=3100, output_dir=None):
    """
    Función auxiliar para buscar IDs de símbolos probando rangos
    USAR SOLO SI NECESITAS ENCONTRAR IDs FALTANTES
    """
    if output_dir is None:
        output_dir = crear_directorio()
    
    print(f"\n🔍 Buscando símbolos en rango {start_id}-{end_id}...")
    print("(Esto puede tardar varios minutos)\n")
    
    encontrados = []
    for id_test in range(start_id, end_id + 1):
        url = f"https://sroppublico.jne.gob.pe/Consulta/Simbolo/GetSimbolo/{id_test}"
        try:
            response = requests.get(url, verify=False, timeout=5)
            if response.status_code == 200 and len(response.content) > 100:
                print(f"✓ Encontrado ID {id_test} ({len(response.content)} bytes)")
                encontrados.append(id_test)
                
                # Guardar para inspección
                filepath = output_dir / f"simbolo_{id_test}.png"
                with open(filepath, 'wb') as f:
                    f.write(response.content)
        except:
            pass
        
        if id_test % 10 == 0:
            print(f"  ... probado hasta {id_test}")
        
        time.sleep(0.2)
    
    print(f"\n✓ Encontrados {len(encontrados)} símbolos: {encontrados}")
    return encontrados

def main():
    """Función principal"""
    print("=" * 70)
    print(" DESCARGA DE ICONOS DE PARTIDOS POLÍTICOS - ELECCIONES PERÚ 2026")
    print("=" * 70)
    print()
    
    output_dir = crear_directorio()
    
    # Estadísticas
    exitosos = 0
    fallidos = 0
    sin_id = 0
    
    for partido, id_simbolo in partidos_simbolos.items():
        if id_simbolo is None:
            print(f"⚠ {partido}: ID no configurado")
            sin_id += 1
            continue
        
        exito, ext = descargar_icono(id_simbolo, partido, output_dir)
        if exito:
            exitosos += 1
        else:
            fallidos += 1
        
        time.sleep(0.5)
    
    print()
    print("=" * 70)
    print("📊 RESUMEN:")
    print(f"  ✓ Descargados: {exitosos}")
    print(f"  ✗ Fallidos: {fallidos}")
    print(f"  ⚠ Sin ID: {sin_id}")
    print(f"  📁 Ubicación: {output_dir.absolute()}")
    print("=" * 70)
    
    if sin_id > 0 or fallidos > 0:
        print()
        print("💡 AYUDA:")
        print("  Para encontrar IDs faltantes, puedes:")
        print("  1. Visitar: https://plataformaelectoral.jne.gob.pe/")
        print("  2. Buscar el partido y encontrar su símbolo")
        print("  3. O descomentar la línea al final para búsqueda automática")
        print()

if __name__ == "__main__":
    main()
    
    # DESCOMENTAR LA SIGUIENTE LÍNEA SOLO SI NECESITAS BUSCAR IDs AUTOMÁTICAMENTE
    # ADVERTENCIA: Esto hará muchas peticiones al servidor del JNE
    # buscar_ids_automaticamente(start_id=2880, end_id=2960)
