import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppColors } from "../../constants/theme";
import { AppScrollView } from "../components/AppScrollView";
import { AvatarMapCard } from "../components/AvatarMapCard";
import { BrandHeader } from "../components/BrandHeader";
import { useApp } from "../context/AppContext";
import { RootStackParamList } from "../routes/types";
import { CategoriaMissao, StatusMissao } from "../types";

const conquistaIcones: Record<string, keyof typeof Ionicons.glyphMap> = {
  "primeira-missao": "trophy-outline",
  "streak-7": "flame-outline",
  equilibrio: "leaf-outline",
  "hidratacao-meta": "water-outline",
  "dia-perfeito": "sunny-outline",
};

export function ProgressoScreen() {
  const { colors, usuario, missoes, conquistas } = useApp();
  const styles = criarStyles(colors);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const total = missoes.length || 1;
  const concluidas = missoes.filter((m) => m.status === StatusMissao.Concluida);
  const percentual = Math.round((concluidas.length / total) * 100);
  const categoriasConcluidas = new Set(concluidas.map((m) => m.categoria));

  function progressoConquista(id: string) {
    switch (id) {
      case "primeira-missao":
        return { atual: Math.min(1, concluidas.length), total: 1 };
      case "streak-7":
        return { atual: Math.min(7, usuario?.streak ?? 0), total: 7 };
      case "equilibrio":
        return {
          atual: [CategoriaMissao.Mental, CategoriaMissao.Fisica, CategoriaMissao.Lazer, CategoriaMissao.Sono]
            .filter((categoria) => categoriasConcluidas.has(categoria)).length,
          total: 4,
        };
      case "hidratacao-meta":
        return { atual: conquistaDesbloqueada(id) ? 1 : 0, total: 1 };
      case "dia-perfeito":
        return { atual: concluidas.length, total };
      default:
        return { atual: 0, total: 1 };
    }
  }

  function conquistaDesbloqueada(id: string) {
    return conquistas.find((item) => item.id === id)?.desbloqueada ?? false;
  }

  return (
    <AppScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topoMarca}>
        <BrandHeader compact align="left" />
        <Pressable style={styles.notificacao} accessibilityRole="button" accessibilityLabel="Notificações">
          <Ionicons name="notifications-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <Text style={styles.titulo}>Progresso</Text>
      <Text style={styles.subtitulo}>Acompanhe sua jornada de autocuidado.</Text>

      <View style={styles.avatarEspaco}>
        <AvatarMapCard onPress={() => navigation.navigate("AvatarMap")} mostrarEvolucao />
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <View style={styles.cardIcone}>
            <Ionicons name="star-outline" size={23} color={colors.primary} />
          </View>
          <Text style={styles.cardRotulo}>XP total</Text>
          <Text style={styles.valor}>{usuario?.xp ?? 0}</Text>
          <Text style={styles.label}>pontos acumulados</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.cardIcone}>
            <Ionicons name="shield-checkmark-outline" size={23} color={colors.primary} />
          </View>
          <Text style={styles.cardRotulo}>Nível</Text>
          <Text style={styles.valor}>{usuario?.nivel ?? 1}</Text>
          <Text style={styles.label}>evolução atual</Text>
        </View>
        <View style={styles.card}>
          <View style={[styles.cardIcone, styles.cardIconeVerde]}>
            <Ionicons name="flame-outline" size={23} color={colors.success} />
          </View>
          <Text style={styles.cardRotulo}>Sequência</Text>
          <Text style={styles.valor}>{usuario?.streak ?? 0}</Text>
          <Text style={styles.label}>dias seguidos</Text>
        </View>
        <View style={styles.card}>
          <View style={[styles.cardIcone, styles.cardIconeRoxo]}>
            <Ionicons name="heart-outline" size={23} color={colors.accent} />
          </View>
          <Text style={styles.cardRotulo}>Progresso hoje</Text>
          <Text style={styles.valor}>{percentual}%</Text>
          <Text style={styles.label}>meta diária</Text>
        </View>
      </View>

      <View style={styles.secaoTopo}>
        <Text style={styles.secao}>Conquistas</Text>
        <Text style={styles.verTodas}>Ver todas</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        nestedScrollEnabled
        contentContainerStyle={styles.conquistasLinha}
      >
        {conquistas.map((conquista) => {
          const progresso = progressoConquista(conquista.id);
          const porcentagem = Math.min(100, (progresso.atual / Math.max(1, progresso.total)) * 100);
          return (
            <View
              key={conquista.id}
              style={[styles.conquista, conquista.desbloqueada && styles.conquistaAtiva]}
            >
              <View style={[styles.conquistaEmblema, conquista.desbloqueada && styles.conquistaEmblemaAtivo]}>
                <Ionicons
                  name={conquista.desbloqueada ? conquistaIcones[conquista.id] ?? "ribbon-outline" : "lock-closed-outline"}
                  size={30}
                  color={conquista.desbloqueada ? "#FFFFFF" : colors.muted}
                />
              </View>
              <Text style={styles.conquistaTitulo}>{conquista.titulo}</Text>
              <Text style={styles.conquistaDescricao}>{conquista.descricao}</Text>
              <View style={styles.progressoConquistaBarra}>
                <View style={[styles.progressoConquistaInterna, { width: `${porcentagem}%` }]} />
              </View>
              <Text style={styles.progressoConquistaTexto}>{progresso.atual}/{progresso.total}</Text>
            </View>
          );
        })}
      </ScrollView>
    </AppScrollView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingBottom: 34,
    paddingHorizontal: 18,
    paddingTop: 48,
  },
  topoMarca: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notificacao: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  titulo: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 4,
  },
  subtitulo: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  avatarEspaco: {
    marginTop: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 145,
    padding: 13,
    width: "48.5%",
  },
  cardIcone: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 13,
    height: 42,
    justifyContent: "center",
    marginBottom: 9,
    width: 42,
  },
  cardIconeVerde: {
    backgroundColor: colors.successSoft,
  },
  cardIconeRoxo: {
    backgroundColor: colors.accentSoft,
  },
  cardRotulo: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  valor: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 1,
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 1,
  },
  secaoTopo: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 26,
  },
  secao: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  verTodas: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },
  conquistasLinha: {
    gap: 12,
    paddingBottom: 8,
    paddingRight: 18,
  },
  conquista: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 19,
    borderWidth: 1,
    minHeight: 245,
    padding: 15,
    width: 190,
  },
  conquistaAtiva: {
    borderColor: colors.primary,
  },
  conquistaEmblema: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    height: 62,
    justifyContent: "center",
    marginBottom: 13,
    width: 62,
  },
  conquistaEmblemaAtivo: {
    backgroundColor: colors.primary,
  },
  conquistaTitulo: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  conquistaDescricao: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7,
    minHeight: 54,
  },
  progressoConquistaBarra: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    height: 7,
    marginTop: "auto",
    overflow: "hidden",
  },
  progressoConquistaInterna: {
    backgroundColor: colors.success,
    borderRadius: 999,
    height: "100%",
    minWidth: 4,
  },
  progressoConquistaTexto: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 6,
    textAlign: "right",
  },
});
