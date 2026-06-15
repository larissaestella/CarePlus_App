import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppColors } from "../../constants/theme";
import { AVATAR_NIVEIS, calcularProgressoAvatar, limitarNivelAvatar } from "../data/avatarMap";
import { useApp } from "../context/AppContext";

interface Props {
  onPress?: () => void;
  mostrarEvolucao?: boolean;
  compacto?: boolean;
}

export function AvatarMapCard({ onPress, mostrarEvolucao = true, compacto = false }: Props) {
  const { colors, usuario } = useApp();
  const styles = criarStyles(colors);
  const xp = usuario?.xp ?? 0;
  const nivel = limitarNivelAvatar(usuario?.nivel ?? 1);
  const progresso = calcularProgressoAvatar(xp);
  const faseAtual = AVATAR_NIVEIS[nivel - 1];

  const conteudo = (
    <View style={[styles.card, compacto && styles.cardCompacto]}>
      <View pointerEvents="none" style={styles.decoracaoUm} />
      <View pointerEvents="none" style={styles.decoracaoDois} />
      <View pointerEvents="none" style={styles.decoracaoTres} />

      <View style={styles.cabecalhoCard}>
        <View style={styles.marcaPill}>
          <Ionicons name="sparkles" size={15} color="#FFFFFF" />
          <Text style={styles.marcaTexto}>AVATARMAP</Text>
        </View>
        {onPress && (
          <View style={styles.setaBotao}>
            <Ionicons name="chevron-forward" size={22} color={colors.primary} />
          </View>
        )}
      </View>

      <View style={[styles.principal, compacto && styles.principalCompacto]}>
        <View style={[styles.avatarArea, compacto && styles.avatarAreaCompacta]}>
          <View style={[styles.avatarHalo, compacto && styles.avatarHaloCompacto]}>
            <Image
              source={faseAtual.imagem}
              style={[styles.avatarImagem, compacto && styles.avatarImagemCompacta]}
              resizeMode="contain"
              accessibilityLabel={`AvatarMAP nível ${nivel}`}
            />
            <View style={styles.badgeNivelAvatar}>
              <Text style={styles.badgeNivelTexto}>{nivel}</Text>
            </View>
          </View>
          {!compacto && <Text style={styles.nomeFase}>{faseAtual.nome}</Text>}
        </View>

        <View style={styles.informacoes}>
          <Text style={styles.rotulo}>Evolução atual</Text>
          <Text style={styles.nivel}>Nível {nivel}</Text>
          <View style={styles.xpPill}>
            <Ionicons name="star" size={15} color="#FFFFFF" />
            <Text style={styles.xpTexto}>{xp} XP</Text>
          </View>
          <View style={styles.barra}>
            <View style={[styles.barraInterna, { width: `${progresso.percentual}%` }]} />
          </View>
          <Text style={styles.proximaMeta}>
            {progresso.proxima
              ? `Próximo nível em ${progresso.xpRestante} XP`
              : "Evolução máxima alcançada"}
          </Text>
          {!compacto && (
            <Text style={styles.ajuda}>Continue concluindo missões para evoluir.</Text>
          )}
        </View>
      </View>

      {mostrarEvolucao && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          nestedScrollEnabled
          contentContainerStyle={styles.evolucaoLinha}
        >
          {AVATAR_NIVEIS.map((fase, index) => {
            const desbloqueada = fase.nivel <= nivel;
            const atual = fase.nivel === nivel;
            return (
              <View key={fase.nivel} style={styles.faseItem}>
                <View style={[styles.faseCirculo, atual && styles.faseCirculoAtual]}>
                  <Image source={fase.imagem} style={styles.faseImagem} resizeMode="contain" />
                  <View
                    style={[
                      styles.faseStatus,
                      desbloqueada ? styles.faseStatusDesbloqueada : styles.faseStatusBloqueada,
                    ]}
                  >
                    <Ionicons
                      name={atual ? "flash" : desbloqueada ? "checkmark" : "lock-closed"}
                      size={11}
                      color="#FFFFFF"
                    />
                  </View>
                </View>
                <Text style={[styles.faseTexto, atual && styles.faseTextoAtual]}>Nível {fase.nivel}</Text>
                {index < AVATAR_NIVEIS.length - 1 && (
                  <Ionicons name="chevron-forward" size={14} color={colors.primary} style={styles.conector} />
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  if (!onPress) return conteudo;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Abrir personalização do AvatarMAP"
      style={({ pressed }) => pressed && styles.pressionado}
    >
      {conteudo}
    </Pressable>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
    padding: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 4,
  },
  cardCompacto: {
    borderRadius: 20,
    padding: 14,
  },
  decoracaoUm: {
    backgroundColor: colors.accentSoft,
    borderRadius: 90,
    height: 180,
    opacity: 0.9,
    position: "absolute",
    right: -45,
    top: -40,
    width: 180,
  },
  decoracaoDois: {
    backgroundColor: colors.surface,
    borderRadius: 60,
    height: 120,
    left: -45,
    opacity: 0.3,
    position: "absolute",
    top: 110,
    width: 120,
  },
  decoracaoTres: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    bottom: 52,
    height: 16,
    opacity: 0.12,
    position: "absolute",
    right: 34,
    width: 16,
  },
  cabecalhoCard: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  marcaPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  marcaTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
  },
  setaBotao: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  principal: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    minHeight: 174,
  },
  principalCompacto: {
    minHeight: 142,
  },
  avatarArea: {
    alignItems: "center",
    width: 146,
  },
  avatarAreaCompacta: {
    width: 118,
  },
  avatarHalo: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 78,
    borderWidth: 2,
    height: 146,
    justifyContent: "center",
    width: 146,
  },
  avatarHaloCompacto: {
    height: 114,
    width: 114,
  },
  avatarImagem: {
    height: 136,
    width: 136,
  },
  avatarImagemCompacta: {
    height: 108,
    width: 108,
  },
  badgeNivelAvatar: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 2,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 2,
    top: 2,
    width: 28,
  },
  badgeNivelTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  nomeFase: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 5,
    textAlign: "center",
  },
  informacoes: {
    flex: 1,
    minWidth: 0,
  },
  rotulo: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  nivel: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },
  xpPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 999,
    flexDirection: "row",
    gap: 5,
    marginTop: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  xpTexto: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  barra: {
    backgroundColor: "rgba(8,42,85,0.16)",
    borderRadius: 999,
    height: 10,
    marginTop: 14,
    overflow: "hidden",
  },
  barraInterna: {
    backgroundColor: colors.success,
    borderRadius: 999,
    height: "100%",
    minWidth: 8,
  },
  proximaMeta: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
  },
  ajuda: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  evolucaoLinha: {
    alignItems: "flex-start",
    backgroundColor: "rgba(255,255,255,0.36)",
    borderRadius: 18,
    gap: 8,
    marginTop: 11,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  faseItem: {
    alignItems: "center",
    marginRight: 7,
    position: "relative",
    width: 58,
  },
  faseCirculo: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    borderWidth: 2,
    height: 54,
    justifyContent: "center",
    opacity: 0.76,
    width: 54,
  },
  faseCirculoAtual: {
    borderColor: colors.primary,
    borderWidth: 3,
    opacity: 1,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 3,
  },
  faseImagem: {
    height: 48,
    width: 48,
  },
  faseStatus: {
    alignItems: "center",
    borderColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1.5,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: -3,
    top: -5,
    width: 20,
  },
  faseStatusDesbloqueada: {
    backgroundColor: colors.success,
  },
  faseStatusBloqueada: {
    backgroundColor: colors.muted,
  },
  faseTexto: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 5,
  },
  faseTextoAtual: {
    color: colors.primary,
  },
  conector: {
    position: "absolute",
    right: -14,
    top: 20,
  },
  pressionado: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
});
