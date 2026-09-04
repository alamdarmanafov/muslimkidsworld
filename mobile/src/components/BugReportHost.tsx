// mobile/src/components/BugReportHost.tsx
//
// Mounted once in app/_layout.tsx (parent and child trees both nest
// under it). Listens for a shake gesture and renders the "report a
// problem" modal — a screenshot preview plus a text field — for
// either a shake or the manual "Problem bildir" button in Profile,
// both of which call bugReportUI.ts's triggerBugReport().

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { submitBugReport, type CapturedScreenshot } from "../lib/bugReport";
import { registerBugReportListener, triggerBugReport } from "../lib/bugReportUI";
import { installShakeListener } from "../lib/shakeDetector";
import { toast } from "../lib/toast";
import { colors, fonts, radii, spacing } from "../theme/theme";

export function BugReportHost() {
  const { t } = useTranslation();
  const [screenshot, setScreenshot] = useState<CapturedScreenshot | null>(null);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    registerBugReportListener((shot) => {
      setScreenshot(shot);
      setVisible(true);
    });
    return () => registerBugReportListener(null);
  }, []);

  useEffect(() => installShakeListener(triggerBugReport), []);

  const close = () => {
    if (sending) return;
    setVisible(false);
    setMessage("");
    setScreenshot(null);
  };

  const handleSend = async () => {
    setSending(true);
    const ok = await submitBugReport(message, screenshot);
    setSending(false);
    if (!ok) {
      toast.error(t("bugReport.sendFailed"));
      return;
    }
    toast.success(t("bugReport.sent"));
    close();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <Text style={styles.title}>{t("bugReport.title")}</Text>
            <Text style={styles.subtitle}>{t("bugReport.subtitle")}</Text>

            {screenshot ? (
              <Image source={{ uri: screenshot.uri }} style={styles.preview} resizeMode="contain" />
            ) : (
              <View style={[styles.preview, styles.previewFallback]}>
                <Text style={styles.previewFallbackText}>{t("bugReport.noScreenshot")}</Text>
              </View>
            )}

            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder={t("bugReport.placeholder")}
              placeholderTextColor={colors.inkMuted}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={close} disabled={sending}>
                <Text style={styles.cancelText}>{t("common.cancel")}</Text>
              </Pressable>
              <Pressable
                style={[styles.sendBtn, (message.trim().length === 0 || sending) && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={message.trim().length === 0 || sending}
              >
                {sending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.sendText}>{t("bugReport.send")}</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(13,27,76,0.55)", justifyContent: "flex-end" },
  sheetWrap: { width: "100%" },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    maxHeight: "88%",
  },
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.inkMuted, lineHeight: 18 },
  preview: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    marginTop: spacing.xs,
  },
  previewFallback: { alignItems: "center", justifyContent: "center" },
  previewFallbackText: { fontFamily: fonts.body, fontSize: 12, color: colors.inkMuted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.md,
    minHeight: 80,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    marginTop: spacing.xs,
  },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  cancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  cancelText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  sendBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendText: { fontFamily: fonts.bodyBold, fontSize: 14, color: "#FFFFFF" },
});
