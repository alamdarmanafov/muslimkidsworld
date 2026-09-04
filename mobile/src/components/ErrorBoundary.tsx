// mobile/src/components/ErrorBoundary.tsx
//
// Catches render-time errors anywhere below it in the tree (the one
// class of crash a global handler can't see — see
// ../lib/errorReporting.ts's header comment) and reports them the
// same way, then shows a plain fallback screen instead of a blank/
// frozen app. Deliberately doesn't use react-i18next: i18n may not be
// ready yet, or may itself be the thing that crashed, so this stays
// hardcoded rather than risk a boundary that can't render.

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { reportError } from "../lib/errorReporting";
import { colors, fonts, radii, spacing } from "../theme/theme";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportError(error, { componentStack: info.componentStack ?? undefined });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.screen}>
          <Text style={styles.emoji}>😕</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>
            The app hit an unexpected error. Try again — if it keeps happening, please contact us
            from the Parent app.
          </Text>
          <Pressable style={styles.button} onPress={() => this.setState({ hasError: false })}>
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { fontFamily: fonts.heading, fontSize: 20, color: colors.ink, textAlign: "center" },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.pill,
    marginTop: spacing.lg,
  },
  buttonText: { fontFamily: fonts.bodyBold, fontSize: 15, color: "#FFFFFF" },
});
