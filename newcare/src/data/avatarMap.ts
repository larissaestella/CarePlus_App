import { ImageSourcePropType } from "react-native";

export type AvatarNivel = {
  nivel: number;
  nome: string;
  titulo: string;
  xpMinimo: number;
  imagem: ImageSourcePropType;
};

export type AcessorioAvatar = {
  id: string;
  nome: string;
  icone: string;
  nivelMinimo: number;
  categoria: "base" | "cabeca" | "corpo" | "magico";
  especial?: boolean;
};

export type EssenciaAvatar = {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
};

export const AVATAR_NIVEIS: AvatarNivel[] = [
  {
    nivel: 1,
    nome: "Mascote base",
    titulo: "Companheiro",
    xpMinimo: 0,
    imagem: require("../../assets/images/avatar-map/avatar-level-1.png"),
  },
  {
    nivel: 2,
    nome: "Broto vital",
    titulo: "Cuidador",
    xpMinimo: 100,
    imagem: require("../../assets/images/avatar-map/avatar-level-2.png"),
  },
  {
    nivel: 3,
    nome: "Guardião azul",
    titulo: "Explorador",
    xpMinimo: 250,
    imagem: require("../../assets/images/avatar-map/avatar-level-3.png"),
  },
  {
    nivel: 4,
    nome: "Sentinela sereno",
    titulo: "Protetor",
    xpMinimo: 500,
    imagem: require("../../assets/images/avatar-map/avatar-level-4.png"),
  },
  {
    nivel: 5,
    nome: "Mestre da jornada",
    titulo: "Veterano",
    xpMinimo: 900,
    imagem: require("../../assets/images/avatar-map/avatar-level-5.png"),
  },
  {
    nivel: 6,
    nome: "Guardião real",
    titulo: "Lendário",
    xpMinimo: 1400,
    imagem: require("../../assets/images/avatar-map/avatar-level-6.png"),
  },
];

export const ACESSORIOS_AVATAR: AcessorioAvatar[] = [
  { id: "sem-item", nome: "Sem item", icone: "remove-circle-outline", nivelMinimo: 1, categoria: "base" },
  { id: "bone-base", nome: "Boné Base", icone: "baseball-outline", nivelMinimo: 2, categoria: "cabeca" },
  { id: "oculos-sol", nome: "Óculos de Sol", icone: "glasses-outline", nivelMinimo: 3, categoria: "cabeca" },
  { id: "capacete", nome: "Capacete", icone: "shield-half-outline", nivelMinimo: 4, categoria: "cabeca" },
  { id: "chapeu-mago", nome: "Chapéu de Mago", icone: "color-wand-outline", nivelMinimo: 5, categoria: "cabeca" },
  { id: "armadura-leve", nome: "Armadura Leve", icone: "body-outline", nivelMinimo: 3, categoria: "corpo" },
  { id: "escudo-azul", nome: "Escudo Azul", icone: "shield-checkmark-outline", nivelMinimo: 4, categoria: "corpo" },
  { id: "capa-explorador", nome: "Capa do Explorador", icone: "trail-sign-outline", nivelMinimo: 5, categoria: "corpo" },
  { id: "livro-magico", nome: "Livro Mágico", icone: "book-outline", nivelMinimo: 5, categoria: "magico" },
  { id: "coroa-real", nome: "Coroa Real", icone: "diamond-outline", nivelMinimo: 6, categoria: "cabeca" },
  { id: "amuleto-estelar", nome: "Amuleto Estelar", icone: "medal-outline", nivelMinimo: 6, categoria: "magico" },
  { id: "aura-aquatica", nome: "Aura Aquática", icone: "water-outline", nivelMinimo: 6, categoria: "magico", especial: true },
];

export const ESSENCIAS_AVATAR: EssenciaAvatar[] = [
  { id: "avatar-mental", nome: "Serenidade", descricao: "Foco e equilíbrio mental", icone: "sparkles-outline" },
  { id: "avatar-fisica", nome: "Energia", descricao: "Movimento e disposição", icone: "fitness-outline" },
  { id: "avatar-lazer", nome: "Criatividade", descricao: "Pausas e momentos de lazer", icone: "game-controller-outline" },
  { id: "avatar-sono", nome: "Descanso", descricao: "Sono e recuperação", icone: "moon-outline" },
];

export function limitarNivelAvatar(nivel: number) {
  return Math.min(AVATAR_NIVEIS.length, Math.max(1, nivel));
}

export function obterAvatarPorNivel(nivel: number) {
  return AVATAR_NIVEIS[limitarNivelAvatar(nivel) - 1];
}

export function calcularProgressoAvatar(xp: number) {
  const atual = [...AVATAR_NIVEIS].reverse().find((fase) => xp >= fase.xpMinimo) ?? AVATAR_NIVEIS[0];
  const proxima = AVATAR_NIVEIS.find((fase) => fase.xpMinimo > xp);
  const intervalo = proxima ? proxima.xpMinimo - atual.xpMinimo : 1;
  const percentual = proxima
    ? Math.min(100, Math.max(0, ((xp - atual.xpMinimo) / intervalo) * 100))
    : 100;

  return {
    atual,
    proxima,
    percentual,
    xpRestante: proxima ? Math.max(0, proxima.xpMinimo - xp) : 0,
  };
}
