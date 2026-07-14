import { useEffect, useState } from "react";
import { roomAPI } from "../services/api";

export function useLiveKit(roomId, password) {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;

    roomAPI
      .join(roomId, {
        password,
      })
      .then((data) => {
        if (!cancelled) {
          setToken(data.token);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.detail || "Failed to join");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      roomAPI.leave(roomId).catch(() => {});
    };
  }, [roomId]);

  return { token, error, loading };
}
