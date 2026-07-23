export const TITULOS_NIVEL = [
  { min: 16, titulo: 'Lenda Literária' },
  { min: 11, titulo: 'Sábio de Alexandria' },
  { min: 7, titulo: 'Guardião dos Pergaminhos' },
  { min: 4, titulo: 'Leitor Dedicado' },
  { min: 1, titulo: 'Leitor Iniciante' },
]

export function tituloAtual(nivel) {
  return TITULOS_NIVEL.find((item) => nivel >= item.min) ?? TITULOS_NIVEL[TITULOS_NIVEL.length - 1]
}

export function proximoTitulo(nivel) {
  return [...TITULOS_NIVEL].reverse().find((item) => item.min > nivel) ?? null
}

export const ICONES_CONQUISTA = {
  PRIMEIRO_LIVRO: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  LEITOR_INICIANTE: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M12 6.2c-1.7-1.2-3.9-1.9-6.3-1.9-.9 0-1.8.1-2.7.35v14c.9-.25 1.8-.35 2.7-.35 2.4 0 4.6.7 6.3 1.9 1.7-1.2 3.9-1.9 6.3-1.9.9 0 1.8.1 2.7.35v-14c-.9-.25-1.8-.35-2.7-.35-2.4 0-4.6.7-6.3 1.9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 6.2v14" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  LEITOR_VORAZ: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M12 21c4-2 5-5.2 5-8 0-3-1.7-5.4-3-7 0 2-1 3-2 3-1.5 0-1-2.3-2-4-3 2.4-5 6-5 9 0 2.8 1.5 5.1 3.5 6.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  ),
  CRITICO_LITERARIO: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  ),
  RESENHISTA: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path
        d="M4 20h4L18 10l-4-4L4 16v4zM14 4.5L19.5 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  COLECIONADOR: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4.5 5.3 4a4.9 4.9 0 016.7 2 4.9 4.9 0 016.7-2c3.3.5 4.9 3.8 3.3 7.2-2.5 4.7-10 9.3-10 9.3z" />
    </svg>
  ),
  SOCIAVEL: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15 14.3c2.6.4 4.5 2.6 4.5 5.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ),
  EXPLORADOR: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M15 9l-2 5-5 2 2-5 5-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  LENDARIO: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M3 7l4 3 5-6 5 6 4-3-2 11H5L3 7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
}

export function IconCadeado(p) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V7.5a4 4 0 018 0V11" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function IconTrofeu(p) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M7 4h10v5a5 5 0 01-10 0V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 6H3v1a4 4 0 003.5 4M19 6h2v1a4 4 0 01-3.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 15.5h4M12 15.5V19M9 20.5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export const ICONES_HISTORICO = {
  LIVRO_ADICIONADO: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M6 4h12v16l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  LIVRO_LIDO: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  AVALIACAO_CRIADA: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 2.5l2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.3l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.8L12 2.5z" />
    </svg>
  ),
  COMENTARIO_CRIADO: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
      <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  CURTIDA_DADA: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4.5 5.3 4a4.9 4.9 0 016.7 2 4.9 4.9 0 016.7-2c3.3.5 4.9 3.8 3.3 7.2-2.5 4.7-10 9.3-10 9.3z" />
    </svg>
  ),
}
