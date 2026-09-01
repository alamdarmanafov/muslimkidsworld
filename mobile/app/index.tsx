import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { isDeviceBound } from "../src/lib/deviceBinding";
import { colors } from "../src/theme/theme";

export default function Index() {
  const [bound, setBound] = useState<boolean | null>(null);

  useEffect(() => {
    isDeviceBound().then(setBound);
  }, []);

  if (bound === null) {
    return <View style={{ flex: 1, backgroundColor: colors.night }} />;
  }

  return <Redirect href={bound ? "/child" : "/welcome"} />;
}
