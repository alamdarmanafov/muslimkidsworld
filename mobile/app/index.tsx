import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { isDeviceBound } from "../src/lib/deviceBinding";
import { getSupabaseClient } from "../src/lib/supabase";
import { colors } from "../src/theme/theme";

type Destination = "/child" | "/parent" | "/welcome";

async function resolveDestination(): Promise<Destination> {
  const childBound = await isDeviceBound();
  if (childBound) return "/child";

  try {
    const { data } = await getSupabaseClient().auth.getSession();
    if (data.session) return "/parent";
  } catch {
    // Supabase env vars not configured yet, or the request failed —
    // fall through to the welcome screen either way.
  }

  return "/welcome";
}

export default function Index() {
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    resolveDestination().then(setDestination);
  }, []);

  if (destination === null) {
    return <View style={{ flex: 1, backgroundColor: colors.night }} />;
  }

  return <Redirect href={destination} />;
}
