import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { Icon } from "../../src/components/icons";
import { type ContactMessage, fetchContactMessages, sendContactMessage } from "../../src/lib/contact";
import { toast } from "../../src/lib/toast";
import { colors, fonts, radii, spacing } from "../../src/theme/theme";

export default function Contact() {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);

  const load = useCallback(() => {
    fetchContactMessages().then(setMessages);
  }, []);

  useFocusEffect(load);

  const handleSend = async () => {
    setSending(true);
    const ok = await sendContactMessage(message, subject);
    setSending(false);
    if (!ok) {
      toast.error(t("contact.sendFailed"));
      return;
    }
    setSubject("");
    setMessage("");
    Keyboard.dismiss();
    toast.success(t("contact.sent"));
    load();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="arrowRight" size={18} color={colors.ink} style={styles.backIcon} />
        </Pressable>
        <Text style={styles.title}>{t("contact.title")}</Text>
        <View style={styles.backBtn} />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.subtitle}>{t("contact.subtitle")}</Text>

          <Card style={styles.form}>
            <Text style={styles.label}>{t("contact.subject")}</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder={t("contact.subjectPlaceholder")}
              placeholderTextColor={colors.inkMuted}
            />

            <Text style={styles.label}>{t("contact.message")}</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={message}
              onChangeText={setMessage}
              placeholder={t("contact.messagePlaceholder")}
              placeholderTextColor={colors.inkMuted}
              multiline
              textAlignVertical="top"
            />

            <Button
              label={sending ? t("contact.sending") : t("contact.send")}
              disabled={message.trim().length === 0 || sending}
              onPress={handleSend}
              style={styles.sendBtn}
            />
          </Card>

          {messages && messages.length > 0 ? (
            <View style={styles.history}>
              <Text style={styles.historyTitle}>{t("contact.previousMessages")}</Text>
              {messages.map((m) => (
                <Card key={m.id} style={styles.messageCard}>
                  {m.subject ? <Text style={styles.messageSubject}>{m.subject}</Text> : null}
                  <Text style={styles.messageBody}>{m.message}</Text>
                  <View style={[styles.statusBadge, statusStyle(m.status)]}>
                    <Text style={styles.statusText}>{t(`contact.status.${m.status}`)}</Text>
                  </View>
                  {m.adminReply ? (
                    <View style={styles.replyBox}>
                      <Text style={styles.replyLabel}>{t("contact.reply")}</Text>
                      <Text style={styles.replyBody}>{m.adminReply}</Text>
                    </View>
                  ) : null}
                </Card>
              ))}
            </View>
          ) : messages === null ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
          ) : null}
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

function statusStyle(status: ContactMessage["status"]) {
  if (status === "answered") return { backgroundColor: "#DCFCE7" };
  if (status === "closed") return { backgroundColor: colors.background };
  return { backgroundColor: "#FEF3C7" };
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { transform: [{ scaleX: -1 }] },
  title: { fontFamily: fonts.heading, fontSize: 18, color: colors.ink },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xl },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.inkMuted,
    marginBottom: spacing.lg,
    lineHeight: 19,
  },
  form: { gap: spacing.xs },
  label: { fontSize: 13, fontFamily: fonts.bodyBold, color: colors.inkMuted, marginTop: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    fontSize: 15,
    fontFamily: fonts.body,
    color: colors.ink,
  },
  messageInput: { minHeight: 100 },
  sendBtn: { marginTop: spacing.lg },
  history: { marginTop: spacing.xl, gap: spacing.md },
  historyTitle: { fontFamily: fonts.heading, fontSize: 15, color: colors.ink },
  messageCard: { gap: spacing.xs },
  messageSubject: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  messageBody: { fontFamily: fonts.body, fontSize: 13, color: colors.ink, lineHeight: 19 },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginTop: spacing.xs,
  },
  statusText: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.ink },
  replyBox: {
    marginTop: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    padding: spacing.sm,
  },
  replyLabel: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.inkMuted },
  replyBody: { fontFamily: fonts.body, fontSize: 13, color: colors.ink, marginTop: 2, lineHeight: 18 },
});
