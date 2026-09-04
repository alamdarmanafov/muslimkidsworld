// mobile/src/components/PendingSyncHost.tsx
//
// Renders nothing — mounted once in app/_layout.tsx purely to replay
// src/lib/offlineQueue.ts's queued quiz results as soon as the device
// has a real connection again: once on app start (in case results
// were queued last session and the device is already online by the
// time this one opens) and again every time NetInfo reports the
// device going from offline to online.

import { useEffect, useRef } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import { flushPendingQuizResults } from "../lib/offlineQueue";

export function PendingSyncHost() {
  const netInfo = useNetInfo();
  const wasOnline = useRef(false);

  useEffect(() => {
    const isOnline = netInfo.isConnected === true && netInfo.isInternetReachable !== false;
    if (isOnline && !wasOnline.current) {
      flushPendingQuizResults();
    }
    wasOnline.current = isOnline;
  }, [netInfo.isConnected, netInfo.isInternetReachable]);

  return null;
}
