import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppColors } from "../../constants/theme";
import { useApp } from "../context/AppContext";
import { CategoriaMissao, Missao, StatusMissao } from "../types";

interface Props {
  missao: Missao;
  onPress: (id: string) => void;
  onDetalhes?: (id: string) => void;
}

const categoriaIcone: Record<CategoriaMissao, keyof typeof Ionicons.glyphMap> = {
  [CategoriaMissao.Mental]: "sparkles-outline",
  [CategoriaMissao.Fisica]: "fitness-outline",
  [CategoriaMissao.Lazer]: "game-controller-outline",
  [CategoriaMissao.Sono]: "moon-outline",
};

export function CardMissao({ missao, onPress, onDetalhes }: Props) {
  const { colors } = useApp();
  const styles = criarStyles(colors);
  const concluida = missao.status === StatusMissao.Concluida;

  return (
    <View style={[styles.card, concluida && styles.cardConcluido]}>
      <View style={styles.topo}>
        <View style={styles.iconeCategoria}>
          <Ionicons name={categoriaIcone[missao.categoria]} size={28} color={colors.primary} />
        </View>

        <View style={styles.conteudo}>
          <View style={styles.header}>
            <Text style={styles.titulo}>{missao.titulo}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{missao.tipo}</Text>
            </View>
          </View>

          <Text style={styles.descricao} numberOfLines={3}>{missao.descricao}</Text>

          <View style={styles.metaLinha}>
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={14} color={colors.primary} />
              <Text style={styles.metaTexto}>{missao.duracaoMinutos} min</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="star-outline" size={14} color={colors.warning} />
              <Text style={styles.metaTexto}>+{missao.recompensaXp} XP</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="cash-outline" size={14} color={colors.warning} />
              <Text style={styles.metaTexto}>+{missao.recompensaMoedas}</Text>
            </View>
          </View>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.botao,
          concluida && styles.botaoConcluido,
          pressed && !concluida && styles.botaoPressionado,
        ]}
        onPress={() => onPress(missao.id)}
        disabled={concluida}
        accessibilityRole="button"
      >
        <Ionicons
          name={concluida ? "checkmark-circle" : "play-circle-outline"}
          size={18}
          color="#FFFFFF"
        />
        <Text style={styles.botaoTexto}>{concluida ? "Missão concluída" : "Completar missão"}</Text>
      </Pressable>

      {onDetalhes && (
        <Pressable style={styles.botaoDetalhes} onPress={() => onDetalhes(missao.id)}>
          <Ionicons name="information-circle-outline" size={17} color={colors.text} />
          <Text style={styles.botaoDetalhesTexto}>Ver detalhes</Text>
        </Pressable>
      )}
    </View>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
    minHeight: 200,
    overflow: "hidden",
    padding: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 2,
  },
  cardConcluido: {
    backgroundColor: colors.successSoft,
    borderColor: colors.success,
  },
  topo: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexShrink: 1,
    gap: 13,
    overflow: "hidden",
  },
  iconeCategoria: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  conteudo: {
    flex: 1,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  titulo: {
    color: colors.text,
    flex: 1,
    flexShrink: 1,
    fontSize: 17,
    fontWeight: "900",
  },
  badge: {
    backgroundColor: colors.secondarySoft,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  badgeTexto: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  descricao: {
    color: colors.muted,
    flexShrink: 1,
    lineHeight: 19,
    marginTop: 6,
  },
  metaLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 11,
  },
  metaChip: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  metaTexto: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  botao: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 13,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    marginTop: 14,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  botaoConcluido: {
    backgroundColor: colors.success,
  },
  botaoPressionado: {
    opacity: 0.86,
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  botaoDetalhes: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginTop: 8,
    minHeight: 42,
  },
  botaoDetalhesTexto: {
    color: colors.text,
    fontWeight: "800",
  },
});
