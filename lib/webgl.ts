/**
 * WebGL Detection Utility
 * Détecte si le navigateur supporte WebGL pour le rendu 3D
 */

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch (e) {
    return false
  }
}

export function getWebGLErrorMessage(): string {
  return 'Votre navigateur ne supporte pas WebGL, nécessaire pour afficher le coach 3D. Veuillez utiliser un navigateur moderne comme Chrome, Firefox ou Safari.'
}
