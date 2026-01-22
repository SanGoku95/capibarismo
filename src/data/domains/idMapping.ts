// Mapeo de IDs nuevos (JNE) a IDs antiguos (sistema interno)
// Los nuevos IDs vienen del JNE, los antiguos son los que usa el sistema de fotos y datos curados

export const newToOldIdMap: Record<string, string> = {
  'pablo-lopez chau': 'lopez-chau',
  'keiko-fujimori': 'keiko',
  'rafael-lopez aliaga': 'rafael',
  'cesar-acuna': 'cesar-acuna',
  'yonhy-lescano': 'yonhy',
  'carlos-alvarez': 'carlos-alvarez',
  'vladimir-cerron': 'cerron',
  'mesias-guevara': 'guevara',
  'roberto-sanchez': 'sanchez',
  'ricardo-belmont': 'belmont',
  'luis-olivera': 'olivera',
};

export const oldToNewIdMap: Record<string, string> = Object.fromEntries(
  Object.entries(newToOldIdMap).map(([newId, oldId]) => [oldId, newId])
);

// Helper para obtener el ID antiguo dado un ID nuevo
export function getOldId(newId: string): string {
  return newToOldIdMap[newId] ?? newId;
}

// Helper para obtener el ID nuevo dado un ID antiguo
export function getNewId(oldId: string): string {
  return oldToNewIdMap[oldId] ?? oldId;
}
