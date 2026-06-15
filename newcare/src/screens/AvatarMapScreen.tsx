import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "../../constants/theme";
import { AppScrollView } from "../components/AppScrollView";
import { AvatarMapCard } from "../components/AvatarMapCard";
import { BrandHeader } from "../components/BrandHeader";
import { useApp } from "../context/AppContext";
import { ACESSORIOS_AVATAR, AVATAR_NIVEIS, ESSENCIAS_AVATAR } from "../data/avatarMap";

type AbaAvatar = "base" | "acessorios" | "evolucao";

const abas: { id: AbaAvatar; titulo: string; icone: keyof typeof Ionicons.glyphMap }[] = [
  { id: "base", titulo: "Base", icone: "paw-outline" },
  { id: "acessorios", titulo: "Acessórios", icone: "shirt-outline" },
  { id: "evolucao", titulo: "Evolução", icone: "shield-checkmark-outline" },
];

export function AvatarMapScreen() {
  const navigation = useNavigation();
  const {
    colors,
    usuario,
    escolherAvatar,
    selecionarAcessorioAvatar,
  } = useApp();
  const styles = criarStyles(colors);
  const [aba, setAba] = useState<AbaAvatar>("acessorios");
  const nivel = Math.min(6, Math.max(1, usuario?.nivel ?? 1));
  const acessorioSelecionado = usuario?.avatarAccessoryId ?? "sem-item";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <AppScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <BrandHeader compact align="left" showBackButton />
        <Text style={styles.titulo}>AvatarMAP</Text>
        <Text style={styles.subtitulo}>Personalize seu mascote e desbloqueie novos visuais.</Text>

        <View style={styles.avatarCardEspaco}>
          <AvatarMapCard mostrarEvolucao={false} />
        </View>

        <View style={styles.abas}>
          {abas.map((item) => {
            const ativa = aba === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setAba(item.id)}
                style={[styles.aba, ativa && styles.abaAtiva]}
              >
                <Ionicons name={item.icone} size={19} color={ativa ? "#FFFFFF" : colors.muted} />
                <Text style={[styles.abaTexto, ativa && styles.abaTextoAtivo]}>{item.titulo}</Text>
              </Pressable>
            );
          })}
        </View>

        {aba === "base" && (
          <View style={styles.secaoCard}>
            <View style={styles.secaoCabecalho}>
              <View>
                <Text style={styles.secaoTitulo}>Essência do mascote</Text>
                <Text style={styles.secaoDescricao}>Escolha o estilo que representa sua jornada.</Text>
              </View>
            </View>

            <View style={styles.essenciasGrid}>
              {ESSENCIAS_AVATAR.map((essencia) => {
                const selecionada = usuario?.avatarId === essencia.id;
                return (
                  <Pressable
                    key={essencia.id}
                    style={[styles.essenciaCard, selecionada && styles.essenciaCardAtiva]}
                    onPress={() => escolherAvatar(essencia.id)}
                  >
                    <View style={[styles.essenciaIcone, selecionada && styles.essenciaIconeAtivo]}>
                      <Ionicons
                        name={essencia.icone as keyof typeof Ionicons.glyphMap}
                        size={25}
                        color={selecionada ? "#FFFFFF" : colors.primary}
                      />
                    </View>
                    <Text style={styles.essenciaNome}>{essencia.nome}</Text>
                    <Text style={styles.essenciaDescricao}>{essencia.descricao}</Text>
                    {selecionada && (
                      <View style={styles.checkSelecionado}>
                        <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {aba === "acessorios" && (
          <View style={styles.secaoCard}>
            <View style={styles.secaoCabecalho}>
              <View>
                <Text style={styles.secaoTitulo}>Equipamentos</Text>
                <Text style={styles.secaoDescricao}>Itens são liberados conforme seu nível aumenta.</Text>
              </View>
              <View style={styles.filtroPill}>
                <Text style={styles.filtroTexto}>Todos</Text>
                <Ionicons name="chevron-down" size={15} color={colors.primary} />
              </View>
            </View>

            <View style={styles.itensGrid}>
              {ACESSORIOS_AVATAR.map((item) => {
                const liberado = nivel >= item.nivelMinimo;
                const selecionado = acessorioSelecionado === item.id;
                return (
                  <Pressable
                    key={item.id}
                    disabled={!liberado}
                    onPress={() => selecionarAcessorioAvatar(item.id)}
                    style={[
                      styles.itemCard,
                      selecionado && styles.itemCardAtivo,
                      !liberado && styles.itemCardBloqueado,
                    ]}
                  >
                    <View style={[styles.itemIcone, selecionado && styles.itemIconeAtivo]}>
                      <Ionicons
                        name={item.icone as keyof typeof Ionicons.glyphMap}
                        size={30}
                        color={selecionado ? "#FFFFFF" : liberado ? colors.primary : colors.muted}
                      />
                    </View>
                    <Text style={styles.itemNome}>{item.nome}</Text>
                    <Text style={[styles.itemNivel, item.especial && styles.itemEspecial]}>
                      {item.especial ? "Especial" : liberado ? "Disponível" : `Nível ${item.nivelMinimo}`}
                    </Text>
                    <View style={styles.itemStatus}>
                      <Ionicons
                        name={selecionado ? "checkmark-circle" : liberado ? "ellipse-outline" : "lock-closed"}
                        size={17}
                        color={selecionado ? colors.success : colors.muted}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {aba === "evolucao" && (
          <View style={styles.secaoCard}>
            <Text style={styles.secaoTitulo}>Caminho de evolução</Text>
            <Text style={styles.secaoDescricao}>Cada nível altera o visual e o título do seu AvatarMAP.</Text>

            <View style={styles.evolucaoLista}>
              {AVATAR_NIVEIS.map((fase) => {
                const liberada = fase.nivel <= nivel;
                const atual = fase.nivel === nivel;
                return (
                  <View key={fase.nivel} style={[styles.evolucaoItem, atual && styles.evolucaoItemAtual]}>
                    <Image source={fase.imagem} style={styles.evolucaoImagem} resizeMode="contain" />
                    <View style={styles.evolucaoInfo}>
                      <Text style={styles.evolucaoNivel}>Nível {fase.nivel}</Text>
                      <Text style={styles.evolucaoNome}>{fase.nome}</Text>
                      <Text style={styles.evolucaoXp}>{fase.xpMinimo} XP • {fase.titulo}</Text>
                    </View>
                    <View style={[styles.evolucaoStatus, liberada && styles.evolucaoStatusAtivo]}>
                      <Ionicons
                        name={atual ? "flash" : liberada ? "checkmark" : "lock-closed"}
                        size={15}
                        color="#FFFFFF"
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.rodapeCard}>
          <View style={styles.rodapeIcone}>
            <Ionicons name="lock-open-outline" size={24} color={colors.primary} />
          </View>
          <Text style={styles.rodapeTexto}>Continue completando missões para liberar itens e evoluções.</Text>
          <Pressable style={styles.botaoMissoes} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={14} color="#FFFFFF" />
            <Text style={styles.botaoMissoesTexto}>Ver missões</Text>
          </Pressable>
        </View>
      </AppScrollView>
    </SafeAreaView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scroll: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
  },
  content: {
    paddingBottom: 34,
    paddingHorizontal: 18,
  },
  titulo: {
    color: colors.text,
    fontSize: 31,
    fontWeight: "900",
    marginTop: 4,
  },
  subtitulo: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 4,
  },
  avatarCardEspaco: {
    marginTop: 18,
  },
  abas: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 14,
    padding: 5,
  },
  aba: {
    alignItems: "center",
    borderRadius: 14,
    flex: 1,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 5,
  },
  abaAtiva: {
    backgroundColor: colors.primary,
  },
  abaTexto: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
  },
  abaTextoAtivo: {
    color: "#FFFFFF",
  },
  secaoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 21,
    borderWidth: 1,
    padding: 15,
  },
  secaoCabecalho: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  secaoTitulo: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
  },
  secaoDescricao: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  filtroPill: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  filtroTexto: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
  },
  itensGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 15,
  },
  itemCard: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1,
    minHeight: 144,
    padding: 10,
    position: "relative",
    width: "48.4%",
  },
  itemCardAtivo: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  itemCardBloqueado: {
    opacity: 0.58,
  },
  itemIcone: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    height: 58,
    justifyContent: "center",
    marginBottom: 9,
    width: 58,
  },
  itemIconeAtivo: {
    backgroundColor: colors.primary,
  },
  itemNome: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },
  itemNivel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
  },
  itemEspecial: {
    color: colors.accent,
  },
  itemStatus: {
    position: "absolute",
    right: 7,
    top: 7,
  },
  essenciasGrid: {
    gap: 10,
    marginTop: 15,
  },
  essenciaCard: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    minHeight: 78,
    padding: 12,
    position: "relative",
  },
  essenciaCardAtiva: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  essenciaIcone: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  essenciaIconeAtivo: {
    backgroundColor: colors.primary,
  },
  essenciaNome: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  essenciaDescricao: {
    color: colors.muted,
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  checkSelecionado: {
    alignItems: "center",
    backgroundColor: colors.success,
    borderRadius: 999,
    height: 22,
    justifyContent: "center",
    position: "absolute",
    right: 9,
    top: 9,
    width: 22,
  },
  evolucaoLista: {
    gap: 10,
    marginTop: 15,
  },
  evolucaoItem: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 88,
    padding: 10,
  },
  evolucaoItemAtual: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  evolucaoImagem: {
    height: 68,
    width: 68,
  },
  evolucaoInfo: {
    flex: 1,
  },
  evolucaoNivel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  evolucaoNome: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 2,
  },
  evolucaoXp: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 3,
  },
  evolucaoStatus: {
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: 999,
    height: 29,
    justifyContent: "center",
    width: 29,
  },
  evolucaoStatusAtivo: {
    backgroundColor: colors.success,
  },
  rodapeCard: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    padding: 12,
  },
  rodapeIcone: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  rodapeTexto: {
    color: colors.muted,
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
  },
  botaoMissoes: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  botaoMissoesTexto: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
});
