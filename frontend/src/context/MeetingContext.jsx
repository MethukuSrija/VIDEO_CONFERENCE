import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

const MeetingContext = createContext();

export function MeetingProvider({ children }) {
  const [activePanel, setActivePanel] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const wsRef = useRef(null);

  const addReaction = useCallback((emoji, userName) => {
    const id = `${Date.now()}-${Math.random()}`;
    setReactions((prev) => [...prev, { id, emoji, user: userName }]);
    setTimeout(
      () => setReactions((prev) => prev.filter((r) => r.id !== id)),
      3000,
    );
  }, []);

  const togglePanel = useCallback((panel) => {
    setActivePanel((cur) => (cur === panel ? null : panel));
  }, []);

  return (
    <MeetingContext.Provider
      value={{
        activePanel,
        togglePanel,
        setActivePanel,
        reactions,
        addReaction,
        isRecording,
        setIsRecording,
        handRaised,
        setHandRaised,
        wsRef,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export const useMeeting = () => {
  const ctx = useContext(MeetingContext);
  if (!ctx) throw new Error("useMeeting must be used within MeetingProvider");
  return ctx;
};
