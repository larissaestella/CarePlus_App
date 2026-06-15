import { forwardRef, useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
} from "react-native";

const SCROLLBAR_CSS_ID = "app-scrollview-styles";

function injectScrollbarCSS() {
  if (Platform.OS !== "web") return;
  if (document.getElementById(SCROLLBAR_CSS_ID)) return;

  const style = document.createElement("style");
  style.id = SCROLLBAR_CSS_ID;
  style.textContent = `
    .app-scroll-styled::-webkit-scrollbar {
      width: 6px;
    }
    .app-scroll-styled::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 999px;
      margin: 4px 0;
    }
    .app-scroll-styled::-webkit-scrollbar-thumb {
      background: rgba(120, 120, 120, 0.35);
      border-radius: 999px;
    }
    .app-scroll-styled::-webkit-scrollbar-thumb:hover {
      background: rgba(120, 120, 120, 0.55);
    }
    .app-scroll-styled {
      scrollbar-width: thin;
      scrollbar-color: rgba(120, 120, 120, 0.35) transparent;
    }
  `;
  document.head.appendChild(style);
}

function applyScrollbarClass(node: any) {
  if (Platform.OS !== "web") return;
  injectScrollbarCSS();
  if (node && node.className !== undefined) {
    if (!node.className.includes("app-scroll-styled")) {
      node.className = (node.className ? node.className + " " : "") + "app-scroll-styled";
    }
  }
}

/**
 * Ref callback that applies custom scrollbar styles to a FlatList on web.
 * Usage: <FlatList ref={useStyledFlatListRef()} ... />
 */
export function useStyledFlatListRef<T = any>() {
  const ref = useRef<FlatList<T>>(null);

  const setRef = useCallback((instance: FlatList<T> | null) => {
    (ref as any).current = instance;
    if (instance) {
      applyScrollbarClass(instance);
      // FlatList wraps a ScrollView — try to reach the inner scrollable node
      const scrollNode = (instance as any).getScrollableNode?.();
      if (scrollNode) applyScrollbarClass(scrollNode);
    }
  }, []);

  return setRef;
}

/**
 * ScrollView padronizado para telas do app.
 *
 * O `flex: 1` e o `minHeight: 0` impedem que o conteúdo aumente a altura
 * do layout pai no React Native Web. Assim, a área visível permanece
 * limitada à tela e o excesso vira rolagem, como acontece no iOS/Android.
 */
export const AppScrollView = forwardRef<ScrollView, ScrollViewProps>(
  function AppScrollView(
    {
      style,
      contentContainerStyle,
      showsVerticalScrollIndicator = true,
      persistentScrollbar,
      keyboardShouldPersistTaps = "handled",
      keyboardDismissMode,
      nestedScrollEnabled = true,
      contentInsetAdjustmentBehavior = "automatic",
      automaticallyAdjustKeyboardInsets,
      ...props
    },
    ref,
  ) {
    const innerRef = useRef<ScrollView>(null);

    useEffect(() => {
      applyScrollbarClass(innerRef.current);
    }, []);

    function setRef(instance: ScrollView | null) {
      (innerRef as any).current = instance;
      if (typeof ref === "function") ref(instance);
      else if (ref) (ref as any).current = instance;
    }

    return (
      <ScrollView
        ref={setRef}
        style={[styles.scroll, style]}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        persistentScrollbar={persistentScrollbar ?? Platform.OS === "android"}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={
          keyboardDismissMode ?? (Platform.OS === "ios" ? "interactive" : "on-drag")
        }
        nestedScrollEnabled={nestedScrollEnabled}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        automaticallyAdjustKeyboardInsets={
          automaticallyAdjustKeyboardInsets ?? Platform.OS === "ios"
        }
        {...props}
      />
    );
  },
);

const styles = StyleSheet.create({
  scroll: Platform.select({
    web: {
      flex: 1,
      minHeight: 0,
      overflow: "auto" as any,
    },
    default: {
      flex: 1,
      minHeight: 0,
    },
  }),
  content: {
    paddingBottom: 16,
  },
});
